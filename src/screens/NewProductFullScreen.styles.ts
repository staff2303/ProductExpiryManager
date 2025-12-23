import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { fs, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
  cameraFill: StyleSheet.absoluteFillObject,

  screen: {
    backgroundColor: colors.bg,
    paddingBottom: 0,
  },

  root: {
    flex: 1,
    paddingHorizontal: sp(16),
    paddingTop: sp(10),
    gap: sp(10),
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: sp(2),
  },

  backBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    color: colors.text,
    fontSize: fs(18),
    fontWeight: '900',
  },

  headerTitle: {
    color: colors.text,
    fontSize: fs(20),
    fontWeight: '900',
  },

  subText: {
    color: colors.textMuted,
    fontSize: fs(13),
    fontWeight: '800',
  },

  // 프리뷰 카드(자리 유지)
  previewCard: {
    width: '100%',
    height: sz(300), // 기존 비율 유지(원하면 여기만 조절)
    borderRadius: sp(18),
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp(12),
    gap: sp(6),
  },
  previewPlaceholderTitle: {
    color: colors.text,
    fontSize: fs(15),
    fontWeight: '900',
  },
  previewPlaceholderDesc: {
    color: colors.textMuted,
    fontSize: fs(12),
    fontWeight: '800',
    textAlign: 'center',
  },

  previewBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: sp(12),
    alignItems: 'center',
  },

  previewBtnRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureBtn: {
    paddingHorizontal: sp(18),
    minHeight: M.inputH,
    borderRadius: sp(999),
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: { color: colors.white, fontSize: fs(15), fontWeight: '900' },

  previewImage: { width: '100%', height: '100%' },

  // 폼 스크롤
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: sp(12),
    gap: sp(12),
  },

  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sp(16),
    padding: sp(12),
    gap: sp(10),
  },

  label: {
    color: colors.textMuted,
    fontSize: fs(12),
    fontWeight: '900',
  },

  inputWrap: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sp(14),
    paddingHorizontal: sp(12),
    minHeight: M.inputH,
    justifyContent: 'center',
  },

  input: {
    color: colors.text,
    fontSize: fs(16),
    fontWeight: '800',
    paddingVertical: sp(10),
  },

  hint: {
    color: colors.textSubtle,
    fontSize: fs(12),
    fontWeight: '800',
    marginTop: sp(2),
  },

  actionBtn: {
    minHeight: M.inputH,
    borderRadius: sp(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtn: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryBtnText: { color: colors.white, fontSize: fs(16), fontWeight: '900' },

  ghostBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: { color: colors.text, fontSize: fs(16), fontWeight: '900' },

  disabled: { opacity: 0.45 },

  // 저장 버튼 하단 고정
  footerFixed: {
    paddingTop: sp(10),
    paddingBottom: sp(12),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },

  // ✅ 날짜 필터 버튼(유통기한)
  datePill: {
    minHeight: M.inputH,
    borderRadius: sp(14),
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillEmpty: {
    backgroundColor: colors.surface,
  },
  datePillText: {
    color: colors.text,
    fontSize: fs(15),
    fontWeight: '900',
  },
  datePillTextEmpty: {
    color: colors.textMuted,
  },

  // 모달
  camModalRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: sp(16),
    paddingTop: sp(10),
    paddingBottom: sp(12),
    gap: sp(10),
  },
  camModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  camModalTitle: {
    color: colors.text,
    fontSize: fs(18),
    fontWeight: '900',
  },
  camModalBody: {
    flex: 1,
  },
  camFrame: {
    flex: 1,
    borderRadius: sp(18),
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  camModalFooter: {
    paddingTop: sp(10),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // 안내 카드(권한/장치)
  noticeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sp(16),
    padding: sp(12),
  },
  noticeText: {
    color: colors.text,
    fontSize: fs(14),
    fontWeight: '800',
  },
});
