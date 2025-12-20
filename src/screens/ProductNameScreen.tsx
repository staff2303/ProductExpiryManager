import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  photoUri: string;
  barcode: string;
  onBack: () => void;
  onNext: (name: string) => void;
};

export default function ProductNameScreen({
  photoUri,
  barcode,
  onBack,
  onNext,
}: Props) {
  const [name, setName] = useState('');

  const canNext = useMemo(() => name.trim().length > 0, [name]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>새 상품 등록</Text>
        <Text style={styles.sub}>바코드: {barcode}</Text>

        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.label}>상품명</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="예) 오뚜기 진라면 매운맛"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onBack}>
            <Text style={[styles.btnText, styles.ghostText]}>뒤로</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, !canNext && styles.disabled]}
            disabled={!canNext}
            onPress={() => onNext(name.trim())}
          >
            <Text style={styles.btnText}>저장</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          상품명은 나중에 수정 기능을 추가할 수 있어요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'black' },
  container: { flex: 1, padding: 16 },
  title: { color: 'white', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sub: { color: '#aaa', marginBottom: 10 },
  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 12,
  },
  label: { color: 'white', marginBottom: 6, fontSize: 14, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#111',
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: { fontSize: 16, fontWeight: '800' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  ghostText: { color: 'white' },
  disabled: { opacity: 0.4 },
  hint: { color: '#aaa', marginTop: 12, fontSize: 12 },
});
