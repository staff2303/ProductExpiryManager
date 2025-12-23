// src/components/AppButton.tsx
import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

// 앱 전반에서 재사용하는 버튼 UI.
export function AppButton({
  label,
  onPress,
  disabled,
  style,
  textStyle,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      pressRetentionOffset={{ top: 24, left: 24, right: 24, bottom: 24 }} // 취소 덜 되게
      style={({ pressed }) => [
        style as any,
        pressed && !disabled ? { opacity: 0.85 } : null,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
