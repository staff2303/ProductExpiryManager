// src/screens/BarcodeScanScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';

export const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },
  center: { marginTop: 60, textAlign: 'center', color: colors.white },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.white, marginBottom: 16, fontSize: 16, fontWeight: '900' },
  frame: {
    width: 280,
    height: 170,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  backBtn: { marginTop: 18 },
  back: { color: colors.white, marginTop: 18, fontSize: 16, fontWeight: '800' },
});