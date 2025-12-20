import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>제품 유통기한 관리</Text>
        <Text style={styles.sub}>촬영 → 유통기한 입력 → 목록 관리</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24},
  title: {fontSize: 22, fontWeight: '700'},
  sub: {marginTop: 10, fontSize: 14, opacity: 0.7, textAlign: 'center'},
});