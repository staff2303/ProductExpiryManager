import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, ToastAndroid } from 'react-native';

import BarcodeScanScreen from './src/screens/BarcodeScanScreen';
import NewProductFullScreen from './src/screens/NewProductFullScreen';
import ExpiryScreen from './src/screens/ExpiryScreen';
import ListScreen from './src/screens/ListScreen';

import MasterListScreen from './src/screens/MasterListScreen';
import MasterEditScreen from './src/screens/MasterEditScreen';

import CameraScreen from './src/screens/CameraScreen';
import PreviewScreen from './src/screens/PreviewScreen';

import {
  InventoryRow,
  MasterProduct,
  initDb,
  getMasterByBarcode,
  getInventoryByProductId,
  upsertMasterProduct,
  insertOrUpdateEarliestExpiry,
  updateInventoryExpiry,
  updateMasterPhoto,
  updateMasterName,
} from './src/db/sqlite';

import { createResizedImages } from './src/utils/imageResize';
import { deleteInventoryItem } from './src/db/sqlite';

type Step =
  | 'list'
  | 'scan'
  | 'new_product_full'
  | 'expiry'
  | 'edit'
  | 'edit_camera'
  | 'edit_preview'
  | 'master_list'
  | 'master_edit'
  | 'master_edit_camera'
  | 'master_edit_preview';

export default function App() {
  const [step, setStep] = useState<Step>('list');

  // 등록 흐름(스캔)
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [productImageUri, setProductImageUri] = useState<string | null>(null);

  // 재고 수정
  const [editing, setEditing] = useState<InventoryRow | null>(null);
  const [editUri, setEditUri] = useState<string | null>(null);

  // 총상품 DB 관리
  const [masterReload, setMasterReload] = useState(0);
  const [editingMaster, setEditingMaster] = useState<MasterProduct | null>(
    null,
  );
  const [masterEditUri, setMasterEditUri] = useState<string | null>(null);

  // 목록 새로고침
  const [reloadSignal, setReloadSignal] = useState(0);

  useEffect(() => {
    initDb().catch(e => console.error('initDb error', e));
  }, []);

  // Android 뒤로가기
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'list') {
        Alert.alert('앱 종료', '종료하시겠습니까?', [
          { text: '취소', style: 'cancel' },
          {
            text: '종료',
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }

      if (step === 'master_list') {
        setStep('list');
        return true;
      }
      if (step === 'master_edit') {
        setEditingMaster(null);
        setMasterEditUri(null);
        setStep('master_list');
        return true;
      }
      if (step === 'master_edit_camera') {
        setMasterEditUri(null);
        setStep('master_edit');
        return true;
      }
      if (step === 'master_edit_preview') {
        setStep('master_edit_camera');
        return true;
      }

      if (step === 'scan') {
        setBarcode(null);
        setStep('list');
        return true;
      }

      if (step === 'new_product_full') {
        setBarcode(null);
        setStep('list');
        return true;
      }

      if (step === 'expiry') {
        setBarcode(null);
        setProductId(null);
        setProductImageUri(null);
        setStep('list');
        return true;
      }

      if (step === 'edit') {
        setEditing(null);
        setEditUri(null);
        setStep('list');
        return true;
      }
      if (step === 'edit_camera') {
        setEditUri(null);
        setStep('edit');
        return true;
      }
      if (step === 'edit_preview') {
        setStep('edit_camera');
        return true;
      }

      setStep('list');
      return true;
    });

    return () => sub.remove();
  }, [step]);

  /** ---------- 재고 목록 ---------- */
  if (step === 'list') {
    return (
      <ListScreen
        reloadSignal={reloadSignal}
        onAddNew={() => setStep('scan')}
        onOpenMaster={() => setStep('master_list')}
        onEdit={item => {
          setEditing(item);
          setEditUri(null);
          setStep('edit');
        }}
      />
    );
  }

  /** ---------- 총상품 DB 목록 ---------- */
  if (step === 'master_list') {
    return (
      <MasterListScreen
        reloadSignal={masterReload}
        onBack={() => setStep('list')}
        onEdit={p => {
          setEditingMaster(p);
          setMasterEditUri(null);
          setStep('master_edit');
        }}
      />
    );
  }

  /** ---------- 총상품 편집(상품명/사진) ---------- */
  if (step === 'master_edit' && editingMaster) {
    const currentUri = masterEditUri ?? editingMaster.imageUri;

    return (
      <MasterEditScreen
        product={editingMaster}
        currentImageUri={currentUri}
        onBack={() => {
          setEditingMaster(null);
          setMasterEditUri(null);
          setStep('master_list');
        }}
        onRetakePhoto={() => setStep('master_edit_camera')}
        onSave={async name => {
          await updateMasterName(editingMaster.id, name);

          if (masterEditUri) {
            const { mainUri, thumbUri } = await createResizedImages(
              masterEditUri,
            );
            await updateMasterPhoto(editingMaster.id, mainUri, thumbUri);
          }

          setEditingMaster(null);
          setMasterEditUri(null);

          setMasterReload(s => s + 1);
          setReloadSignal(s => s + 1);

          setStep('master_list');
        }}
      />
    );
  }

  if (step === 'master_edit_camera' && editingMaster) {
    return (
      <CameraScreen
        onCaptured={u => {
          setMasterEditUri(u);
          setStep('master_edit_preview');
        }}
      />
    );
  }

  if (step === 'master_edit_preview' && editingMaster && masterEditUri) {
    return (
      <PreviewScreen
        uri={masterEditUri}
        onRetake={() => {
          setMasterEditUri(null);
          setStep('master_edit_camera');
        }}
        onUse={() => setStep('master_edit')}
      />
    );
  }

  /** ---------- 바코드 스캔 ---------- */
  if (step === 'scan') {
    return (
      <BarcodeScanScreen
        onBack={() => {
          setBarcode(null);
          setStep('list');
        }}
        onScanned={async code => {
          setBarcode(code);

          const found = await getMasterByBarcode(code);
          if (found) {
            const inventory = await getInventoryByProductId(found.id);

            if (inventory) {
              // ✅ 기존 재고가 있는 경우: 팝업 알림
              Alert.alert(
                '제품 정보 확인',
                `${found.name} 제품이 ${inventory.expiryDate} 유통기한으로 등록되어 있습니다.`,
                [
                  {
                    text: '수정',
                    onPress: () => {
                      setEditing(inventory);
                      setEditUri(null);
                      setStep('edit');
                    },
                  },
                  {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteInventoryItem(inventory.inventoryId);
                      ToastAndroid.show('재고를 삭제했습니다.', ToastAndroid.SHORT);
                      setReloadSignal(s => s + 1);
                      setStep('list');
                    },
                  },
                  {
                    text: '확인',
                    style: 'cancel',
                    onPress: () => setStep('list'),
                  },
                ],
              );
            } else {
              // ✅ 마스터는 있지만 재고가 없는 경우: 유통기한 등록 화면으로 이동
              setProductId(found.id);
              setProductImageUri(found.imageUri);
              setStep('expiry');
            }
          } else {
            // ✅ 마스터도 없는 경우: 새 상품 등록 화면으로 이동
            setStep('new_product_full');
          }
        }}
      />
    );
  }

  /** ---------- 새 상품 통합 등록(사진+이름+유통기한) ---------- */
  if (step === 'new_product_full' && barcode) {
    return (
      <NewProductFullScreen
        barcode={barcode}
        onBack={() => {
          setBarcode(null);
          setStep('list');
        }}
        onSave={async ({ photoUri, name, expiryDate }) => {
          const { mainUri, thumbUri } = await createResizedImages(photoUri);

          const id = await upsertMasterProduct({
            barcode,
            name,
            imageUri: mainUri,
            thumbUri,
            createdAt: new Date().toISOString(),
          });

          await insertOrUpdateEarliestExpiry(
            id,
            expiryDate,
            new Date().toISOString(),
          );

          setBarcode(null);
          setProductId(null);
          setProductImageUri(null);

          setMasterReload(s => s + 1);
          setReloadSignal(s => s + 1);

          setStep('list');
        }}
      />
    );
  }

  /** ---------- 유통기한 등록(기존 상품이면 날짜만) ---------- */
  if (step === 'expiry' && productId && productImageUri) {
    return (
      <ExpiryScreen
        uri={productImageUri}
        mode="create"
        onBack={() => setStep('list')}
        onNext={async ({ expiryDate }) => {
          const applied = await insertOrUpdateEarliestExpiry(
            productId,
            expiryDate,
            new Date().toISOString(),
          );

          if (!applied) {
            Alert.alert(
              '저장 안 됨',
              '이미 더 빠른 유통기한이 등록되어 있습니다.',
            );
            return; // ✅ 화면 유지
          }

          setBarcode(null);
          setProductId(null);
          setProductImageUri(null);

          setReloadSignal(s => s + 1);
          setStep('list');
        }}
      />
    );
  }

  /** ---------- 재고 수정: 유통기한 수정 + (옵션) 마스터 사진 변경 ---------- */
  if (step === 'edit' && editing) {
    const currentUri = editUri ?? editing.imageUri;

    return (
      <ExpiryScreen
        uri={currentUri}
        mode="edit"
        initialExpiryDate={editing.expiryDate}
        onBack={() => {
          setEditing(null);
          setEditUri(null);
          setStep('list');
        }}
        onRetakePhoto={() => setStep('edit_camera')}
        onNext={async ({ expiryDate }) => {
          await updateInventoryExpiry(editing.inventoryId, expiryDate);

          if (editUri) {
            const { mainUri, thumbUri } = await createResizedImages(editUri);
            await updateMasterPhoto(editing.productId, mainUri, thumbUri);
            setMasterReload(s => s + 1);
          }

          setEditing(null);
          setEditUri(null);

          setReloadSignal(s => s + 1);
          setStep('list');
        }}
      />
    );
  }

  if (step === 'edit_camera' && editing) {
    return (
      <CameraScreen
        onCaptured={u => {
          setEditUri(u);
          setStep('edit_preview');
        }}
      />
    );
  }

  if (step === 'edit_preview' && editing && editUri) {
    return (
      <PreviewScreen
        uri={editUri}
        onRetake={() => {
          setEditUri(null);
          setStep('edit_camera');
        }}
        onUse={() => setStep('edit')}
      />
    );
  }

  setStep('list');
  return null;
}
