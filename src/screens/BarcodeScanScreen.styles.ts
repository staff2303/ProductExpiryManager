import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
  safe: { flex: 1, backgroundColor: 'black' },
  container: { flex: 1 },
  center: { marginTop: 60, textAlign: 'center', color: 'white' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', marginBottom: 16, fontSize: 16, fontWeight: '900' },
  frame: {
    width: 280,
    height: 170,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  back: { color: 'white', marginTop: 18, fontSize: 16, fontWeight: '800' },
});
