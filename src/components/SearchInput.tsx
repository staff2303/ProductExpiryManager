import React from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
};

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
