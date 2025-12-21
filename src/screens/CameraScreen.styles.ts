import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
  safe: {flex: 1, backgroundColor: 'black'},
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
    backgroundColor: 'white',
  },
  btnText: {fontSize: 16, fontWeight: '700'},
  center: {marginTop: 60, textAlign: 'center'},
});
