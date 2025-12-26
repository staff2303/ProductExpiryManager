// src/utils/backupDb.ts
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { zip, unzip } from 'react-native-zip-archive';
import {
  pick,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
  types,
  saveDocuments,
} from '@react-native-documents/picker';
import {
  exportMasterProductsOnly,
  importMasterProductsOnly,
  getDb,
  closeDb,
  initDb,
  updateMasterPhoto,
  MasterBackupRow,
} from '../db/sqlite';
import {
  DB_NAME,
  dbFilePath,
  imagesMasterDir,
  ensureDirs,
  masterMainImagePath,
  masterThumbImagePath,
} from './paths';

type MasterBackupFile = {
  version: 1;
  exportedAt: string;
  table: 'master_products';
  count: number;
  rows: MasterBackupRow[];
};

/**
 * =========================
 * ✅ 제품DB만 백업 (master_products)
 * - Downloads에 JSON 저장
 * - inventory_items는 포함 안 됨
 * =========================
 */
export async function exportMasterOnlyToDownloads() {
  if (Platform.OS !== 'android') return;

  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);

  const fileName = `master_products_backup_${stamp}.json`;
  const targetPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

  // Android 9 이하(<=28) 권한 필요 케이스 대응
  if (Platform.Version < 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('저장소 권한이 필요합니다');
    }
  }

  const rows = await exportMasterProductsOnly();

  const payload: MasterBackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    table: 'master_products',
    count: rows.length,
    rows,
  };

  await RNFS.writeFile(targetPath, JSON.stringify(payload, null, 2), 'utf8');

  const exists = await RNFS.exists(targetPath);
  if (!exists) throw new Error(`백업 파일 생성 실패: ${targetPath}`);

  return targetPath;
}

/**
 * =========================
 * ✅ 제품DB만 불러오기 (master_products)
 * - JSON 파일 선택
 * - master_products만 upsert
 * - inventory_items는 그대로
 * =========================
 */
export async function importMasterOnlyFromFilePicker() {
  if (Platform.OS !== 'android') return;

  try {
    const [file] = await pick({
      type: [types.allFiles],
      allowMultiSelection: false,
    });

    const copies = await keepLocalCopy({
      destination: 'cachesDirectory',
      files: [
        {
          uri: file.uri,
          fileName: file.name ?? 'master_backup.json',
        },
      ],
    });

    const copied = copies[0];
    if (copied.status !== 'success') {
      throw new Error(copied.copyError || '파일 복사 실패');
    }

    const srcPath = copied.localUri.startsWith('file://')
      ? copied.localUri.replace('file://', '')
      : copied.localUri;

    const text = await RNFS.readFile(srcPath, 'utf8');
    const json = JSON.parse(text) as Partial<MasterBackupFile>;

    if (
      !json ||
      json.version !== 1 ||
      json.table !== 'master_products' ||
      !Array.isArray(json.rows)
    ) {
      throw new Error('올바른 제품DB(master) 백업 파일이 아닙니다');
    }

    // DB 열어두고 master만 upsert
    await getDb();
    await importMasterProductsOnly(json.rows as MasterBackupRow[]);

    return true;
  } catch (e: any) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)
      return false;
    throw e;
  }
}

/**
 * =========================
 * ✅ FULL 백업 (DB 파일 + 이미지 파일)
 * - backup zip 안에 db/<DB_NAME> + images/master/* 포함
 * - 불러오기 시 자동 unzip → 이미지 복사 → DB 파일 교체 → DB 재오픈
 * =========================
 */

type FullBackupMeta = {
  version: 1;
  exportedAt: string;
  dbName: string;
  imagesRoot: string;
};

async function safeUnlink(path: string) {
  try {
    if (await RNFS.exists(path)) await RNFS.unlink(path);
  } catch {}
}

async function copyFileOverwrite(src: string, dst: string) {
  await safeUnlink(dst);
  await RNFS.copyFile(src, dst);
}

async function copyDirRecursive(srcDir: string, dstDir: string) {
  if (!(await RNFS.exists(srcDir))) return;
  if (!(await RNFS.exists(dstDir))) await RNFS.mkdir(dstDir);

  const items = await RNFS.readDir(srcDir);
  for (const it of items) {
    const src = it.path;
    const dst = `${dstDir}/${it.name}`;
    if (it.isDirectory()) {
      await copyDirRecursive(src, dst);
    } else {
      await copyFileOverwrite(src, dst);
    }
  }
}

/**
 * 현재 DB의 master_products가 가리키는 이미지가 관리 폴더(images/master) 밖에 있으면,
 * 가능한 경우(파일 존재 시) 관리 폴더로 복사하고 DB 경로도 업데이트해서 "DB 파일 백업"이 의미 있게 만듦.
 */
async function normalizeMasterImagesIntoManagedDir() {
  await ensureDirs();

  const d = await getDb();
  const [res] = await d.executeSql(
    `SELECT id, barcode, image_uri, thumb_uri
     FROM master_products
     ORDER BY id ASC`,
  );

  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows.item(i) as {
      id: number;
      barcode: string | null;
      image_uri: string;
      thumb_uri: string;
    };

    if (!row.barcode) continue;

    const desiredMain = masterMainImagePath(row.barcode);
    const desiredThumb = masterThumbImagePath(row.barcode);

    // main
    let main = row.image_uri;
    if (main && !main.includes(imagesMasterDir)) {
      const src = main.startsWith('file://')
        ? main.replace('file://', '')
        : main;
      if (await RNFS.exists(src)) {
        await copyFileOverwrite(src, desiredMain);
        main = `file://${desiredMain}`;
      }
    } else if (
      main &&
      !main.startsWith('file://') &&
      main.includes(imagesMasterDir)
    ) {
      main = `file://${main}`;
    }

    // thumb
    let thumb = row.thumb_uri;
    if (thumb && !thumb.includes(imagesMasterDir)) {
      const src = thumb.startsWith('file://')
        ? thumb.replace('file://', '')
        : thumb;
      if (await RNFS.exists(src)) {
        await copyFileOverwrite(src, desiredThumb);
        thumb = `file://${desiredThumb}`;
      }
    } else if (
      thumb &&
      !thumb.startsWith('file://') &&
      thumb.includes(imagesMasterDir)
    ) {
      thumb = `file://${thumb}`;
    }

    // DB 업데이트 (id 사용)
    if (main !== row.image_uri || thumb !== row.thumb_uri) {
      await updateMasterPhoto(row.id, main, thumb);
    }
  }
}

export async function exportFullBackupZipToDownloads() {
  if (Platform.OS !== 'android') return;

  // Ensure DB is initialized and images are normalized into managed dir before copying DB file.
  await getDb();
  await initDb();
  await normalizeMasterImagesIntoManagedDir();

  await ensureDirs();

  const rows = await exportMasterProductsOnly();
  console.log('export rows:', rows.length);
  if (rows.length === 0) {
    throw new Error(
      '백업할 master_products가 0개입니다. 먼저 상품을 등록하세요.',
    );
  }

  // Build temp folder
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tmpRoot = `${RNFS.CachesDirectoryPath}/backup_${stamp}`;
  const tmpDbDir = `${tmpRoot}/db`;
  const tmpImgDir = `${tmpRoot}/images/master`;

  await RNFS.mkdir(tmpDbDir);
  await RNFS.mkdir(tmpImgDir);

  // meta.json
  const meta: FullBackupMeta = {
    version: 1,
    exportedAt: new Date().toISOString(),
    dbName: DB_NAME,
    imagesRoot: 'images/master',
  };
  await RNFS.writeFile(
    `${tmpRoot}/meta.json`,
    JSON.stringify(meta, null, 2),
    'utf8',
  );

  // DB file copy (Documents location)
  if (!(await RNFS.exists(dbFilePath))) {
    throw new Error('DB 파일을 찾을 수 없습니다');
  }
  await copyFileOverwrite(dbFilePath, `${tmpDbDir}/${DB_NAME}`);

  // images copy (if any)
  await copyDirRecursive(imagesMasterDir, tmpImgDir);

  // zip
  const outZip = `${RNFS.CachesDirectoryPath}/product_backup_${stamp}.zip`;
  await safeUnlink(outZip);
  await zip(tmpRoot, outZip);

  try {
    const res = await saveDocuments({
      sourceUris: [`file://${outZip}`],
      fileName: `product_backup_${stamp}.zip`,
      mimeType: 'application/zip',
    });

    return !!res;
  } catch (e: any) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
      return false;
    }
    throw e;
  }
}

export async function importFullBackupZipFromPicker() {
  if (Platform.OS !== 'android') return;

  try {
    const [file] = await pick({
      type: [types.allFiles],
      allowMultiSelection: false,
    });

    const copies = await keepLocalCopy({
      destination: 'cachesDirectory',
      files: [{ uri: file.uri, fileName: file.name ?? 'backup.zip' }],
    });

    const copied = copies[0];
    if (copied.status !== 'success') {
      throw new Error(copied.copyError || '파일 복사 실패');
    }

    const zipPath = copied.localUri.startsWith('file://')
      ? copied.localUri.replace('file://', '')
      : copied.localUri;

    const outDir = `${RNFS.CachesDirectoryPath}/restore_${Date.now()}`;
    await RNFS.mkdir(outDir);
    await unzip(zipPath, outDir);

    // validate meta
    const metaPath = `${outDir}/meta.json`;
    if (!(await RNFS.exists(metaPath))) {
      throw new Error('올바른 백업 zip이 아닙니다 (meta.json 없음)');
    }
    const meta = JSON.parse(
      await RNFS.readFile(metaPath, 'utf8'),
    ) as Partial<FullBackupMeta>;
    if (!meta || meta.version !== 1 || meta.dbName !== DB_NAME) {
      throw new Error('백업 버전/DB 이름이 맞지 않습니다');
    }

    // images restore
    await ensureDirs();
    await copyDirRecursive(`${outDir}/images/master`, imagesMasterDir);

    // DB restore: close → replace file → reopen
    await closeDb();
    const restoredDb = `${outDir}/db/${DB_NAME}`;
    if (!(await RNFS.exists(restoredDb))) {
      throw new Error('백업 zip 안에 db 파일이 없습니다');
    }
    await copyFileOverwrite(restoredDb, dbFilePath);

    await initDb();
    return true;
  } catch (e: any) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) return false;
    throw e;
  }
}
