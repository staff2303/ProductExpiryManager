// src/components/SearchInput.tsx
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../ui/tokens/colors';
import { fs, sp } from '../theme/uiScale';
import { M } from '../theme/metrics';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
};

// 목록 화면 등에서 재사용하는 검색 입력 UI.
export function SearchInput({ containerStyle, inputStyle, ...props }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        {...props}
        placeholderTextColor={colors.textSubtle}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sp(14),
    paddingHorizontal: M.inputPadX,
    minHeight: M.inputH,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: M.inputPadY,
    fontSize: fs(16),
  },
});
