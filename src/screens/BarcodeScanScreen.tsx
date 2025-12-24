import Screen from '../components/Screen';
// src/screens/BarcodeScanScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
Text, View, useWindowDimensions
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { styles } from './BarcodeScanScreen.styles';

type Props = {
  onBack: () => void;
  onScanned: (barcode: string) => void;
};

// 합의 파라미터
const WINDOW_MS = 1000;
const STREAK_N = 3;
const COUNT_N = 5;
const COOLDOWN_MS = 1000;

export default function BarcodeScanScreen({ onBack, onScanned }: Props) {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);

  const { width: viewW, height: viewH } = useWindowDimensions();

  // ROI(스캔 박스)
  const roi = useMemo(() => {
    const w = viewW * 0.78;
    const h = viewH * 0.22;
    const x = (viewW - w) / 2;
    const y = viewH * 0.38;
    return { x, y, w, h };
  }, [viewW, viewH]);

  // 마스크 계산
  const mask = useMemo(() => {
    const topMaskBottom = viewH - roi.y;
    const bottomMaskTop = roi.y + roi.h;
    const sideMaskTop = roi.y;
    const sideMaskBottom = viewH - (roi.y + roi.h);
    const leftMaskWidth = roi.x;
    const rightMaskWidth = viewW - (roi.x + roi.w);

    return {
      topMaskBottom,
      bottomMaskTop,
      sideMaskTop,
      sideMaskBottom,
      leftMaskWidth,
      rightMaskWidth,
    };
  }, [roi, viewW, viewH]);

  // 합의용 ref
  const lastAcceptedAtRef = useRef(0);
  const lastValueRef = useRef<string | null>(null);
  const streakRef = useRef(0);
  const bucketRef = useRef<Map<string, { count: number; firstAt: number }>>(
    new Map(),
  );

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const confirmIfConsensus = (value: string) => {
    const now = Date.now();
    if (now - lastAcceptedAtRef.current < COOLDOWN_MS) return;

    if (lastValueRef.current === value) streakRef.current += 1;
    else {
      lastValueRef.current = value;
      streakRef.current = 1;
    }

    const bucket = bucketRef.current;
    const prev = bucket.get(value);
    if (!prev || now - prev.firstAt > WINDOW_MS) {
      bucket.set(value, { count: 1, firstAt: now });
    } else {
      bucket.set(value, { count: prev.count + 1, firstAt: prev.firstAt });
    }

    const cnt = bucket.get(value)!.count;

    if (streakRef.current >= STREAK_N || cnt >= COUNT_N) {
      lastAcceptedAtRef.current = now;
      bucket.clear();
      streakRef.current = 0;
      lastValueRef.current = null;
      onScanned(value);
    }
  };

  // ROI 필터: 코드 중심이 ROI 안이면 통과
  const isInRoi = (frame: any) => {
    if (!frame) return true;
    const cx = frame.x + frame.width / 2;
    const cy = frame.y + frame.height / 2;
    return (
      cx >= roi.x && cx <= roi.x + roi.w && cy >= roi.y && cy <= roi.y + roi.h
    );
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'code-128', 'qr'],
    onCodeScanned: codes => {
      if (!codes?.length) return;

      const best =
        codes.find(c => c?.value && isInRoi((c as any).frame)) ??
        codes.find(c => c?.value);

      const v = best?.value?.trim();
      if (!v) return;

      confirmIfConsensus(v);
    },
  });

  if (!device)
    return <Text style={styles.center}>카메라 장치를 찾는 중...</Text>;
  if (!hasPermission)
    return <Text style={styles.center}>카메라 권한이 필요합니다.</Text>;

  // L자 코너 길이/두께(ROI 크기에 비례)
  const CORNER_LEN = Math.max(18, Math.floor(roi.w * 0.08)); // 가로의 8% (최소 18)
  const CORNER_THICK = 3;

  // 중앙 빨간선(바코드 수평 정렬용): ROI 중앙 높이에 가로선
  const redLineTop = roi.y + roi.h / 2 - 1; // 2px 라인 기준

  return (
    <Screen padding={0} scroll={false}>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />

        <View style={styles.overlay} pointerEvents="box-none">
          <AppHeader
            title="바코드 스캔"
            onBack={onBack}
            variant="transparent"
            containerStyle={{ position: 'absolute', left: 0, right: 0, top: 0 }}
          />
          <Text style={styles.title}>바코드를 중앙에 맞춰주세요</Text>

          {/* 마스킹(프레임 바깥 어둡게) */}
          <View
            style={[styles.maskTop, { bottom: mask.topMaskBottom }]}
            pointerEvents="none"
          />
          <View
            style={[styles.maskBottom, { top: mask.bottomMaskTop }]}
            pointerEvents="none"
          />
          <View
            style={[
              styles.maskLeft,
              {
                top: mask.sideMaskTop,
                bottom: mask.sideMaskBottom,
                width: mask.leftMaskWidth,
              },
            ]}
            pointerEvents="none"
          />
          <View
            style={[
              styles.maskRight,
              {
                top: mask.sideMaskTop,
                bottom: mask.sideMaskBottom,
                width: mask.rightMaskWidth,
              },
            ]}
            pointerEvents="none"
          />

          {/* ROI 가이드 영역(터치 막지 않게) */}
          <View
            style={[
              styles.roiBox,
              { left: roi.x, top: roi.y, width: roi.w, height: roi.h },
            ]}
            pointerEvents="none"
          >
            {/* 중앙 빨간 기준선 */}
            <View style={[styles.redLine, { top: roi.h / 2 - 1 }]} />

            {/* L자 코너 4개 */}
            {/* TL */}
            <View
              style={[
                styles.cornerH,
                { left: 0, top: 0, width: CORNER_LEN, height: CORNER_THICK },
              ]}
            />
            <View
              style={[
                styles.cornerV,
                { left: 0, top: 0, width: CORNER_THICK, height: CORNER_LEN },
              ]}
            />

            {/* TR */}
            <View
              style={[
                styles.cornerH,
                {
                  right: 0,
                  top: 0,
                  width: CORNER_LEN,
                  height: CORNER_THICK,
                },
              ]}
            />
            <View
              style={[
                styles.cornerV,
                {
                  right: 0,
                  top: 0,
                  width: CORNER_THICK,
                  height: CORNER_LEN,
                },
              ]}
            />

            {/* BL */}
            <View
              style={[
                styles.cornerH,
                {
                  left: 0,
                  bottom: 0,
                  width: CORNER_LEN,
                  height: CORNER_THICK,
                },
              ]}
            />
            <View
              style={[
                styles.cornerV,
                {
                  left: 0,
                  bottom: 0,
                  width: CORNER_THICK,
                  height: CORNER_LEN,
                },
              ]}
            />

            {/* BR */}
            <View
              style={[
                styles.cornerH,
                {
                  right: 0,
                  bottom: 0,
                  width: CORNER_LEN,
                  height: CORNER_THICK,
                },
              ]}
            />
            <View
              style={[
                styles.cornerV,
                {
                  right: 0,
                  bottom: 0,
                  width: CORNER_THICK,
                  height: CORNER_LEN,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}