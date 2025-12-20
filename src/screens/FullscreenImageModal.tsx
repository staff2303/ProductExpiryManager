import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  uri: string;
  onClose: () => void;
};

export default function FullscreenImageModal({ uri, onClose }: Props) {
  // 간단한 “확대” 느낌을 위해: 화면 꽉 채우고, 필요하면 스크롤/줌은 다음 단계
  // (기본 Image는 핀치줌 미지원이라, 핀치 줌까지 원하면 라이브러리 추가가 필요)
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'black' },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  closeText: { color: 'white', fontWeight: '800' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width, height: height * 0.9 },
});
