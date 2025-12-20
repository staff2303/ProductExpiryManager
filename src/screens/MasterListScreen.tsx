// src/screens/MasterListScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MasterProduct,
  deleteMasterProduct,
  fetchMasterProducts,
} from '../db/sqlite';
import FullscreenImageModal from './FullscreenImageModal';
import { styles } from './MasterListScreen.styles';

type Props = {
  onBack: () => void;
  onEdit: (p: MasterProduct) => void;
  reloadSignal: number;
  onScanBarcode: () => void;
};

export default function MasterListScreen({
  onBack,
  onEdit,
  reloadSignal,
  onScanBarcode,
}: Props) {
  const [items, setItems] = useState<MasterProduct[]>([]);
  const [query, setQuery] = useState('');
  const [draftQuery, setDraftQuery] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 250;

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUri, setViewerUri] = useState<string | null>(null);

  const openViewer = (uri: string) => {
    setViewerUri(uri);
    setViewerOpen(true);
  };

  const load = useCallback(async () => {
    const data = await fetchMasterProducts();
    setItems(data);
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
      if (draftQuery !== query) setQuery(draftQuery);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draftQuery, query]);

  const filtered = useMemo(() => {
    const raw = query.trim();
    if (raw.length < 2) return items;

    const q = raw.toLowerCase();
    const digitsOnly = /^\d+$/.test(raw);

    return items.filter(it => {
      const name = (it.name ?? '').toLowerCase();
      const bc = (it.barcode ?? '').toLowerCase();
      if (digitsOnly) return bc.includes(q);
      return name.includes(q);
    });
  }, [items, query]);

  const countText = useMemo(() => {
    const total = items.length;
    const shown = filtered.length;
    const searching = query.trim().length >= 2;
    if (!searching) return `전체 ${total}개`;
    return `표시 ${shown}개 · 전체 ${total}개 (검색)`;
  }, [items.length, filtered.length, query]);

  const clearQuery = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDraftQuery('');
    setQuery('');
  };

  const confirmDelete = (p: MasterProduct) => {
    Alert.alert(
      '상품 삭제',
      '이 상품에 연결된 유통기한(재고)도 함께 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await deleteMasterProduct(p.id);
            ToastAndroid.show('삭제했습니다', ToastAndroid.SHORT);
            await load();
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderItem = ({ item }: { item: MasterProduct }) => {
    const hasImg = !!item.thumbUri?.trim();

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openViewer(item.imageUri)}
          style={styles.thumbWrap}
        >
          {hasImg ? (
            <Image source={{ uri: item.thumbUri }} style={styles.thumbImg} resizeMode="cover" />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text style={styles.thumbPlaceholderText}>NO IMG</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>

          {!!item.barcode?.trim() ? (
            <Text style={styles.barcode} numberOfLines={1} ellipsizeMode="tail">
              #{item.barcode}
            </Text>
          ) : (
            <Text style={styles.barcodeMuted} numberOfLines={1}>
              바코드 없음
            </Text>
          )}

          <View style={styles.metaCol}>
            <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
              등록 {item.createdAt?.slice?.(0, 10) ?? '-'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)} activeOpacity={0.85}>
            <Text style={styles.iconBtnText}>✎</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnDanger]}
            onPress={() => confirmDelete(item)}
            activeOpacity={0.85}
          >
            <Text style={[styles.iconBtnText, styles.iconBtnTextDanger]}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Empty = useMemo(() => {
    const total = items.length;
    const shown = filtered.length;
    const searching = query.trim().length >= 2;

    if (total === 0) {
      return (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>등록된 총상품이 없어요</Text>
          <Text style={styles.emptyDesc}>바코드를 스캔해서 총상품을 먼저 등록해보세요.</Text>

          <View style={styles.emptyBtnRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onScanBarcode}>
              <Text style={styles.primaryBtnText}>바코드 스캔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onBack}>
              <Text style={styles.ghostBtnText}>뒤로</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (shown === 0 && searching) {
      return (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
          <Text style={styles.emptyDesc}>검색어를 지우고 다시 확인해보세요.</Text>

          <View style={styles.emptyBtnRow}>
            <TouchableOpacity style={styles.ghostBtn} onPress={clearQuery}>
              <Text style={styles.ghostBtnText}>검색어 지우기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onScanBarcode}>
              <Text style={styles.ghostBtnText}>스캔</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  }, [items.length, filtered.length, query, onBack, onScanBarcode]);

  const Header = (
    <View style={styles.stickyHeader}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.85}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          총상품 DB
        </Text>

        <View style={styles.headerRightDummy} />
      </View>

      <View style={styles.controls}>
        <View style={styles.searchLine}>
          <View style={styles.searchBox}>
            <TextInput
              value={draftQuery}
              onChangeText={setDraftQuery}
              placeholder="상품명 검색 (2글자 이상)"
              placeholderTextColor="#777"
              style={styles.searchInput}
              returnKeyType="search"
              textAlignVertical="center"
            />
            {!!draftQuery.trim() && (
              <TouchableOpacity style={styles.searchClear} onPress={clearQuery}>
                <Text style={styles.searchClearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.scanBtn} onPress={onScanBarcode} activeOpacity={0.85}>
            <Text style={styles.scanBtnText}>스캔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.countText}>{countText}</Text>
          {query.trim().length > 0 && query.trim().length < 2 && (
            <Text style={styles.hintText}>2글자부터 검색</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={it => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={Empty}
      />

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
