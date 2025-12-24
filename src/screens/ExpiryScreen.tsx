import React, { useMemo, useState } from 'react';
import { Image, Platform, Text, TextInput, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { styles } from './ExpiryScreen.styles';
import { colors } from '../ui/tokens/colors';

type Props = {
  uri: string;
  mode?: 'create' | 'edit';
  initialExpiryDate?: string;
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

  const parsedDate = useMemo(() => parseYMD(expiryText), [expiryText]);
  const canSave = !!parsedDate;

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setExpiryText(formatYMD(selected));
  };

  return (
    <Screen padding={0}>
      {/* ✅ 공용 헤더로 통합 */}
      <AppHeader
        title={mode === 'edit' ? '유통기한 수정' : '유통기한 등록'}
        onBack={onBack}
      />

      <View style={styles.body}>
        {/* ===== 이미지 카드 ===== */}
        <View style={styles.card}>
          <View style={styles.previewImageWrap}>
            <Image
              source={{ uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />

            {/* ✅ 다시 찍기 버튼: 이미지 안 가운데 하단 */}
            {mode === 'edit' && onRetakePhoto && (
              <View pointerEvents="box-none" style={styles.overlayBottomCenter}>
                <AppButton
                  label="다시 찍기"
                  onPress={onRetakePhoto}
                  style={styles.retakeOverlayBtn}
                  textStyle={styles.retakeOverlayText}
                />
              </View>
            )}
          </View>
        </View>

        {/* ===== 유통기한 입력 ===== */}
        <Text style={styles.label}>유통기한</Text>

        <View style={styles.dateRow}>
          <TextInput
            value={expiryText}
            onChangeText={v => setExpiryText(autoFormatYMD(v))}
            placeholder="YYYY-MM-DD"
            style={[
              styles.input,
              !parsedDate && expiryText.length > 0 ? styles.inputInvalid : null,
            ]}
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor={colors.textSubtle}
          />

          <AppButton
            icon={<Icon name="calendar-month" size={20} color={colors.text} />}
            onPress={() => setShowPicker(true)}
            style={styles.iconBtn}
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

        {!parsedDate && expiryText.length > 0 && (
          <Text style={styles.error}>날짜 형식이 올바르지 않습니다.</Text>
        )}

        <View style={styles.footer}>
          <AppButton
            label={mode === 'edit' ? '수정 저장' : '저장'}
            onPress={() => onNext({ expiryDate: expiryText })}
            disabled={!canSave}
            style={[styles.primaryBtn, !canSave && styles.btnDisabled]}
            textStyle={styles.primaryText}
          />
        </View>
      </View>
    </Screen>
  );
}
