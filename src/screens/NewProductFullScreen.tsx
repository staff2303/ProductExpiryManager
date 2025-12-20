import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
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
        <TouchableOpacity
          style={[styles.btn, styles.ghost, { marginTop: 14 }]}
          onPress={onBack}
        >
          <Text style={[styles.btnText, styles.ghostText]}>뒤로</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>새 상품 등록</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.barcode}>바코드: {barcode}</Text>

      {/* 프리뷰/미리보기 박스 동일 비율 */}
      {!photoUri ? (
        <View style={[styles.box, { aspectRatio: CAMERA_BOX_ASPECT }]}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            format={format}
            resizeMode="contain"
          />
          <View style={styles.boxBottom}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
              <Text style={styles.captureText}>촬영</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.btn, styles.ghost]}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={[styles.btnText, styles.ghostText]}>다시 찍기</Text>
            </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.calendarBtnText}>📅</Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          style={[styles.btn, !canSave && styles.disabled]}
          disabled={!canSave}
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
        >
          <Text style={styles.btnText}>{saving ? '저장 중...' : '저장'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        입력 중 키보드에 가리면 화면을 스크롤하면 됩니다.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  back: { color: 'white', fontSize: 26, fontWeight: '900', width: 28 },
  title: { color: 'white', fontSize: 20, fontWeight: '900' },
  barcode: { color: '#aaa', marginBottom: 10 },

  box: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 12,
  },
  boxBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    alignItems: 'center',
  },

  captureBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  captureText: { fontSize: 16, fontWeight: '900' },

  previewImage: { width: '100%', height: '100%' },

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
  inputInvalid: { borderColor: '#a33' },

  dateRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  calendarBtn: {
    width: 48,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBtnText: { fontSize: 18 },

  btn: {
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
