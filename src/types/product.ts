export type Product = {
  id: string;            // uuid 같은 걸로 생성
  imageUri: string;      // 촬영한 사진 경로
  expiryDate: string;    // YYYY-MM-DD
  createdAt: string;     // ISO string
};