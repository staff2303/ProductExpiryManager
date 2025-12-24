import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  root: {
    flex: 1,
  },

  /* 헤더 */
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },

  subText: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '800',
  },

  /* 프리뷰 카드 */
  previewCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  previewImageWrap: {
    width: '100%',
    height: 320, // ✅ 버튼을 아래로 빼지 않아서 사진을 더 크게 쓸 수 있음
    backgroundColor: colors.surfaceAlt,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceAlt,
  },

  previewPlaceholder: {
    height: 320,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 6,
  },

  previewPlaceholderTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  previewPlaceholderDesc: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },

  /* ✅ 제품촬영 버튼 (사진칸 내부) */
  captureBtn: {
    borderRadius: 999,
    minHeight: 46,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  /* ✅ 다시찍기 오버레이 */
  overlayCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14, // ✅ 하단 여백
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

  /* 입력 영역 스크롤 */
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 140,
  },

  formCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },

  inputWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 16,
  },

  datePill: {
    borderRadius: 999,
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  datePillEmpty: {
    backgroundColor: colors.surface,
  },
  datePillText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  datePillTextEmpty: {
    color: colors.textSubtle,
  },

  hint: {
    marginTop: 10,
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '800',
  },

  /* 하단 고정 저장 버튼 */
  footerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionBtn: {
    borderRadius: 999,
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtn: {
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  ghostBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },

  disabled: {
    opacity: 0.45,
  },

  /* 카메라 모달 */
  camModalRoot: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  camModalHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  camModalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },

  camModalBody: {
    flex: 1,
    padding: 16,
  },

  camFrame: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },

  cameraFill: {
    flex: 1,
  },

  noticeCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  noticeText: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: '800',
  },

  camModalFooter: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
