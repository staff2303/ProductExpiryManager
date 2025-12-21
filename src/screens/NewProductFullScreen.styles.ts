// src/screens/NewProductFullScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { radius } from '../ui/tokens/radius';

export const styles = StyleSheet.create({
  cameraFill: StyleSheet.absoluteFillObject,
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backBtn: { width: 28 },
  back: { color: colors.white, fontSize: 26, fontWeight: '900', width: 28 },
  title: { color: colors.white, fontSize: 20, fontWeight: '900' },
  barcode: { color: colors.grayAAA, marginBottom: 10 },

  box: {
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.gray111,
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
    backgroundColor: colors.white,
  },
  captureText: { fontSize: 16, fontWeight: '900' },

  previewImage: { width: '100%', height: '100%' },

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

  btn: {
    paddingHorizontal: 24,
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
