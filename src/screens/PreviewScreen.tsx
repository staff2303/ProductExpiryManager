import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  uri: string;
  onRetake: () => void;
  onUse?: () => void;
};

export default function PreviewScreen({uri, onRetake, onUse}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image source={{uri}} style={styles.image} resizeMode="contain" />
        <View style={styles.bottomBar}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onRetake}>
              <Text style={[styles.btnText, styles.ghostText]}>다시 찍기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={onUse}>
              <Text style={styles.btnText}>이 사진 사용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: 'black'},
  container: {flex: 1},
  image: {flex: 1},
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 20,
  },
  row: {flexDirection: 'row', gap: 12},
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: {fontSize: 16, fontWeight: '700'},
  ghost: {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#444'},
  ghostText: {color: 'white'},
});