// src/components/SearchInput.tsx
import React from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
};

// 목록 화면 등에서 재사용하는 검색 입력 UI.
export function SearchInput({ containerStyle, inputStyle, ...props }: Props) {
  return (
    <View style={containerStyle}>
      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        {...props}
        style={inputStyle}
      />
    </View>
  );
}
