import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { fs, is, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  stickyHeader: {
    backgroundColor: colors.bg,
    paddingBottom: sp(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    color: colors.text,
    fontSize: is(22),
    lineHeight: is(22),
    fontWeight: '900',
  },

  title: { color: colors.text, fontSize: fs(24), fontWeight: '900' },

  headerRightDummy: { width: M.iconBtn },

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
    fontSize: fs(17),
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

  // DB 백업/불러오기
  backupRow: {
    flexDirection: 'row',
    gap: sp(10),
    alignItems: 'center',
    marginTop: sp(2),
  },

  backupBtn: {
    flex: 1,
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backupBtnText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: fs(16),
  },

  restoreBtn: {
    flex: 1,
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreBtnText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: fs(16),
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

  thumbWrap: {
    width: sz(86),
    height: sz(86),
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

  name: { color: colors.text, fontSize: fs(20), fontWeight: '900' },
  barcode: { color: colors.textSubtle, fontSize: fs(13), fontWeight: '800' },
  barcodeMuted: { color: colors.textMuted, fontSize: fs(13), fontWeight: '800' },

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
  emptyDesc: {
    color: colors.textMuted,
    fontSize: fs(14),
    fontWeight: '700',
    textAlign: 'center',
  },

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
