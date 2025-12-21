// src/screens/CameraScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';

export const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
  safe: {flex: 1, backgroundColor: colors.black},
  container: {flex: 1},
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 20,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: colors.white,
  },
  btnText: {fontSize: 16, fontWeight: '700'},
  center: {marginTop: 60, textAlign: 'center'},
});