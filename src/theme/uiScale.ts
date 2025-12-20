// src/theme/uiScale.ts
import { PixelRatio } from 'react-native';

/**
 * 정책
 * - 레이아웃(버튼/간격/박스)은 고정(SIZE_SCALE=1.0)
 * - 폰트만 확대(TEXT_SCALE)
 * - 아이콘(텍스트 아이콘 포함)만 확대(ICON_SCALE)
 */
export const SIZE_SCALE = 1.0;
export const TEXT_SCALE = 1.3;
export const ICON_SCALE = 1.2;

export const fs = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * TEXT_SCALE));

export const is = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * ICON_SCALE));

export const sz = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * SIZE_SCALE));

export const sp = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * SIZE_SCALE));
