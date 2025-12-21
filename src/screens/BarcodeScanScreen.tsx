import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { AppButton } from '../components/AppButton';
import { styles } from './BarcodeScanScreen.styles';

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
          style={styles.camera}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />

        <View style={styles.overlay}>
          <Text style={styles.title}>바코드를 중앙에 맞춰주세요</Text>
          <View style={styles.frame} />
          <AppButton
            label="← 뒤로"
            onPress={onBack}
            style={styles.backBtn}
            textStyle={styles.back}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

