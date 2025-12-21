import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: { color: 'white', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  sub: { color: '#aaa', marginBottom: 10 },

  image: {
    width: '100%',
    height: 260,
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 12,
  },

  retakeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 14,
  },
  retakeText: { color: '#ddd', fontWeight: '800' },

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

  row: { flexDirection: 'row', gap: 12, marginTop: 18 },
  btn: {
    flex: 1,
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
