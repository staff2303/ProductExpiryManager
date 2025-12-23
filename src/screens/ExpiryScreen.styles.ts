// src/screens/ExpiryScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';

export const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10 },

  photo: { borderRadius: radius.md, backgroundColor: colors.surfaceAlt, marginBottom: 12 },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  retakeText: { color: colors.text, fontWeight: '700' },

  label: { color: colors.text, marginBottom: 6, fontSize: 14, fontWeight: '600' },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputInvalid: { borderColor: colors.invalid },

  dateRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  calendarBtn: {
    width: 48,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBtnText: { fontSize: 18 },

  warn: { color: colors.danger, marginTop: 8, fontSize: 13 },

  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: colors.white },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  btnGhostText: { color: colors.text },
  btnDisabled: { opacity: 0.4 },

  hint: { color: colors.textMuted, marginTop: 12, fontSize: 12 },
});
