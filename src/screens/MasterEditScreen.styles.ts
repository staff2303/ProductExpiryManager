// src/screens/MasterEditScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';

export const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sub: { color: colors.textMuted, marginBottom: 10 },

  image: {
    width: '100%',
    height: 260,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    marginBottom: 12,
  },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  retakeText: { color: colors.text, fontWeight: '800' },

  label: { color: colors.text, marginBottom: 6, fontSize: 14, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    backgroundColor: colors.surface,
  },

  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  btnText: { fontSize: 16, fontWeight: '900', color: colors.white },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghostText: { color: colors.text },
  disabled: { opacity: 0.4 },

  hint: { color: colors.textMuted, marginTop: 12, fontSize: 12 },
});
