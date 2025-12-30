import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  findNodeHandle,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  UIManager,
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
import AppHeader from '../components/AppHeader';
import { AppButton } from '../components/AppButton';
import { colors } from '../ui/tokens/colors';
import { styles } from './NewProductFullScreen.styles';

/** ---------- 날짜 유틸 ---------- */
function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatYMD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
/** ---------- 날짜 유틸 끝 ---------- */

type Props = {
  barcode: string;
  requireExpiry?: boolean;
  onBack: () => void;
  onSave: (payload: {
    photoUri: string;
    name: string;
    expiryDate?: string;
  }) => Promise<void>;
};

export default function NewProductFullScreen({
  barcode,
  requireExpiry = true,
  onBack,
  onSave,
}: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  const format = useCameraFormat(device, [
    { videoAspectRatio: 4 / 3 },
    { photoResolution: 'max' },
  ]);

  const [hasPermission, setHasPermission] = useState(false);
  const [camOpen, setCamOpen] = useState(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ 키보드/스크롤 보정
  const scrollRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);

  const [keyboardH, setKeyboardH] = useState(0);
  const [footerH, setFooterH] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      const h = e.endCoordinates?.height ?? 0;
      setKeyboardH(h);

      // 키보드 뜬 직후 + 살짝 뒤에 한 번 더 보정(기기별 타이밍)
      setTimeout(() => {
        if (nameInputRef.current?.isFocused()) ensureVisible();
      }, 0);
      setTimeout(() => {
        if (nameInputRef.current?.isFocused()) ensureVisible();
      }, 80);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardH(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /**
   * ✅ 경고 제거 버전:
   * - ref.measureLayout() 대신 UIManager.measureLayout() 사용
   * - inputTag / innerTag를 findNodeHandle로 숫자 태그로 만든 뒤 측정
   */
  const ensureVisible = () => {
    const scroller = scrollRef.current;
    const input = nameInputRef.current;
    if (!scroller || !input) return;

    const inputTag = findNodeHandle(input);

    // ScrollView inner view 태그
    // RN 버전에 따라 getInnerViewNode가 없을 수도 있어서 방어
    // @ts-ignore
    const inner = scroller.getInnerViewNode?.() ?? scroller;
    const innerTag = typeof inner === 'number' ? inner : findNodeHandle(inner);

    if (!inputTag || !innerTag) return;

    UIManager.measureLayout(
      inputTag,
      innerTag,
      () => {},
      (x, y) => {
        const targetY = Math.max(0, y - 80); // 위 여유
        scroller.scrollTo({ y: targetY, animated: true });
      },
    );
  };

  useEffect(() => {
    (async () => {
      const cur = await Camera.getCameraPermissionStatus();
      if (cur === 'granted') {
        setHasPermission(true);
        return;
      }
      const next = await Camera.requestCameraPermission();
      setHasPermission(next === 'granted');
    })();
  }, []);

  const canSave = useMemo(() => {
    const baseOk = !!photoUri && name.trim().length > 0 && !saving;
    return requireExpiry ? baseOk && !!expiryDate : baseOk;
  }, [photoUri, name, expiryDate, saving, requireExpiry]);

  const openCamera = async () => {
    if (!hasPermission) {
      const next = await Camera.requestCameraPermission();
      const ok = next === 'granted';
      setHasPermission(ok);
      if (!ok) return;
    }
    setCamOpen(true);
  };

  const takePhotoInModal = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto();
    setPhotoUri(`file://${photo.path}`);
    setCamOpen(false);
  };

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setExpiryDate(selected);
  };

  const onFooterLayout = (e: LayoutChangeEvent) => {
    setFooterH(e.nativeEvent.layout.height);
  };

  return (
    <Screen padding={0} contentStyle={styles.screen} scroll={false}>
      <KeyboardAvoidingView
        style={styles.root}
        enabled={Platform.OS === 'ios'}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppHeader title="새 상품 등록" onBack={onBack} />
        <Text style={styles.subText}>바코드: {barcode}</Text>

        {/* ✅ A 방식: 사진칸까지 ScrollView 안으로 */}
        <ScrollView
          ref={scrollRef}
          style={styles.formScroll}
          contentContainerStyle={[
            styles.formScrollContent,
            { paddingBottom: footerH + keyboardH + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* 프리뷰 카드(스크롤됨) */}
          <View style={styles.previewCard}>
            {!photoUri ? (
              <View style={styles.previewPlaceholder}>
                <Text style={styles.previewPlaceholderTitle}>
                  제품 사진이 필요해요
                </Text>
                <Text style={styles.previewPlaceholderDesc}>
                  아래 버튼을 눌러 촬영하세요.
                </Text>

                <AppButton
                  label="제품촬영"
                  onPress={openCamera}
                  style={styles.captureBtn}
                  textStyle={styles.captureText}
                />
              </View>
            ) : (
              <View style={styles.previewImageWrap}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />

                <View pointerEvents="box-none" style={styles.overlayCenter}>
                  <AppButton
                    label="다시 찍기"
                    onPress={openCamera}
                    style={styles.retakeOverlayBtn}
                    textStyle={styles.retakeOverlayText}
                  />
                </View>
              </View>
            )}
          </View>

          {/* 입력 카드 */}
          <View style={[styles.formCard, { marginTop: 12 }]}>
            <Text style={styles.label}>상품명</Text>

            <View style={styles.inputWrap}>
              <TextInput
                ref={nameInputRef}
                value={name}
                onChangeText={setName}
                placeholder="예) 진라면 매운맛"
                placeholderTextColor={colors.textSubtle}
                style={styles.input}
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => setTimeout(ensureVisible, 0)}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {requireExpiry && (
              <>
                <Text style={[styles.label, { marginTop: 10 }]}>유통기한</Text>

                <AppButton
                  label={expiryDate ? formatYMD(expiryDate) : '유통기한 선택'}
                  onPress={() => setShowPicker(true)}
                  style={[styles.datePill, !expiryDate && styles.datePillEmpty]}
                  textStyle={[
                    styles.datePillText,
                    !expiryDate && styles.datePillTextEmpty,
                  ]}
                />

                {showPicker && (
                  <DateTimePicker
                    value={expiryDate ?? new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onPickerChange}
                  />
                )}

                <Text style={styles.hint}>
                  날짜를 선택하면 저장 버튼이 활성화됩니다.
                </Text>
              </>
            )}
          </View>
        </ScrollView>

        {/* 하단 버튼(고정) */}
        <View style={styles.footerFixed} onLayout={onFooterLayout}>
          <AppButton
            label={saving ? '저장 중...' : '저장'}
            disabled={!canSave}
            style={[
              styles.actionBtn,
              styles.primaryBtn,
              !canSave && styles.disabled,
            ]}
            textStyle={styles.primaryBtnText}
            onPress={async () => {
              if (!photoUri) return;
              if (requireExpiry && !expiryDate) return;

              try {
                setSaving(true);
                await onSave({
                  photoUri,
                  name: name.trim(),
                  expiryDate: requireExpiry ? formatYMD(expiryDate!) : undefined,
                });
                ToastAndroid.show('저장했습니다', ToastAndroid.SHORT);
              } finally {
                setSaving(false);
              }
            }}
          />
        </View>

        {/* 카메라 모달 */}
        <Modal
          visible={camOpen}
          animationType="slide"
          onRequestClose={() => setCamOpen(false)}
        >
          <View style={styles.camModalRoot}>
            <View style={styles.camModalHeader}>
              <AppButton
                label="닫기"
                onPress={() => setCamOpen(false)}
                style={[styles.actionBtn, styles.ghostBtn]}
                textStyle={styles.ghostBtnText}
              />
              <Text style={styles.camModalTitle}>제품 촬영</Text>
              <View style={{ width: 70 }} />
            </View>

            <View style={styles.camModalBody}>
              {device && hasPermission ? (
                <View style={styles.camFrame}>
                  <Camera
                    ref={cameraRef}
                    style={styles.cameraFill}
                    device={device}
                    isActive={camOpen}
                    photo={true}
                    format={format}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.noticeCard}>
                  <Text style={styles.noticeText}>
                    {!device
                      ? '카메라 장치를 찾는 중...'
                      : '카메라 권한이 필요합니다.'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.camModalFooter}>
              <AppButton
                label="촬영"
                onPress={takePhotoInModal}
                style={[styles.actionBtn, styles.primaryBtn]}
                textStyle={styles.primaryBtnText}
                disabled={!device || !hasPermission}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Screen>
  );
}
