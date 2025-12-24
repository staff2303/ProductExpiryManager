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

    // ✅ 헤더 아래 영역이 너무 붙어 보이지 않게(헤더와 컨트롤 사이 숨통)
    paddingTop: sp(6),

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

  // ✅ 헤더와 검색창 사이 간격
  controls: {
    marginTop: sp(10),
    paddingHorizontal: sp(16),
    gap: sp(8),
  },

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
    paddingHorizontal: M.pillPadX,
    paddingVertical: M.pillPadY,
    borderRadius: sp(14),
    backgroundColor: colors.secondary,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIconBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },

  emptyDateBtn: {
    width: M.iconBtn,
    height: M.iconBtn,
    borderRadius: M.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },

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
  filterChipOn: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  filterChipText: { color: colors.text, fontWeight: '800', fontSize: fs(15) },
  filterChipTextOn: { color: colors.primary },

  // 날짜 아이콘 + (옵션) 날짜 문자열 묶음을 중앙 배치
  filterChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp(8),
  },
  filterChipLabel: {
    color: colors.text,
    fontWeight: '900',
    fontSize: fs(15),
  },

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
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  // 카드 색 규칙: 지난/당일/하루전만 빨강, 나머지는 초록
  cardRed: {
    borderColor: colors.expiredBorder,
    backgroundColor: colors.todayBg,
  },
  cardGreen: {
    borderColor: colors.okBorder,
    backgroundColor: colors.okBg,
  },

  // (legacy) 이전 다단계 색상은 잠시 유지 (다른 화면에서 참조 가능성)
  cardExpired: {
    borderColor: colors.expiredBorder,
    backgroundColor: colors.expiredBg,
  },
  cardToday: {
    borderColor: colors.todayBorder,
    backgroundColor: colors.todayBg,
  },
  cardSoon: { borderColor: colors.soonBorder, backgroundColor: colors.soonBg },
  cardWarn: { borderColor: colors.warnBorder, backgroundColor: colors.warnBg },
  cardOk: { borderColor: colors.okBorder, backgroundColor: colors.okBg },

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

  ddayRow: { flexDirection: 'row', alignItems: 'center', gap: sp(6) },
  ddayText: { color: colors.text, fontSize: fs(20), fontWeight: '900' },

  name: { color: colors.text, fontSize: fs(20), fontWeight: '900' },
  barcode: { color: colors.textSubtle, fontSize: fs(13), fontWeight: '800' },

  metaCol: { gap: sp(2) },
  // 유통기한/등록일: 제품명처럼 진한 검정
  metaText: { color: colors.text, fontSize: fs(13), fontWeight: '800' },

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
    borderColor: colors.borderStrong,
    alignItems: 'center',
    gap: sp(10),
  },
  emptyTitle: { color: colors.gsDeepBlue, fontSize: fs(18), fontWeight: '900' },
  emptyDesc: { color: colors.textMuted, fontSize: fs(14), fontWeight: '700' },

  emptyBtnRow: { flexDirection: 'row', gap: sp(10), marginTop: sp(6) },

  primaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.primary,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.white, fontWeight: '900', fontSize: fs(16) },

  // Empty-state buttons (GS colors)
  emptyPrimaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryPressed,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPrimaryText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: fs(16),
  },

  emptySecondaryBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.secondary,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySecondaryText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: fs(16),
  },

  ghostBtn: {
    paddingHorizontal: M.pillPadX,
    paddingVertical: 10,
    borderRadius: sp(14),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    minHeight: M.inputH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: { color: colors.primary, fontWeight: '900', fontSize: fs(16) },
});
