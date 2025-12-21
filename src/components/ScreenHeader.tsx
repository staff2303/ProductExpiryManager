// src/components/ScreenHeader.tsx
import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

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
    <View style={containerStyle}>
      <Pressable
        onPress={onBack}
        disabled={!onBack}
        style={({ pressed }) => [leftStyle as any, pressed && onBack ? { opacity: 0.85 } : null, !onBack ? { opacity: 0 } : null]}
        accessibilityRole={onBack ? 'button' : undefined}
        accessibilityLabel={onBack ? '뒤로가기' : undefined}
      >
        <Text style={backTextStyle}>←</Text>
      </Pressable>

      <Text style={titleStyle} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      <View style={rightStyle}>{right}</View>
    </View>
  );
}
