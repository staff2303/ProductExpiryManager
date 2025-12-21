// src/components/FormRow.tsx
import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

type Props = {
  label: string;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

// 라벨 + 입력 컨트롤을 한 줄로 묶는 폼 행.
export function FormRow({
  label,
  children,
  containerStyle,
  labelStyle,
  contentStyle,
}: Props) {
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}
