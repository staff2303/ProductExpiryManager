import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import Screen from '../components/Screen';
import { AppButton } from '../components/AppButton';
import { styles } from './NewProductFullScreen.styles';
/** ---------- 날짜 유틸 ---------- */
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
/** ---------- 날짜 유틸 끝 ---------- */

type Props = {
  barcode: string;
  onBack: () => void;
  onSave: (payload: {
    photoUri: string;
    name: string;
    expiryDate: string;
  }) => Promise<void>;
};

export default function NewProductFullScreen({
  barcode,
  onBack,
  onSave,
}: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // 4:3 우선 포맷
  const format = useCameraFormat(device, [
    { videoAspectRatio: 4 / 3 },
    { photoResolution: 'max' },
  ]);

  // 세로 UI에서 4:3 프레임을 안정적으로 보이게(3:4)
  const CAMERA_BOX_ASPECT = 3 / 4; // width/height

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [expiryText, setExpiryText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const parsedDate = useMemo(() => parseYMD(expiryText), [expiryText]);

  const canSave =
    !!photoUri && name.trim().length > 0 && !!parsedDate && !saving;

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto();
    setPhotoUri(`file://${photo.path}`);
  };

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setExpiryText(formatYMD(selected));
  };

  if (!device || !hasPermission) {
    return (
      <Screen>
        <Text style={{ color: 'white', marginTop: 40 }}>
          {!device ? '카메라 장치를 찾는 중...' : '카메라 권한이 필요합니다.'}
        </Text>
        <AppButton
          label="뒤로"
          onPress={onBack}
          style={[styles.btn, styles.ghost, { marginTop: 14 }]}
          textStyle={[styles.btnText, styles.ghostText]}
        />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <View style={styles.topRow}>
        <AppButton
          label="←"
          onPress={onBack}
          style={styles.backBtn}
          textStyle={styles.back}
          accessibilityLabel="뒤로"
        />
        <Text style={styles.title}>새 상품 등록</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.barcode}>바코드: {barcode}</Text>

      {/* 프리뷰/미리보기 박스 동일 비율 */}
      {!photoUri ? (
        <View style={[styles.box, { aspectRatio: CAMERA_BOX_ASPECT }]}>
          <Camera
            ref={cameraRef}
            style={styles.cameraFill}
            device={device}
            isActive={true}
            photo={true}
            format={format}
            resizeMode="contain"
          />
          <View style={styles.boxBottom}>
            <AppButton
              label="촬영"
              onPress={takePhoto}
              style={styles.captureBtn}
              textStyle={styles.captureText}
            />
          </View>
        </View>
      ) : (
        <View style={[styles.box, { aspectRatio: CAMERA_BOX_ASPECT }]}>
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <View style={styles.boxBottom}>
            <AppButton
              label="다시 찍기"
              onPress={() => setPhotoUri(null)}
              style={[styles.btn, styles.ghost]}
              textStyle={[styles.btnText, styles.ghostText]}
            />
          </View>
        </View>
      )}

      <Text style={styles.label}>상품명</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="예) 진라면 매운맛"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <Text style={[styles.label, { marginTop: 12 }]}>유통기한</Text>
      <View style={styles.dateRow}>
        <TextInput
          value={expiryText}
          onChangeText={v => setExpiryText(autoFormatYMD(v))}
          placeholder="YYYY-MM-DD 또는 20260115"
          placeholderTextColor="#888"
          style={[
            styles.input,
            { flex: 1 },
            !parsedDate && expiryText.length > 0 ? styles.inputInvalid : null,
          ]}
          keyboardType="number-pad"
          maxLength={10}
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

      <View style={{ marginTop: 18 }}>
        <AppButton
          label={saving ? '저장 중...' : '저장'}
          disabled={!canSave}
          style={[styles.btn, !canSave && styles.disabled]}
          textStyle={styles.btnText}
          onPress={async () => {
            if (!photoUri || !parsedDate) return;
            try {
              setSaving(true);
              await onSave({
                photoUri,
                name: name.trim(),
                expiryDate: expiryText,
              });
              ToastAndroid.show('저장했습니다', ToastAndroid.SHORT);
            } finally {
              setSaving(false);
            }
          }}
        />
      </View>

      <Text style={styles.hint}>
        입력 중 키보드에 가리면 화면을 스크롤하면 됩니다.
      </Text>
    </Screen>
  );
}

