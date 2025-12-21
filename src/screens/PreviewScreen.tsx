import React from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { styles } from './PreviewScreen.styles';
type Props = {
  uri: string;
  onRetake: () => void;
  onUse?: () => void;
};

export default function PreviewScreen({uri, onRetake, onUse}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image source={{uri}} style={styles.image} resizeMode="contain" />
        <View style={styles.bottomBar}>
          <View style={styles.row}>
            <AppButton
              label="다시 찍기"
              onPress={onRetake}
              style={[styles.btn, styles.ghost]}
              textStyle={[styles.btnText, styles.ghostText]}
            />

            <AppButton
              label="이 사진 사용"
              onPress={onUse ?? (() => {})}
              disabled={!onUse}
              style={styles.btn}
              textStyle={styles.btnText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

