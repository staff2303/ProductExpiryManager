import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './PreviewScreen.styles';
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

