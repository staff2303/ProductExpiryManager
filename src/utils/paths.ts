// src/utils/paths.ts
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const DB_NAME = 'product_manager.db';

// ✅ Android: /data/user/0/<pkg>/databases
// RNFS.DocumentDirectoryPath = /data/user/0/<pkg>/files  이므로 files → databases로 치환
const androidAppRoot = RNFS.DocumentDirectoryPath.replace(/\/files$/, '');
export const dbDirPath =
  Platform.OS === 'android'
    ? `${androidAppRoot}/databases`
    : RNFS.DocumentDirectoryPath;

export const dbFilePath = `${dbDirPath}/${DB_NAME}`;

// 이미지 폴더는 그대로 files 아래 써도 됨
export const imagesMasterDir = `${RNFS.DocumentDirectoryPath}/images/master`;

export async function ensureDirs() {
  // DB 폴더도 생성(없으면 복사 실패)
  if (!(await RNFS.exists(dbDirPath))) {
    await RNFS.mkdir(dbDirPath);
  }
  if (!(await RNFS.exists(imagesMasterDir))) {
    await RNFS.mkdir(imagesMasterDir);
  }
}

export const masterMainImagePath = (barcode: string) =>
  `${imagesMasterDir}/${barcode}.jpg`;

export const masterThumbImagePath = (barcode: string) =>
  `${imagesMasterDir}/${barcode}_thumb.jpg`;
