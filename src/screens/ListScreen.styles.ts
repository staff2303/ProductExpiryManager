// src/screens/ListScreen.styles.ts
import { StyleSheet } from 'react-native';
import { fs, is, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

// ✅ 상수는 StyleSheet 밖에서 export (TS 오류 방지)
export const THUMB_W = sz(92);
export const MIN_H = sz(76);
export const MAX_H = sz(132);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },

  stickyHeader: {
    backgroundColor: '#000',
    paddingBottom: sp(10),
    borderBottomWidth: 1,
    borderBottomColor: '#1b1b1b',
  },

  headerRow: {
    paddingHorizontal: sp(16),
    paddingTop: sp(14),
    paddingBottom: sp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: { color: 'white', fontSize: fs(28), fontWeight: '900' },

  headerBtnRow: { flexDirection: 'row', gap: sp(10) },

  addBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    backgroundColor: 'white',
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  addText: { fontWeight: '900', color: '#000', fontSize: fs(16) },

  dbBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2b2b2b',
    backgroundColor: 'transparent',
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  dbText: { color: 'white', fontWeight: '900', fontSize: fs(16) },

  controls: { paddingHorizontal: sp(16), gap: sp(8) },

  searchLine: { flexDirection: 'row', gap: sp(10), alignItems: 'center' },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#232323',
    borderRadius: sp(14),
    paddingHorizontal: M.inputPadX,
    minHeight: M.inputH,
  },

  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: M.inputPadY,
    fontSize: fs(17),
  },

  searchClear: {
    width: M.clearBtn,
    height: M.clearBtn,
    borderRadius: M.clearRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d1d1d',
  },
  searchClearText: { color: '#cfcfcf', fontWeight: '900', fontSize: is(18), lineHeight: is(18) },

  scanBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: '#1b1b1b',
    borderWidth: 1,
    borderColor: '#2b2b2b',
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  scanBtnText: { color: 'white', fontWeight: '900', fontSize: fs(16) },

  infoLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  countText: { color: '#bdbdbd', fontSize: fs(13), fontWeight: '800' },
  hintText: { color: '#666', fontSize: fs(12), fontWeight: '800' },

  filterLine: { flexDirection: 'row', alignItems: 'center', gap: sp(8) },

  filterChip: {
    flex: 1,
    borderRadius: sp(14),
    paddingVertical: M.inputPadY,
    paddingHorizontal: M.inputPadX,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#232323',
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  filterChipOn: { backgroundColor: '#151515', borderColor: '#3a3a3a' },
  filterChipText: { color: '#d0d0d0', fontWeight: '800', fontSize: fs(15) },
  filterChipTextOn: { color: '#fff' },

  filterChipClose: {
    width: M.closeBtn,
    height: M.closeBtn,
    borderRadius: M.closeRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d1d1d',
    borderWidth: 1,
    borderColor: '#2b2b2b',
  },
  filterChipCloseText: { color: '#fff', fontWeight: '900', fontSize: is(18), lineHeight: is(18) },

  list: { paddingHorizontal: sp(16), paddingTop: sp(10), paddingBottom: sp(18), gap: sp(10) },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(12),
    padding: sp(12),
    borderRadius: sp(16),
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },

  cardExpired: { borderColor: '#3a1f1f', backgroundColor: '#120a0a' },
  cardSoon: { borderColor: '#35241a', backgroundColor: '#110d0a' },

  thumbWrap: {
    borderRadius: sp(14),
    overflow: 'hidden',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  thumbPlaceholderText: { color: '#666', fontWeight: '900', fontSize: fs(12) },

  body: { flex: 1, gap: sp(6) },

  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: sp(10) },

  ddayText: { color: '#fff', fontSize: fs(20), fontWeight: '900' },
  ddayTextHot: { color: '#ffb3b3' },

  chip: { paddingHorizontal: sp(10), paddingVertical: sp(7), borderRadius: 999, borderWidth: 1 },
  chipText: { color: '#fff', fontWeight: '900', fontSize: fs(12) },

  chipExpired: { backgroundColor: '#2a0f0f', borderColor: '#4a1a1a' },
  chipToday: { backgroundColor: '#2a140f', borderColor: '#4a241a' },
  chipSoon: { backgroundColor: '#2a1d0f', borderColor: '#4a341a' },
  chipWarn: { backgroundColor: '#24240f', borderColor: '#3f3f1a' },
  chipOk: { backgroundColor: '#0f2413', borderColor: '#1a3f23' },

  name: { color: '#fff', fontSize: fs(20), fontWeight: '900' },
  barcode: { color: '#9a9a9a', fontSize: fs(13), fontWeight: '800' },

  metaCol: { gap: sp(2) },
  metaText: { color: '#b0b0b0', fontSize: fs(13), fontWeight: '800' },

  actionsCol: { alignSelf: 'stretch', justifyContent: 'space-between', gap: sp(8), paddingLeft: sp(4) },

  iconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#252525',
  },
  iconBtnText: { color: '#eaeaea', fontWeight: '900', fontSize: is(20), lineHeight: is(20) },
  iconBtnDanger: { backgroundColor: '#1a0f0f', borderColor: '#3a1f1f' },
  iconBtnTextDanger: { color: '#ffb3b3' },

  emptyWrap: {
    marginTop: sp(24),
    padding: sp(16),
    borderRadius: sp(16),
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    alignItems: 'center',
    gap: sp(10),
  },
  emptyTitle: { color: '#fff', fontSize: fs(18), fontWeight: '900' },
  emptyDesc: { color: '#a0a0a0', fontSize: fs(14), fontWeight: '700' },

  emptyBtnRow: { flexDirection: 'row', gap: sp(10), marginTop: sp(6) },

  primaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: '#fff',
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '900', fontSize: fs(16) },

  ghostBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#252525',
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  ghostBtnText: { color: '#fff', fontWeight: '900', fontSize: fs(16) },
});
