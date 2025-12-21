import React, { useMemo, useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import { MasterProduct } from '../db/sqlite';
import Screen from '../components/Screen';
import { AppButton } from '../components/AppButton';
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

      <AppButton
        label="사진 변경"
        onPress={onRetakePhoto}
        style={styles.retakeBtn}
        textStyle={styles.retakeText}
      />

      <Text style={styles.label}>상품명</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="상품명"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <View style={styles.row}>
        <AppButton
          label="뒤로"
          onPress={onBack}
          style={[styles.btn, styles.ghost]}
          textStyle={[styles.btnText, styles.ghostText]}
        />

        <AppButton
          label="저장"
          onPress={() => onSave(name.trim())}
          disabled={!canSave}
          style={[styles.btn, !canSave && styles.disabled]}
          textStyle={styles.btnText}
        />
      </View>

      <Text style={styles.hint}>
        사진은 이 상품을 쓰는 모든 재고에 공통 적용됩니다.
      </Text>
    </Screen>
  );
}

