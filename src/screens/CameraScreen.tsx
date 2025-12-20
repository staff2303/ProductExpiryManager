import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

type Props = {
  onCaptured: (uri: string) => void;
};

export default function CameraScreen({onCaptured}: Props) {
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

  if (!device) return <Text style={styles.center}>카메라 장치를 찾는 중...</Text>;
  if (!hasPermission) return <Text style={styles.center}>카메라 권한이 필요합니다.</Text>;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.btn} onPress={takePhoto}>
            <Text style={styles.btnText}>촬영</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: 'black'},
  container: {flex: 1},
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 20,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  btnText: {fontSize: 16, fontWeight: '700'},
  center: {marginTop: 60, textAlign: 'center'},
});