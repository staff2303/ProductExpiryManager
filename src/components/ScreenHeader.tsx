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

  /**
   * (호환용) 왼쪽 기본 뒤로가기(←)를 렌더링합니다.
   * left를 넘기면 onBack은 무시됩니다.
   */
  onBack?: () => void;

  /** 왼쪽 영역 커스텀 렌더 (예: '보관함' 버튼) */
  left?: React.ReactNode;

  /** 오른쪽 영역 커스텀 렌더 (예: '추가' 버튼) */
  right?: React.ReactNode;

  /** 좌/우 영역 폭을 동일하게 고정하면 타이틀이 진짜 중앙에 옵니다 */
  sideWidth?: number;

  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  backTextStyle?: StyleProp<TextStyle>;
  rightStyle?: StyleProp<ViewStyle>;
};

const HEADER_H = is(56);

// 화면 상단 타이틀/헤더 (좌/중/우 3칸 레이아웃)
export function ScreenHeader({
  title,
  onBack,
  left,
  right,
  sideWidth,
  containerStyle,
  titleStyle,
  leftStyle,
  backTextStyle,
  rightStyle,
}: Props) {
  const sideW = sideWidth ?? M.iconBtn;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* LEFT */}
      <View style={[styles.side, { width: sideW }]}>
        {left ? (
          left
        ) : (
          <Pressable
            onPress={onBack}
            disabled={!onBack}
            style={({ pressed }) => [
              styles.leftBtn,
              leftStyle as any,
              pressed && onBack ? { opacity: 0.85 } : null,
              !onBack ? { opacity: 0 } : null,
            ]}
            accessibilityRole={onBack ? 'button' : undefined}
            accessibilityLabel={onBack ? '뒤로가기' : undefined}
          >
            <Text style={[styles.backText, backTextStyle]}>←</Text>
          </Pressable>
        )}
      </View>

      {/* CENTER (✅ 중앙 래퍼로 세로정렬 담당 → Android 타이틀 잘림 방지) */}
      <View style={styles.center}>
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {/* RIGHT */}
      <View style={[styles.sideRight, { width: sideW }, rightStyle]}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_H, // ✅ 고정 높이
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp(14),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  side: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  sideRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  center: {
    flex: 1,
    height: HEADER_H,
    alignItems: 'center',
    justifyContent: 'center', // ✅ 세로 중앙정렬
    paddingHorizontal: sp(12),
  },

  leftBtn: {
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
    textAlign: 'center',
    fontSize: fs(18),
    fontWeight: '900',
    color: colors.text,

    // ✅ Android 타이틀 상단 잘림 방지
    includeFontPadding: false,
    lineHeight: fs(24),
  },
});
