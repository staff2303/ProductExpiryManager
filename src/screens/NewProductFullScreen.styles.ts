import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cameraFill: StyleSheet.absoluteFillObject,
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backBtn: { width: 28 },
  back: { color: 'white', fontSize: 26, fontWeight: '900', width: 28 },
  title: { color: 'white', fontSize: 20, fontWeight: '900' },
  barcode: { color: '#aaa', marginBottom: 10 },

  box: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
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
    backgroundColor: 'white',
  },
  captureText: { fontSize: 16, fontWeight: '900' },

  previewImage: { width: '100%', height: '100%' },

  label: { color: 'white', marginBottom: 6, fontSize: 14, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#111',
  },
  inputInvalid: { borderColor: '#a33' },

  dateRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  calendarBtn: {
    width: 48,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBtnText: { fontSize: 18 },

  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: { fontSize: 16, fontWeight: '900' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  ghostText: { color: 'white' },
  disabled: { opacity: 0.4 },

  hint: { color: '#aaa', marginTop: 12, fontSize: 12 },
});
