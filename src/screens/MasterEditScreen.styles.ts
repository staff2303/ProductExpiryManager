// src/screens/MasterEditScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';

export const styles = StyleSheet.create({
  title: { color: colors.white, fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sub: { color: colors.grayAAA, marginBottom: 10 },

  image: {
    width: '100%',
    height: 260,
    backgroundColor: colors.gray111,
    borderRadius: radius.md,
    marginBottom: 12,
  },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gray333,
    marginBottom: 14,
  },
  retakeText: { color: colors.grayDDD, fontWeight: '800' },

  label: { color: colors.white, marginBottom: 6, fontSize: 14, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: colors.gray333,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    backgroundColor: colors.gray111,
  },

  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  btnText: { fontSize: 16, fontWeight: '900' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray444,
  },
  ghostText: { color: colors.white },
  disabled: { opacity: 0.4 },

  hint: { color: colors.grayAAA, marginTop: 12, fontSize: 12 },
});
