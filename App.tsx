// App.tsx

import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, ToastAndroid, View } from 'react-native';

import BarcodeScanScreen from './src/screens/BarcodeScanScreen';
import NewProductFullScreen from './src/screens/NewProductFullScreen';
import ExpiryScreen from './src/screens/ExpiryScreen';
import ListScreen from './src/screens/ListScreen';

import MasterListScreen from './src/screens/MasterListScreen';
import MasterEditScreen from './src/screens/MasterEditScreen';

import CameraScreen from './src/screens/CameraScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import InventoryCheckModal from './src/components/InventoryCheckModal';

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
  deleteInventoryItem,
} from './src/db/sqlite';

import { createResizedImages } from './src/utils/imageResize';

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
  | 'master_edit_preview'
  | 'inventory_check_modal'; // ✅ 추가: 모달 상태

export default function App() {
  const [step, setStep] = useState<Step>('list');

  // ✅ 추가: 재고 확인 모달
  const [inventoryToCheck, setInventoryToCheck] = useState<InventoryRow | null>(
    null,
  );

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

      // ✅ 추가: 모달 상태에서 뒤로가기 처리
      if (step === 'inventory_check_modal') {
        setInventoryToCheck(null);
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

  // ✅ 변경: 최상위 View로 감싸고 모달을 조건부 렌더링
  return (
    <View style={{ flex: 1 }}>
      {/* 현재 step에 해당하는 화면 렌더링 */}
      {(() => {
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
                    // ✅ 변경: 기존 재고가 있는 경우 Alert 대신 커스텀 모달 표시
                    setInventoryToCheck(inventory);
                    setStep('inventory_check_modal');
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

        return null;
      })()}

      {/* ✅ 추가: 재고 확인 모달 렌더링 */}
      {inventoryToCheck && (
        <InventoryCheckModal
          visible={step === 'inventory_check_modal'}
          inventory={inventoryToCheck}
          onClose={() => {
            setInventoryToCheck(null);
            setStep('list');
          }}
          onEdit={() => {
            setEditing(inventoryToCheck);
            setEditUri(null);
            setInventoryToCheck(null);
            setStep('edit');
          }}
          onDelete={async () => {
            await deleteInventoryItem(inventoryToCheck.inventoryId);
            ToastAndroid.show('재고를 삭제했습니다.', ToastAndroid.SHORT);
            setInventoryToCheck(null);
            setReloadSignal(s => s + 1);
            setStep('list');
          }}
        />
      )}
    </View>
  );
}
