import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

/**
 * Thin wrapper to standardize button markup.
 * Styling is controlled by passing `style`/`textStyle` from screen styles.
 */
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
      style={({ pressed }) => [style as any, pressed && !disabled ? { opacity: 0.85 } : null, disabled ? { opacity: 0.5 } : null]}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
