// src/screens/MasterListScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../ui/tokens/colors';
import { fs, is, sp, sz } from '../theme/uiScale';
import { M } from '../theme/metrics';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  stickyHeader: {
    backgroundColor: colors.bg,
    paddingTop: sp(6),
    paddingBottom: sp(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
    elevation: 10,
    position: 'relative',
  },

  controls: { marginTop: sp(10), paddingHorizontal: sp(16), gap: sp(8) },

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
    position: 'absolute',
    right: M.inputPadX,
    width: M.clearBtn,
    height: M.clearBtn,
    borderRadius: M.clearRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },

  scanBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },

  scanIconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },

  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: { color: colors.textMuted, fontSize: fs(13), fontWeight: '800' },
  hintText: { color: colors.textSubtle, fontSize: fs(12), fontWeight: '800' },

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
  barcodeMuted: {
    color: colors.textMuted,
    fontSize: fs(13),
    fontWeight: '800',
  },

  actionsCol: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: sp(8),
    paddingLeft: sp(4),
  },

  iconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },

  // ✅ ListScreen과 동일한 컬러 규칙
  iconBtnEdit: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  iconBtnDelete: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },

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
