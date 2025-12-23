// src/components/ScreenHeader.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../ui/tokens/colors';
import { fs, is, sp } from '../theme/uiScale';
import { M } from '../theme/metrics';

type Props = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  backTextStyle?: StyleProp<TextStyle>;
  rightStyle?: StyleProp<ViewStyle>;
};

// 화면 상단 타이틀/뒤로가기 헤더.
export function ScreenHeader({
  title,
  onBack,
  right,
  containerStyle,
  titleStyle,
  leftStyle,
  backTextStyle,
  rightStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        onPress={onBack}
        disabled={!onBack}
        style={({ pressed }) => [
          styles.left,
          leftStyle as any,
          pressed && onBack ? { opacity: 0.85 } : null,
          !onBack ? { opacity: 0 } : null,
        ]}
        accessibilityRole={onBack ? 'button' : undefined}
        accessibilityLabel={onBack ? '뒤로가기' : undefined}
      >
        <Text style={[styles.backText, backTextStyle]}>←</Text>
      </Pressable>

      <Text
        style={[styles.title, titleStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      <View style={[styles.right, rightStyle]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp(16),
    paddingTop: sp(12),
    paddingBottom: sp(10),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    fontSize: is(18),
    lineHeight: is(18),
    color: colors.text,
    fontWeight: '900',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: sp(12),
    fontSize: fs(18),
    fontWeight: '900',
    color: colors.text,
  },
  right: {
    minWidth: M.iconBtn,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
