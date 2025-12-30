import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';
import { fs, sp } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
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

  label: { color: colors.text, fontSize: fs(14), fontWeight: '900' },

  /* ✅ 버튼-only 날짜 선택 UI */
  datePill: {
    borderRadius: 999,
    minHeight: M.inputH,
    paddingHorizontal: sp(16),
    paddingVertical: sp(12),
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp(2),
  },
  datePillEmpty: {
    backgroundColor: colors.surface,
  },
  datePillText: {
    color: colors.text,
    fontSize: fs(14),
    fontWeight: '900',
  },
  datePillTextEmpty: {
    color: colors.textSubtle,
  },

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

  previewImageWrap: {
    width: '100%',
    height: 340,
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
