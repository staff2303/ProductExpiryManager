import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

type Props = {
  onBack: () => void;
  onScanned: (barcode: string) => void;
};

export default function BarcodeScanScreen({ onBack, onScanned }: Props) {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);

  // 중복 스캔 방지(연속 인식 방지)
  const lastRef = useRef<{ code: string; ts: number } | null>(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8', 'upc-a', 'code-128', 'qr'],
    onCodeScanned: codes => {
      const v = codes?.[0]?.value?.trim();
      if (!v) return;

      const now = Date.now();
      const last = lastRef.current;
      if (last && last.code === v && now - last.ts < 1200) return;
      lastRef.current = { code: v, ts: now };

      onScanned(v);
    },
  });

  if (!device)
    return <Text style={styles.center}>카메라 장치를 찾는 중...</Text>;
  if (!hasPermission)
    return <Text style={styles.center}>카메라 권한이 필요합니다.</Text>;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />

        <View style={styles.overlay}>
          <Text style={styles.title}>바코드를 중앙에 맞춰주세요</Text>
          <View style={styles.frame} />
          <Text style={styles.back} onPress={onBack}>
            ← 뒤로
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'black' },
  container: { flex: 1 },
  center: { marginTop: 60, textAlign: 'center', color: 'white' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', marginBottom: 16, fontSize: 16, fontWeight: '900' },
  frame: {
    width: 280,
    height: 170,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  back: { color: 'white', marginTop: 18, fontSize: 16, fontWeight: '800' },
});
