// src/components/AppHeader.tsx
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ScreenHeader } from './ScreenHeader';

type Props = {
  title: string;
  onBack?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;

  /**
   * default: ScreenHeader 기본 스타일 (배경/보더 포함)
   * transparent: 배경/보더 제거 (카메라/스캔 오버레이용)
   */
  variant?: 'default' | 'transparent';

  containerStyle?: StyleProp<ViewStyle>;
};

export default function AppHeader({
  title,
  onBack,
  left,
  right,
  variant = 'default',
  containerStyle,
}: Props) {
  const transparentStyle: StyleProp<ViewStyle> =
    variant === 'transparent'
      ? { backgroundColor: 'transparent', borderBottomWidth: 0 }
      : undefined;

  return (
    <ScreenHeader
      title={title}
      onBack={onBack}
      left={left}
      right={right}
      sideWidth={72}
      containerStyle={[transparentStyle, containerStyle]}
    />
  );
}
