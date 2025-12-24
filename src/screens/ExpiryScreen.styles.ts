// src/screens/ExpiryScreen.styles.ts
// ListScreen 기준 톤/규격에 맞춘 Expiry UI

import { StyleSheet } from 'react-native';

import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';
import { fs, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
  headerRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },

  headerSide: {
    width: 44, // ✅ 좌/우 폭 동일
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },

  headerTitleCenter: {
    position: 'absolute', // ✅ 핵심
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fs(20),
    fontWeight: '900',
    color: colors.text,
  },

  headerRightPlaceholder: {
    width: 44, // 왼쪽 아이콘 버튼과 동일한 폭
  },

  title: { color: colors.text, fontSize: fs(20), fontWeight: '900' },

  headerSpacer: { width: sz(88) }, // 우측 버튼이 없을 때 타이틀 정렬용

  iconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pillBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  pillText: { color: colors.text, fontWeight: '900', fontSize: fs(14) },

  body: {
    paddingHorizontal: sp(16),
    paddingTop: sp(14),
    paddingBottom: sp(16),
    gap: sp(12),
  },

  card: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  photo: {
    backgroundColor: colors.surfaceAlt,
    alignSelf: 'stretch',
  },

  label: { color: colors.text, fontSize: fs(14), fontWeight: '900' },

  dateRow: { flexDirection: 'row', gap: sp(10), alignItems: 'center' },

  input: {
    flex: 1,
    minHeight: M.inputH,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sp(14),
    paddingHorizontal: M.inputPadX,
    paddingVertical: M.inputPadY,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: fs(16),
  },
  inputInvalid: { borderColor: colors.invalid },

  error: { color: colors.danger, fontSize: fs(12), fontWeight: '800' },
  warn: { color: colors.danger, fontSize: fs(12), fontWeight: '800' },

  footer: { marginTop: sp(6) },
  primaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    backgroundColor: colors.primary,
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  primaryText: { fontWeight: '900', color: colors.white, fontSize: fs(16) },
  btnDisabled: { opacity: 0.45 },

  hint: {
    color: colors.textSubtle,
    marginTop: sp(2),
    fontSize: fs(12),
    fontWeight: '800',
  },

  previewImageWrap: {
    width: '100%',
    height: 340, // ✅ 사진 더 크게
    backgroundColor: colors.surfaceAlt,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceAlt,
  },

  overlayBottomCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: 'center',
  },

  retakeOverlayBtn: {
    borderRadius: 999,
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  retakeOverlayText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
});
