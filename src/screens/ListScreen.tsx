// src/screens/ListScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppButton } from '../components/AppButton';
import { SearchInput } from '../components/SearchInput';
import { ScreenHeader } from '../components/ScreenHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  InventoryRow,
  deleteInventoryItem,
  fetchInventoryWithProduct,
} from '../db/sqlite';
import FullscreenImageModal from './FullscreenImageModal';
import { styles, THUMB_W, MIN_H, MAX_H } from './ListScreen.styles';
import { colors } from '../ui/tokens/colors';

/** ---- 날짜/정렬 유틸 ---- */
function parseYMD(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d)
    return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
function diffDays(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
function toExpiryTime(expiryYmd: string) {
  const exp = parseYMD(expiryYmd);
  return exp ? exp.getTime() : Number.MAX_SAFE_INTEGER;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function toYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
/** ---- 유틸 끝 ---- */

/** ---- 만료 임박 룰 ---- */
type Urgency = 'expired' | 'today' | 'soon' | 'warn' | 'ok' | 'unknown';

function getDaysUntil(expiryYmd: string): number | null {
  const exp = parseYMD(expiryYmd);
  if (!exp) return null;
  return diffDays(startOfToday(), exp);
}

// 지난거(<0) / 당일(0) / 하루전(1)만 빨강
function isRedDate(expiryYmd: string): boolean {
  const d = getDaysUntil(expiryYmd);
  if (d === null) return false;
  return d <= 1;
}

function urgencyOf(expiryYmd: string): Urgency {
  const d = getDaysUntil(expiryYmd);
  if (d === null) return 'unknown';
  if (d < 0) return 'expired';
  if (d === 0) return 'today';
  if (d <= 3) return 'soon';
  if (d <= 7) return 'warn';
  return 'ok';
}
function ddayText(expiryYmd: string) {
  const d = getDaysUntil(expiryYmd);
  if (d === null) return '날짜 오류';
  if (d < 0) return `만료 D+${Math.abs(d)}`;
  if (d === 0) return 'D-DAY';
  return `D-${d}`;
}
/** ---- 룰 끝 ---- */

type Props = {
  onAddNew: () => void;
  onOpenMaster: () => void;
  onEdit: (item: InventoryRow) => void;
  reloadSignal: number;

  query: string;
  dateFilter: string | null;
  onQueryChange: (q: string) => void;
  onDateFilterChange: (d: string | null) => void;
  onScanBarcode: () => void;
};

export default function ListScreen({
  onAddNew,
  onOpenMaster,
  onEdit,
  reloadSignal,
  query,
  dateFilter,
  onQueryChange,
  onDateFilterChange,
  onScanBarcode,
}: Props) {
  const [originalItems, setOriginalItems] = useState<InventoryRow[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [displayDate, setDisplayDate] = useState<string | null>(dateFilter);

  // 검색 디바운스
  const [draftQuery, setDraftQuery] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 250;

  // 이미지 뷰어
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUri, setViewerUri] = useState<string | null>(null);

  // 썸네일 비율 캐시
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const openViewer = (uri: string) => {
    setViewerUri(uri);
    setViewerOpen(true);
  };

  const load = useCallback(async () => {
    const data = await fetchInventoryWithProduct();

    data.sort((a, b) => {
      const au = urgencyOf(a.expiryDate);
      const bu = urgencyOf(b.expiryDate);

      const aHot =
        au === 'expired' || au === 'today' || au === 'soon' || au === 'warn';
      const bHot =
        bu === 'expired' || bu === 'today' || bu === 'soon' || bu === 'warn';

      if (aHot !== bHot) return aHot ? -1 : 1;

      const at = toExpiryTime(a.expiryDate);
      const bt = toExpiryTime(b.expiryDate);
      if (at !== bt) return at - bt;

      return b.inventoryId - a.inventoryId;
    });

    setOriginalItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load, reloadSignal]);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (draftQuery !== query) onQueryChange(draftQuery);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draftQuery, query, onQueryChange]);

  const confirmDelete = (item: InventoryRow) => {
    Alert.alert(
      '삭제할까요?',
      '삭제하면 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await deleteInventoryItem(item.inventoryId);
            ToastAndroid.show('삭제했습니다', ToastAndroid.SHORT);
            await load();
          },
        },
      ],
      { cancelable: true },
    );
  };

  const filteredItems = useMemo(() => {
    let filtered = originalItems;

    const raw = query.trim();
    if (raw.length >= 2) {
      const q = raw.toLowerCase();
      const digitsOnly = /^\d+$/.test(raw);

      filtered = filtered.filter(it => {
        const name = (it.name ?? '').toLowerCase();
        const bc = (it.barcode ?? '').toLowerCase();
        if (digitsOnly) return bc.includes(q);
        return name.includes(q);
      });
    }

    if (dateFilter) {
      filtered = filtered.filter(it => it.expiryDate === dateFilter);
    }

    return filtered;
  }, [originalItems, query, dateFilter]);

  const countText = useMemo(() => {
    const total = originalItems.length;
    const shown = filteredItems.length;
    const searching = query.trim().length >= 2;
    const filteringDate = !!dateFilter;

    if (!searching && !filteringDate) return `전체 ${total}개`;
    const tags: string[] = [];
    if (searching) tags.push('검색');
    if (filteringDate) tags.push('날짜');
    return `표시 ${shown}개 · 전체 ${total}개${
      tags.length ? ` (${tags.join('+')})` : ''
    }`;
  }, [originalItems.length, filteredItems.length, query, dateFilter]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const ts =
      selectedDate?.getTime?.() ?? event?.nativeEvent?.timestamp ?? null;
    if (!ts) {
      setShowDatePicker(false);
      return;
    }

    const ymd = toYMDLocal(new Date(ts));
    setShowDatePicker(false);

    setTimeout(() => {
      setDisplayDate(ymd);
      onDateFilterChange(ymd);
    }, 0);
  };

  const clearDateFilter = () => {
    setDisplayDate(null);
    onDateFilterChange(null);
  };

  const clearQuery = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDraftQuery('');
    onQueryChange('');
  };

  const renderItem = ({ item }: { item: InventoryRow }) => {
    const u = urgencyOf(item.expiryDate);
    const dday = ddayText(item.expiryDate);
    const redDate = isRedDate(item.expiryDate);
    // D-Day 텍스트/아이콘: 지난/당일/하루전만 빨강, 나머지는 검정
    const ddayColor = redDate ? colors.danger : colors.text;

    const keyUri = item.thumbUri?.trim()
      ? item.thumbUri
      : `inv:${item.inventoryId}`;
    const ratio = ratios[keyUri] ?? 1;
    const thumbH = clamp(THUMB_W / ratio, MIN_H, MAX_H);
    // 카드색 규칙: 지난/당일/하루전 = 빨강 카드, 나머지 = 초록 카드
    const cardStyle = redDate ? styles.cardRed : styles.cardGreen;
    return (
      <View style={[styles.card, cardStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openViewer(item.imageUri)}
          style={[styles.thumbWrap, { width: THUMB_W, height: thumbH }]}
        >
          {!!item.thumbUri?.trim() ? (
            <Image
              source={{ uri: item.thumbUri }}
              style={styles.thumbImg}
              resizeMode="cover"
              onLoad={e => {
                const w = e.nativeEvent?.source?.width;
                const h = e.nativeEvent?.source?.height;
                if (!w || !h) return;
                const r = w / h;
                setRatios(prev =>
                  prev[keyUri] ? prev : { ...prev, [keyUri]: r },
                );
              }}
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text style={styles.thumbPlaceholderText}>NO IMG</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.ddayRow}>
              <Icon name="calendar-clock" size={18} color={ddayColor} />
              <Text style={[styles.ddayText, { color: ddayColor }]} numberOfLines={1}>
                {dday}
              </Text>
            </View>
          </View>

          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>

          {!!item.barcode?.trim() && (
            <Text style={styles.barcode} numberOfLines={1} ellipsizeMode="tail">
              #{item.barcode}
            </Text>
          )}

          <View style={styles.metaCol}>
            <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
              유통기한 {item.expiryDate}
            </Text>
            <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
              등록 {item.createdAt.slice(0, 10)}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnEdit]}
            onPress={() => onEdit(item)}
            activeOpacity={0.85}
            accessibilityLabel="수정"
          >
            <Icon name="pencil" size={20} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnDelete]}
            onPress={() => confirmDelete(item)}
            activeOpacity={0.85}
            accessibilityLabel="삭제"
          >
            <Icon name="trash-can-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const emptyNode = useMemo(() => {
    const total = originalItems.length;
    const shown = filteredItems.length;
    const hasFilter = !!dateFilter || query.trim().length >= 2;

    if (total === 0) {
      return (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>아직 등록된 제품이 없어요</Text>
          <Text style={styles.emptyDesc}>바코드를 스캔하거나 직접 추가해보세요.</Text>

          <View style={styles.emptyBtnRow}>
            <TouchableOpacity style={styles.emptySecondaryBtn} onPress={onScanBarcode}>
              <Icon name="barcode-scan" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.emptyPrimaryBtn} onPress={onAddNew}>
              <Icon name="plus" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (shown === 0 && hasFilter) {
      return (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
          <Text style={styles.emptyDesc}>조건을 지우고 다시 확인해보세요.</Text>

          <View style={styles.emptyBtnRow}>
            <TouchableOpacity style={styles.ghostBtn} onPress={clearQuery}>
              <Icon name="backspace-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={clearDateFilter}>
              <Icon name="calendar-remove-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  }, [originalItems.length, filteredItems.length, dateFilter, query, onAddNew, onScanBarcode]);

  // ✅ 고정 헤더(FlatList 밖으로 이동)
  const Header = (
    <View style={styles.stickyHeader}>
      <ScreenHeader
        title="유통기한 관리"
        sideWidth={72}
        left={
          <AppButton
            accessibilityLabel="보관함"
            onPress={onOpenMaster}
            style={styles.dbBtn}
            textStyle={styles.dbText}
            icon={<Icon name="archive-outline" size={18} color={colors.text} />}
          />
        }
        right={
          <AppButton
            accessibilityLabel="추가"
            onPress={onAddNew}
            style={styles.addBtn}
            textStyle={styles.addText}
            icon={<Icon name="plus" size={18} color={colors.white} />}
          />
        }
      />

      <View style={styles.controls}>
        <View style={styles.searchLine}>
          <View style={styles.searchBox}>
            <SearchInput
              value={draftQuery}
              onChangeText={setDraftQuery}
              placeholder="상품명 검색 (2글자 이상)"
              placeholderTextColor="#6B7280"
              inputStyle={styles.searchInput}
              returnKeyType="search"
              textAlignVertical="center"
            />
            {!!draftQuery.trim() && (
              <TouchableOpacity style={styles.searchClear} onPress={clearQuery}>
                <Text style={styles.searchClearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.scanBtn} onPress={onScanBarcode} accessibilityLabel="스캔">
            <Icon name="barcode-scan" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.countText}>{countText}</Text>
          {query.trim().length > 0 && query.trim().length < 2 && (
            <Text style={styles.hintText}>2글자부터 검색</Text>
          )}
        </View>

        <View style={styles.filterLine}>
          <TouchableOpacity
            style={[styles.filterChip, displayDate && styles.filterChipOn]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.85}
            accessibilityLabel="날짜 필터"
          >
            <View style={styles.filterChipInner}>
              <Icon
                name="calendar-month-outline"
                size={20}
                color={displayDate ? colors.primary : colors.text}
              />
              {!!displayDate && (
                <Text style={styles.filterChipLabel} numberOfLines={1} ellipsizeMode="tail">
                  {displayDate}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {!!displayDate && (
            <TouchableOpacity
              style={styles.filterChipClose}
              onPress={clearDateFilter}
              activeOpacity={0.85}
              accessibilityLabel="날짜 필터 해제"
            >
              <Text style={styles.filterChipCloseText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {Header}

      <FlatList
        style={{ flex: 1 }}
        data={filteredItems}
        keyExtractor={it => String(it.inventoryId)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={emptyNode}
        keyboardShouldPersistTaps="handled"
      />

      {showDatePicker && (
        <DateTimePicker
          value={(dateFilter ? parseYMD(dateFilter) : null) ?? new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Modal
        visible={viewerOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setViewerOpen(false)}
      >
        <FullscreenImageModal uri={viewerUri ?? ''} onClose={() => setViewerOpen(false)} />
      </Modal>
    </SafeAreaView>
  );
}
