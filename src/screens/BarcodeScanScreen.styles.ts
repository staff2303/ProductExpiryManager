// src/screens/BarcodeScanScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';

const MASK_COLOR = 'rgba(0,0,0,0.72)'; // 어두운 정도(0~1)
const CORNER_COLOR = colors.white;

export const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },
  center: { marginTop: 60, textAlign: 'center', color: colors.white },

  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  title: {
    color: colors.white,
    marginTop: 24,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '900',
    zIndex: 10,
  },

  /* ===== 마스킹 ===== */
  maskTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: MASK_COLOR,
    zIndex: 1,
  },
  maskBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: MASK_COLOR,
    zIndex: 1,
  },
  maskLeft: {
    position: 'absolute',
    left: 0,
    backgroundColor: MASK_COLOR,
    zIndex: 1,
  },
  maskRight: {
    position: 'absolute',
    right: 0,
    backgroundColor: MASK_COLOR,
    zIndex: 1,
  },

  /* ROI 박스: 마스크 위에 올림 */
  roiBox: {
    position: 'absolute',
    zIndex: 2,
  },

  /* 중앙 빨간선 */
  redLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ff3b30',
    opacity: 0.85,
  },

  /* L자 코너 */
  cornerH: {
    position: 'absolute',
    backgroundColor: CORNER_COLOR,
    borderRadius: 2,
  },
  cornerV: {
    position: 'absolute',
    backgroundColor: CORNER_COLOR,
    borderRadius: 2,
  },

  backBtn: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    zIndex: 10,
  },
  back: { color: colors.white, fontSize: 16, fontWeight: '800' },
});
