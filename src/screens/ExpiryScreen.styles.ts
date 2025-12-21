import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: { color: 'white', fontSize: 18, fontWeight: '800', marginBottom: 10 },

  photo: { borderRadius: 12, backgroundColor: '#111', marginBottom: 12 },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 14,
  },
  retakeText: { color: '#ddd', fontWeight: '700' },

  label: { color: 'white', marginBottom: 6, fontSize: 14, fontWeight: '600' },

  input: {
    flex: 1,
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

  warn: { color: '#ff6b6b', marginTop: 8, fontSize: 13 },

  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  btnGhostText: { color: 'white' },
  btnDisabled: { opacity: 0.4 },

  hint: { color: '#aaa', marginTop: 12, fontSize: 12 },
});
