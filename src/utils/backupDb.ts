// src/utils/backupDb.ts
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import {
  pick,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
  types,
} from '@react-native-documents/picker';
import {
  exportMasterProductsOnly,
  importMasterProductsOnly,
  getDb,
  MasterBackupRow,
} from '../db/sqlite';

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
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) return;
    throw e;
  }
}
