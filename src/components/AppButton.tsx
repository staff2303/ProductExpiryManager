// src/components/AppButton.tsx
import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  // 아이콘-only 버튼도 허용
  label?: string;
  icon?: ReactNode;
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
  icon,
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
      accessibilityLabel={accessibilityLabel ?? label ?? '버튼'}
      pressRetentionOffset={{ top: 24, left: 24, right: 24, bottom: 24 }} // 취소 덜 되게
      style={({ pressed }) => [
        style as any,
        pressed && !disabled ? { opacity: 0.85 } : null,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!!icon && (
          <View style={{ marginRight: label ? 8 : 0 }}>
            {icon}
          </View>
        )}
        {!!label && <Text style={textStyle}>{label}</Text>}
      </View>
    </Pressable>
  );
}
