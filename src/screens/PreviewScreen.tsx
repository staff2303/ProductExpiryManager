import Screen from '../components/Screen';
import React from 'react';
import {
Image, View
} from 'react-native';
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { styles } from './PreviewScreen.styles';
type Props = {
  uri: string;
  onRetake: () => void;
  onUse?: () => void;
  onBack?: () => void;
  title?: string;
};

export default function PreviewScreen({
  uri,
  onRetake,
  onUse,
  onBack,
  title = '미리보기',
}: Props) {
  return (
    <Screen padding={0} scroll={false}>
      <AppHeader title={title} onBack={onBack ?? onRetake} />
      <View style={styles.container}>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
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
    </Screen>
  );
}