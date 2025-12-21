// src/screens/MasterListScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { fs, is, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },

  stickyHeader: {
    backgroundColor: colors.black,
    paddingBottom: sp(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1B,
  },

  headerRow: {
    paddingHorizontal: sp(16),
    paddingTop: sp(14),
    paddingBottom: sp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray111,
    borderWidth: 1,
    borderColor: colors.gray22,
  },
  backText: { color: colors.white, fontSize: is(22), lineHeight: is(22), fontWeight: '900' },

  title: { color: colors.white, fontSize: fs(24), fontWeight: '900' },

  headerRightDummy: { width: M.iconBtn },

  controls: { paddingHorizontal: sp(16), gap: sp(8) },

  searchLine: { flexDirection: 'row', gap: sp(10), alignItems: 'center' },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray0F,
    borderWidth: 1,
    borderColor: colors.gray23,
    borderRadius: sp(14),
    paddingHorizontal: M.inputPadX,
    minHeight: M.inputH,
  },

  searchInput: {
    flex: 1,
    color: colors.white,
    paddingVertical: M.inputPadY,
    fontSize: fs(17),
  },

  searchClear: {
    width: M.clearBtn,
    height: M.clearBtn,
    borderRadius: M.clearRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray1D,
  },
  searchClearText: { color: colors.grayCF, fontWeight: '900', fontSize: is(18), lineHeight: is(18) },

  scanBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: colors.gray1B,
    borderWidth: 1,
    borderColor: colors.gray2B,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  scanBtnText: { color: colors.white, fontWeight: '900', fontSize: fs(16) },

  infoLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countText: { color: colors.grayBD, fontSize: fs(13), fontWeight: '800' },
  hintText: { color: colors.gray666, fontSize: fs(12), fontWeight: '800' },

  list: { paddingHorizontal: sp(16), paddingTop: sp(10), paddingBottom: sp(18), gap: sp(10) },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(12),
    padding: sp(12),
    borderRadius: sp(16),
    backgroundColor: colors.gray0F,
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },

  thumbWrap: {
    width: sz(86), // 썸네일은 레이아웃 요소라 유지
    height: sz(86),
    borderRadius: sp(14),
    overflow: 'hidden',
    backgroundColor: colors.gray17,
    borderWidth: 1,
    borderColor: colors.gray22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  thumbPlaceholderText: { color: colors.gray666, fontWeight: '900', fontSize: fs(12) },

  body: { flex: 1, gap: sp(6) },

  name: { color: colors.white, fontSize: fs(20), fontWeight: '900' },
  barcode: { color: '#9a9a9a', fontSize: fs(13), fontWeight: '800' },
  barcodeMuted: { color: colors.gray666, fontSize: fs(13), fontWeight: '800' },

  metaCol: { gap: sp(2) },
  metaText: { color: '#b0b0b0', fontSize: fs(13), fontWeight: '800' },

  actionsCol: { alignSelf: 'stretch', justifyContent: 'space-between', gap: sp(8), paddingLeft: sp(4) },

  iconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray17,
    borderWidth: 1,
    borderColor: '#252525',
  },
  iconBtnText: { color: '#eaeaea', fontWeight: '900', fontSize: is(20), lineHeight: is(20) },
  iconBtnDanger: { backgroundColor: '#1a0f0f', borderColor: colors.expiredBorder },
  iconBtnTextDanger: { color: '#ffb3b3' },

  emptyWrap: {
    marginTop: sp(24),
    padding: sp(16),
    borderRadius: sp(16),
    backgroundColor: colors.gray0F,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    alignItems: 'center',
    gap: sp(10),
  },
  emptyTitle: { color: colors.white, fontSize: fs(18), fontWeight: '900' },
  emptyDesc: { color: '#a0a0a0', fontSize: fs(14), fontWeight: '700', textAlign: 'center' },

  emptyBtnRow: { flexDirection: 'row', gap: sp(10), marginTop: sp(6) },

  primaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.white,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  primaryBtnText: { color: colors.black, fontWeight: '900', fontSize: fs(16) },

  ghostBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.gray17,
    borderWidth: 1,
    borderColor: '#252525',
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  ghostBtnText: { color: colors.white, fontWeight: '900', fontSize: fs(16) },
});