import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
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

type Props = {
  onBack: () => void;
  onEdit: (p: MasterProduct) => void;
  reloadSignal: number;
};

export default function MasterListScreen({
  onBack,
  onEdit,
  reloadSignal,
}: Props) {
  const [items, setItems] = useState<MasterProduct[]>([]);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const data = await fetchMasterProducts();
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load, reloadSignal]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(it => {
      const name = (it.name ?? '').toLowerCase();
      const bc = (it.barcode ?? '').toLowerCase();
      return name.includes(query) || bc.includes(query);
    });
  }, [items, q]);

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
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.thumbUri }}
          style={styles.thumb}
          resizeMode="contain"
        />

        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            바코드: {item.barcode ?? '-'}
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => onEdit(item)}
            >
              <Text style={styles.smallBtnText}>편집</Text>
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>총상품 DB</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="상품명 / 바코드 검색"
          placeholderTextColor="#888"
          style={styles.input}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={it => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>등록된 총상품이 없어요.</Text>
        }
      />
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
  back: { color: 'white', fontSize: 26, fontWeight: '900', width: 30 },
  title: { color: 'white', fontSize: 26, fontWeight: '900' },

  searchRow: { paddingHorizontal: 16, paddingBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    backgroundColor: '#111',
  },

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
  thumb: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: '#222',
  },
  meta: { flex: 1 },
  name: { color: 'white', fontSize: 20, fontWeight: '900' },
  sub: { color: '#aaa', marginTop: 4, fontSize: 14 },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  smallBtnText: { color: '#ddd', fontWeight: '800' },
  delBtn: { borderColor: '#3a1f1f' },
  delText: { color: '#ffb3b3' },
});
