import Screen from '../components/Screen';
import React, { useEffect, useRef, useState } from 'react';
import {
Text, View
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { styles } from './CameraScreen.styles';
type Props = {
  onCaptured: (uri: string) => void;
  onBack?: () => void;
  title?: string;
};

export default function CameraScreen({
  onCaptured,
  onBack,
  title = '카메라',
}: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto();
    // Android에서 photo.path는 파일 경로. RN Image에는 file://가 필요함.
    onCaptured(`file://${photo.path}`);
  };

  if (!device)
    return <Text style={styles.center}>카메라 장치를 찾는 중...</Text>;
  if (!hasPermission)
    return <Text style={styles.center}>카메라 권한이 필요합니다.</Text>;

  return (
    <Screen padding={0} scroll={false}>
      <AppHeader title={title} onBack={onBack} variant="transparent" />
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.bottomBar}>
          <AppButton
            label="촬영"
            onPress={takePhoto}
            style={styles.btn}
            textStyle={styles.btnText}
          />
        </View>
      </View>
    </Screen>
  );
}