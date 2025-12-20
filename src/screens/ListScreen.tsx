// src/screens/ListScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  InventoryRow,
  deleteInventoryItem,
  fetchInventoryWithProduct,
} from '../db/sqlite';
import FullscreenImageModal from './FullscreenImageModal';

/** ---- D-day / 정렬 유틸 ---- */
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
function isExpired(expiryYmd: string) {
  const exp = parseYMD(expiryYmd);
  if (!exp) return false;
  return exp.getTime() < startOfToday().getTime();
}
function toExpiryTime(expiryYmd: string) {
  const exp = parseYMD(expiryYmd);
  return exp ? exp.getTime() : Number.MAX_SAFE_INTEGER;
}
function ddayText(expiryYmd: string) {
  const exp = parseYMD(expiryYmd);
  if (!exp) return '날짜 오류';
  const d = diffDays(startOfToday(), exp);
  if (d < 0) return `만료 D+${Math.abs(d)}`;
  if (d === 0) return 'D-DAY';
  return `D-${d}`;
}
/** ---- 유틸 끝 ---- */

type Props = {
  onAddNew: () => void;
  onOpenMaster: () => void;
  onEdit: (item: InventoryRow) => void;
  reloadSignal: number;
  // ✅ 검색 관련 props 추가
  query: string;
  dateFilter: string | null;
  onQueryChange: (q: string) => void;
  onDateFilterChange: (d: string | null) => void;
  onScanBarcode: () => void;
};
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

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
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [originalItems, setOriginalItems] = useState<InventoryRow[]>([]); // ✅ 원본 데이터 저장
  const [showDatePicker, setShowDatePicker] = useState(false); // ✅ 추가: 날짜 선택기 표시 상태
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUri, setViewerUri] = useState<string | null>(null);

  const openViewer = (uri: string) => {
    setViewerUri(uri);
    setViewerOpen(true);
  };

  const [ratios, setRatios] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    const data = await fetchInventoryWithProduct();

    // 정렬: 만료 먼저 -> 유통기한 가까운 순 -> 같은 날짜면 최신 등록
    data.sort((a, b) => {
      const ae = isExpired(a.expiryDate);
      const be = isExpired(b.expiryDate);
      if (ae !== be) return ae ? -1 : 1;

      const at = toExpiryTime(a.expiryDate);
      const bt = toExpiryTime(b.expiryDate);
      if (at !== bt) return at - bt;

      return b.inventoryId - a.inventoryId;
    });

    setOriginalItems(data); // ✅ 원본 데이터 저장
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load, reloadSignal]);

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

  const THUMB_W = 96;
  const MIN_H = 72;
  const MAX_H = 140;

  const filteredItems = useMemo(() => {
    let filtered = originalItems;

    // 1. 텍스트 검색 (물품명/바코드)
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(it => {
        const name = (it.name ?? '').toLowerCase();
        const bc = (it.barcode ?? '').toLowerCase();
        return name.includes(q) || bc.includes(q);
      });
    }

    // 2. 날짜 필터링 (유통기한)
    if (dateFilter) {
      filtered = filtered.filter(it => it.expiryDate === dateFilter);
    }

    return filtered;
  }, [originalItems, query, dateFilter]);

  const renderItem = ({ item }: { item: InventoryRow }) => {
    const expired = isExpired(item.expiryDate);
    const dday = ddayText(item.expiryDate);

    const keyUri = item.thumbUri;
    const ratio = ratios[keyUri] ?? 1;
    const thumbH = clamp(THUMB_W / ratio, MIN_H, MAX_H);

    return (
      <View style={[styles.card, expired && styles.cardExpired]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openViewer(item.imageUri)}
          style={[styles.thumbWrap, { width: THUMB_W, height: thumbH }]}
        >
          <Image
            source={{ uri: item.thumbUri }}
            style={styles.thumbImg}
            resizeMode="contain"
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
        </TouchableOpacity>

        <View style={styles.meta}>
          <Text style={[styles.dday, expired && styles.ddayExpired]}>
            {dday}
          </Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sub}>유통기한: {item.expiryDate}</Text>
          <Text style={styles.sub}>등록: {item.createdAt.slice(0, 10)}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => onEdit(item)}
            >
              <Text style={styles.smallBtnText}>수정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, styles.delBtn]}
              onPress={() => confirmDelete(item)}
            >
              <Text style={[styles.smallBtnText, styles.delText]}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const ymd = selectedDate.toISOString().slice(0, 10);
      onDateFilterChange(ymd);
    }
  };

  const clearDateFilter = () => {
    onDateFilterChange(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>제품 목록</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.dbBtn} onPress={onOpenMaster}>
            <Text style={styles.dbText}>DB</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={onAddNew}>
            <Text style={styles.addText}>+ 추가</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ 검색 UI 추가 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="물품명 / 바코드 검색"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TouchableOpacity style={styles.scanBtn} onPress={onScanBarcode}>
            <Text style={styles.scanBtnText}>바코드 스캔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateFilterRow}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateBtnText}>
              {dateFilter ? `유통기한: ${dateFilter}` : '날짜 필터 선택'}
            </Text>
          </TouchableOpacity>
          {dateFilter && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearDateFilter}>
              <Text style={styles.clearBtnText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateFilter ? new Date(dateFilter) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <FlatList
        data={filteredItems} // ✅ 필터링된 데이터 사용
        keyExtractor={it => String(it.inventoryId)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {originalItems.length === 0
              ? '아직 저장된 제품이 없어요.'
              : '검색 결과가 없어요.'}
          </Text>
        }
      />

      <Modal
        visible={viewerOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setViewerOpen(false)}
      >
        <FullscreenImageModal
          uri={viewerUri ?? ''}
          onClose={() => setViewerOpen(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'black' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { color: 'white', fontSize: 30, fontWeight: '800' },

  // ✅ 검색 UI 스타일
  searchContainer: { paddingHorizontal: 16, paddingBottom: 10 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#111',
  },
  scanBtn: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  scanBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateFilterRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  dateBtn: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateBtnText: { color: 'white' },
  clearBtn: {
    backgroundColor: '#333',
    borderRadius: 12,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: { color: 'white', fontWeight: 'bold' },

  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  addText: { fontWeight: '800' },

  list: { padding: 16, gap: 12 },
  empty: { color: '#aaa', marginTop: 30, textAlign: 'center' },

  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  cardExpired: { borderWidth: 1, borderColor: '#3a1f1f' },

  thumbWrap: {
    borderRadius: 12,
    backgroundColor: '#222',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },

  meta: { flex: 1 },
  dday: { color: 'white', fontSize: 25, fontWeight: '900' },
  ddayExpired: { color: '#ff6b6b' },

  name: { color: 'white', marginTop: 4, fontSize: 22, fontWeight: '800' },
  sub: { color: '#aaa', marginTop: 2, fontSize: 20 },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  smallBtnText: { color: '#ddd', fontWeight: '700' },
  delBtn: { borderColor: '#3a1f1f' },
  delText: { color: '#ffb3b3' },

  dbBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'transparent',
  },
  dbText: { color: 'white', fontWeight: '900' },
});
