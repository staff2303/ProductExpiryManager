import ImageResizer from 'react-native-image-resizer';

export async function createResizedImages(originalUri: string) {
  // 본문(전체화면/수정화면용): 긴 변 1280, 품질 75
  const main = await ImageResizer.createResizedImage(
    originalUri,
    1280,
    1280,
    'JPEG',
    75,
    0,
  );

  // 썸네일(목록용): 긴 변 256, 품질 60
  const thumb = await ImageResizer.createResizedImage(
    originalUri,
    256,
    256,
    'JPEG',
    60,
    0,
  );

  return {
    mainUri: main.uri,
    thumbUri: thumb.uri,
  };
}
