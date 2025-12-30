// src/screens/ExpiryScreen.tsx
import React, { useMemo, useState } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { styles } from './ExpiryScreen.styles';

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
  const [expiryDate, setExpiryDate] = useState<Date | null>(() =>
    initialExpiryDate ? parseYMD(initialExpiryDate) : null,
  );
  const [showPicker, setShowPicker] = useState(false);

  const expiryText = useMemo(
    () => (expiryDate ? formatYMD(expiryDate) : ''),
    [expiryDate],
  );

  const canSave = !!expiryDate;

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;

    const d = new Date(selected);
    d.setHours(0, 0, 0, 0);
    setExpiryDate(d);
  };

  return (
    <Screen padding={0}>
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

        {/* ===== 유통기한 입력(버튼-only) ===== */}
        <Text style={styles.label}>유통기한</Text>

        <AppButton
          label={expiryDate ? formatYMD(expiryDate) : '유통기한 선택'}
          onPress={() => setShowPicker(true)}
          style={[styles.datePill, !expiryDate && styles.datePillEmpty]}
          textStyle={[
            styles.datePillText,
            !expiryDate && styles.datePillTextEmpty,
          ]}
          accessibilityLabel="유통기한 선택"
        />

        {showPicker && (
          <DateTimePicker
            value={expiryDate ?? new Date()}
            mode="date"
            display="calendar"
            onChange={onPickerChange}
          />
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
