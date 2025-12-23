import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../ui/tokens/colors';

type Props = {
  children: React.ReactNode;
  padding?: number;
  contentStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  scroll?: boolean;
};

export default function Screen({
  children,
  padding = 16,
  contentStyle,
  keyboardVerticalOffset = 0,
  scroll = true,
}: Props) {
  // ✅ 카메라/지도 같은 네이티브 뷰는 ScrollView/KAV에서 문제 나는 경우가 많아서 완전히 분리
  if (!scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.noScroll, { padding }, contentStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { padding }, contentStyle]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  noScroll: { flex: 1 }, // ✅ 카메라용
});
