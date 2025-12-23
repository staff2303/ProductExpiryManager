// src/screens/ListScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { fs, is, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

// ✅ 상수는 StyleSheet 밖에서 export (TS 오류 방지)
export const THUMB_W = sz(92);
export const MIN_H = sz(76);
export const MAX_H = sz(132);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  stickyHeader: {
    backgroundColor: colors.bg,
    paddingBottom: sp(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    // 스크롤 후 상단에 붙은 헤더가 아이템 아래로 들어가며 터치가 막히는 현상 방지
    zIndex: 10,
    elevation: 10,
    position: 'relative',
  },

  headerRow: {
    paddingHorizontal: sp(16),
    paddingTop: sp(14),
    paddingBottom: sp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: { color: colors.text, fontSize: fs(20), fontWeight: '900' },

  headerBtnRow: { flexDirection: 'row', gap: sp(10) },

  addBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    backgroundColor: colors.primary,
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  addText: { fontWeight: '900', color: colors.white, fontSize: fs(14) },

  dbBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    minHeight: M.pillH,
    justifyContent: 'center',
  },
  dbText: { color: colors.text, fontWeight: '900', fontSize: fs(14) },

  controls: { paddingHorizontal: sp(16), gap: sp(8) },

  searchLine: { flexDirection: 'row', gap: sp(10), alignItems: 'center' },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sp(14),
    paddingHorizontal: M.inputPadX,
    minHeight: M.inputH,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: M.inputPadY,
    fontSize: fs(16),
  },

  searchClear: {
    width: M.clearBtn,
    height: M.clearBtn,
    borderRadius: M.clearRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  searchClearText: {
    color: colors.textMuted,
    fontWeight: '900',
    fontSize: is(18),
    lineHeight: is(18),
  },

  scanBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  scanBtnText: { color: colors.text, fontWeight: '900', fontSize: fs(16) },

  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: { color: colors.textMuted, fontSize: fs(13), fontWeight: '800' },
  hintText: { color: colors.textSubtle, fontSize: fs(12), fontWeight: '800' },

  filterLine: { flexDirection: 'row', alignItems: 'center', gap: sp(8) },

  filterChip: {
    flex: 1,
    borderRadius: sp(14),
    paddingVertical: M.inputPadY,
    paddingHorizontal: M.inputPadX,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  filterChipOn: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  filterChipText: { color: colors.text, fontWeight: '800', fontSize: fs(15) },
  filterChipTextOn: { color: colors.primary },

  filterChipClose: {
    width: M.closeBtn,
    height: M.closeBtn,
    borderRadius: M.closeRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipCloseText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: is(18),
    lineHeight: is(18),
  },

  list: {
    paddingHorizontal: sp(16),
    paddingTop: sp(10),
    paddingBottom: sp(18),
    gap: sp(10),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(12),
    padding: sp(12),
    borderRadius: sp(16),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardExpired: {
    borderColor: colors.expiredBorder,
    backgroundColor: colors.expiredBg,
  },
  cardSoon: { borderColor: colors.soonBorder, backgroundColor: colors.soonBg },

  thumbWrap: {
    borderRadius: sp(14),
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholderText: {
    color: colors.textSubtle,
    fontWeight: '900',
    fontSize: fs(12),
  },

  body: { flex: 1, gap: sp(6) },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: sp(10),
  },

  ddayText: { color: colors.text, fontSize: fs(20), fontWeight: '900' },
  ddayTextHot: { color: colors.danger },

  chip: {
    paddingHorizontal: sp(10),
    paddingVertical: sp(7),
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { color: colors.text, fontWeight: '900', fontSize: fs(12) },

  chipExpired: { backgroundColor: colors.dangerSoft, borderColor: colors.expiredBorder },
  chipToday: { backgroundColor: colors.warningSoft, borderColor: colors.soonBorder },
  chipSoon: { backgroundColor: colors.warningSoft, borderColor: colors.soonBorder },
  chipWarn: { backgroundColor: colors.surfaceAlt, borderColor: colors.borderStrong },
  chipOk: { backgroundColor: colors.successSoft, borderColor: colors.success },

  name: { color: colors.text, fontSize: fs(20), fontWeight: '900' },
  barcode: { color: colors.textSubtle, fontSize: fs(13), fontWeight: '800' },

  metaCol: { gap: sp(2) },
  metaText: { color: colors.textMuted, fontSize: fs(13), fontWeight: '800' },

  actionsCol: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    gap: sp(8),
    paddingLeft: sp(4),
  },

  iconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtnText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: is(20),
    lineHeight: is(20),
  },
  iconBtnDanger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.expiredBorder,
  },
  iconBtnTextDanger: { color: colors.danger },

  emptyWrap: {
    marginTop: sp(24),
    padding: sp(16),
    borderRadius: sp(16),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: sp(10),
  },
  emptyTitle: { color: colors.text, fontSize: fs(18), fontWeight: '900' },
  emptyDesc: { color: colors.textMuted, fontSize: fs(14), fontWeight: '700' },

  emptyBtnRow: { flexDirection: 'row', gap: sp(10), marginTop: sp(6) },

  primaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.primary,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  primaryBtnText: { color: colors.white, fontWeight: '900', fontSize: fs(16) },

  ghostBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: M.inputH,
    justifyContent: 'center',
  },
  ghostBtnText: { color: colors.text, fontWeight: '900', fontSize: fs(16) },
});
