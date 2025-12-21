import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: 'black'},
  container: {flex: 1},
  image: {flex: 1},
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 20,
  },
  row: {flexDirection: 'row', gap: 12},
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: {fontSize: 16, fontWeight: '700'},
  ghost: {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#444'},
  ghostText: {color: 'white'},
});
