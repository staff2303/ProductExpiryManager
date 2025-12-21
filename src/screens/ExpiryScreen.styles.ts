// src/screens/ExpiryScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';

export const styles = StyleSheet.create({
  title: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 10 },

  photo: { borderRadius: radius.md, backgroundColor: colors.gray111, marginBottom: 12 },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gray333,
    marginBottom: 14,
  },
  retakeText: { color: colors.grayDDD, fontWeight: '700' },

  label: { color: colors.white, marginBottom: 6, fontSize: 14, fontWeight: '600' },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray333,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    backgroundColor: colors.gray111,
  },
  inputInvalid: { borderColor: colors.invalid },

  dateRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  calendarBtn: {
    width: 48,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray444,
  },
  btnGhostText: { color: colors.white },
  btnDisabled: { opacity: 0.4 },

  hint: { color: colors.grayAAA, marginTop: 12, fontSize: 12 },
});
