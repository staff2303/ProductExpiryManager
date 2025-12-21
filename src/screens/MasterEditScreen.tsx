import React, { useMemo, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MasterProduct } from '../db/sqlite';
import Screen from '../components/Screen';
import { styles } from './MasterEditScreen.styles';
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

