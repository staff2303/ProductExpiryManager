import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Platform, Text, TextInput, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Screen from '../components/Screen';
import { AppButton } from '../components/AppButton';
import { styles } from './ExpiryScreen.styles';
type Props = {
  uri: string;
  mode?: 'create' | 'edit';
  initialExpiryDate?: string; // YYYY-MM-DD
  onBack: () => void;
  onNext: (data: { expiryDate: string }) => void;
  onRetakePhoto?: () => void;
};

/* ---------- 날짜 유틸 ---------- */
function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatYMD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function autoFormatYMD(input: string) {
  const nums = input.replace(/\D/g, '').slice(0, 8);
  if (nums.length <= 4) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 4)}-${nums.slice(4)}`;
  return `${nums.slice(0, 4)}-${nums.slice(4, 6)}-${nums.slice(6)}`;
}
function parseYMD(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
    return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function isPast(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x < today;
}
/* ---------- 날짜 유틸 끝 ---------- */

export default function ExpiryScreen({
  uri,
  mode = 'create',
  initialExpiryDate = '',
  onBack,
  onNext,
  onRetakePhoto,
}: Props) {
  const [expiryText, setExpiryText] = useState(initialExpiryDate);
  const [showPicker, setShowPicker] = useState(false);

  /* ---------- 이미지 실제 비율 계산 ---------- */
  const [imgSize, setImgSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width - 32; // padding 16*2
    Image.getSize(
      uri,
      (w, h) => {
        const ratio = h / w;
        setImgSize({ width: screenWidth, height: screenWidth * ratio });
      },
      () => {
        setImgSize({ width: screenWidth, height: screenWidth * 0.75 }); // fallback
      },
    );
  }, [uri]);
  /* ---------- 이미지 계산 끝 ---------- */

  const parsedDate = useMemo(() => parseYMD(expiryText), [expiryText]);
  const isPastDate = parsedDate ? isPast(parsedDate) : false;
  const canSave = !!parsedDate;

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setExpiryText(formatYMD(selected));
  };

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>
        {mode === 'edit' ? '유통기한 수정' : '유통기한 등록'}
      </Text>

      {imgSize && (
        <Image
          source={{ uri }}
          style={[styles.photo, imgSize]}
          resizeMode="contain"
        />
      )}

      {mode === 'edit' && onRetakePhoto && (
        <AppButton
          label="사진 다시 찍기"
          onPress={onRetakePhoto}
          style={styles.retakeBtn}
          textStyle={styles.retakeText}
        />
      )}

      <Text style={styles.label}>유통기한</Text>

      <View style={styles.dateRow}>
        <TextInput
          value={expiryText}
          onChangeText={v => setExpiryText(autoFormatYMD(v))}
          placeholder="YYYY-MM-DD 또는 20260115"
          style={[
            styles.input,
            !parsedDate && expiryText.length > 0 ? styles.inputInvalid : null,
          ]}
          keyboardType="number-pad"
          maxLength={10}
          placeholderTextColor="#888"
        />
        <AppButton
          label="📅"
          onPress={() => setShowPicker(true)}
          style={styles.calendarBtn}
          textStyle={styles.calendarBtnText}
          accessibilityLabel="달력 열기"
        />
      </View>

      {showPicker && (
        <DateTimePicker
          value={parsedDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={onPickerChange}
        />
      )}

      {isPastDate && (
        <Text style={styles.warn}>
          ⚠ 이미 지난 날짜입니다. 그래도 저장은 가능합니다.
        </Text>
      )}

      <View style={styles.row}>
        <AppButton
          label="뒤로"
          onPress={onBack}
          style={[styles.btn, styles.btnGhost]}
          textStyle={[styles.btnText, styles.btnGhostText]}
        />

        <AppButton
          label={mode === 'edit' ? '수정 저장' : '저장'}
          onPress={() => onNext({ expiryDate: expiryText })}
          disabled={!canSave}
          style={[styles.btn, !canSave && styles.btnDisabled]}
          textStyle={styles.btnText}
        />
      </View>

      <Text style={styles.hint}>
        숫자만 입력해도 날짜 형식이 자동으로 맞춰집니다.
      </Text>
    </Screen>
  );
}

