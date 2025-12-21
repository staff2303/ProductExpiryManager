import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { styles } from './ProductNameScreen.styles';
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
          <AppButton
            label="뒤로"
            onPress={onBack}
            style={[styles.btn, styles.ghost]}
            textStyle={[styles.btnText, styles.ghostText]}
          />

          <AppButton
            label="저장"
            onPress={() => onNext(name.trim())}
            disabled={!canNext}
            style={[styles.btn, !canNext && styles.disabled]}
            textStyle={styles.btnText}
          />
        </View>

        <Text style={styles.hint}>
          상품명은 나중에 수정 기능을 추가할 수 있어요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

