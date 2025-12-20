import React, { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MasterProduct } from '../db/sqlite';
import Screen from '../components/Screen';

type Props = {
  product: MasterProduct;
  currentImageUri: string;
  onBack: () => void;
  onRetakePhoto: () => void;
  onSave: (name: string) => void;
};

export default function MasterEditScreen({
  product,
  currentImageUri,
  onBack,
  onRetakePhoto,
  onSave,
}: Props) {
  const [name, setName] = useState(product.name);
  const canSave = useMemo(() => name.trim().length > 0, [name]);

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>총상품 편집</Text>
      <Text style={styles.sub}>바코드: {product.barcode ?? '-'}</Text>

      <Image
        source={{ uri: currentImageUri }}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.retakeBtn} onPress={onRetakePhoto}>
        <Text style={styles.retakeText}>사진 변경</Text>
      </TouchableOpacity>

      <Text style={styles.label}>상품명</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="상품명"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onBack}>
          <Text style={[styles.btnText, styles.ghostText]}>뒤로</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, !canSave && styles.disabled]}
          disabled={!canSave}
          onPress={() => onSave(name.trim())}
        >
          <Text style={styles.btnText}>저장</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        사진은 이 상품을 쓰는 모든 재고에 공통 적용됩니다.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: 'white', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sub: { color: '#aaa', marginBottom: 10 },

  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 12,
  },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 14,
  },
  retakeText: { color: '#ddd', fontWeight: '800' },

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
  btnText: { fontSize: 16, fontWeight: '900' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  ghostText: { color: 'white' },
  disabled: { opacity: 0.4 },

  hint: { color: '#aaa', marginTop: 12, fontSize: 12 },
});
