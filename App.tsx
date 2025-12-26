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
import { STEPS, type Step } from './src/navigation/steps';

export default function App() {
  const [step, setStep] = useState<Step>(STEPS.LIST);

  // NEW_PRODUCT_FULL에서 유통기한 입력 필요 여부
  // - true : 기존처럼 유통기한까지 입력 후 저장(유통기한관리 흐름)
  // - false: 보관함(마스터)만 저장(유통기한/재고 저장 X)
  const [newProductRequireExpiry, setNewProductRequireExpiry] = useState(true);

  // NEW_PRODUCT_FULL 진입 출처
  // EXPIRY: 유통기한관리(ListScreen) 흐름
  // MASTER: 보관함(MasterListScreen) 흐름
  const [newProductFrom, setNewProductFrom] = useState<'EXPIRY' | 'MASTER'>(
    'EXPIRY',
  );

  // 재고 확인 모달
  const [inventoryToCheck, setInventoryToCheck] = useState<InventoryRow | null>(
    null,
  );

  // 목록 화면 필터링
  const [listQuery, setListQuery] = useState('');
  const [listDateFilter, setListDateFilter] = useState<string | null>(null);

  // 등록 흐름(스캔)
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [productImageUri, setProductImageUri] = useState<string | null>(null);

  // 재고 수정
  const [editing, setEditing] = useState<InventoryRow | null>(null);
  const [editUri, setEditUri] = useState<string | null>(null);

  // 보관함(마스터) 관리
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

  const goBackFromNewProduct = () => {
    // 공통 정리
    setBarcode(null);
    setProductId(null);
    setProductImageUri(null);

    // 출처에 따라 복귀
    setStep(newProductFrom === 'MASTER' ? STEPS.MASTER_LIST : STEPS.LIST);

    // 모드 원복
    setNewProductRequireExpiry(true);
    setNewProductFrom('EXPIRY');
  };

  // Android 뒤로가기
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === STEPS.LIST) {
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

      if (step === STEPS.MASTER_LIST) {
        setStep(STEPS.LIST);
        return true;
      }
      if (step === STEPS.MASTER_EDIT) {
        setEditingMaster(null);
        setMasterEditUri(null);
        setStep(STEPS.MASTER_LIST);
        return true;
      }
      if (step === STEPS.MASTER_EDIT_CAMERA) {
        setMasterEditUri(null);
        setStep(STEPS.MASTER_EDIT);
        return true;
      }
      if (step === STEPS.MASTER_EDIT_PREVIEW) {
        setStep(STEPS.MASTER_EDIT_CAMERA);
        return true;
      }

      if (step === STEPS.MASTER_SCAN) {
        setStep(STEPS.MASTER_LIST);
        return true;
      }

      if (step === STEPS.LIST_SCAN) {
        setStep(STEPS.LIST);
        return true;
      }

      if (step === STEPS.SCAN) {
        setBarcode(null);
        setStep(STEPS.LIST);
        return true;
      }

      if (step === STEPS.NEW_PRODUCT_FULL) {
        // ✅ NEW_PRODUCT_FULL은 출처에 따라 복귀
        goBackFromNewProduct();
        return true;
      }

      if (step === STEPS.INVENTORY_CHECK_MODAL) {
        setInventoryToCheck(null);
        setStep(STEPS.LIST);
        return true;
      }

      if (step === STEPS.EXPIRY) {
        setBarcode(null);
        setProductId(null);
        setProductImageUri(null);
        setStep(STEPS.LIST);
        return true;
      }

      if (step === STEPS.EDIT) {
        setEditing(null);
        setEditUri(null);
        setStep(STEPS.LIST);
        return true;
      }
      if (step === STEPS.EDIT_CAMERA) {
        setEditUri(null);
        setStep(STEPS.EDIT);
        return true;
      }
      if (step === STEPS.EDIT_PREVIEW) {
        setStep(STEPS.EDIT_CAMERA);
        return true;
      }

      setStep(STEPS.LIST);
      return true;
    });

    return () => sub.remove();
  }, [step, newProductFrom]);

  return (
    <View style={{ flex: 1 }}>
      {(() => {
        if (step === STEPS.LIST) {
          return (
            <ListScreen
              reloadSignal={reloadSignal}
              query={listQuery}
              dateFilter={listDateFilter}
              onQueryChange={setListQuery}
              onDateFilterChange={d => {
                setListDateFilter(d);
              }}
              onScanBarcode={() => setStep(STEPS.LIST_SCAN)}
              onAddNew={() => setStep(STEPS.SCAN)}
              onOpenMaster={() => setStep(STEPS.MASTER_LIST)}
              onEdit={item => {
                setEditing(item);
                setEditUri(null);
                setStep(STEPS.EDIT);
              }}
            />
          );
        }

        if (step === STEPS.MASTER_LIST) {
          return (
            <MasterListScreen
              reloadSignal={masterReload}
              onBack={() => setStep(STEPS.LIST)}
              onScanBarcode={() => setStep(STEPS.MASTER_SCAN)}
              onEdit={p => {
                setEditingMaster(p);
                setMasterEditUri(null);
                setStep(STEPS.MASTER_EDIT);
              }}
            />
          );
        }

        // 보관함(마스터)에서 스캔
        if (step === STEPS.MASTER_SCAN) {
          return (
            <BarcodeScanScreen
              onBack={() => setStep(STEPS.MASTER_LIST)}
              onScanned={async code => {
                const found = await getMasterByBarcode(code);
                if (found) {
                  setEditingMaster(found);
                  setMasterEditUri(null);
                  setStep(STEPS.MASTER_EDIT);
                } else {
                  Alert.alert(
                    '상품 없음',
                    '해당 바코드의 상품이 [보관함]에 없습니다. 새로 등록하시겠습니까?',
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '새로 등록',
                        onPress: () => {
                          console.log(
                            '[PATH] MASTER_SCAN -> NEW_PRODUCT_FULL (requireExpiry=false)',
                          );
                          setBarcode(code);

                          // ✅ 보관함에서 등록: 유통기한 없이 마스터만 저장
                          setNewProductFrom('MASTER');
                          setNewProductRequireExpiry(false);

                          setStep(STEPS.NEW_PRODUCT_FULL);
                        },
                      },
                    ],
                  );
                }
              }}
            />
          );
        }

        if (step === STEPS.MASTER_EDIT && editingMaster) {
          const currentUri = masterEditUri ?? editingMaster.imageUri;

          return (
            <MasterEditScreen
              product={editingMaster}
              currentImageUri={currentUri}
              onBack={() => {
                setEditingMaster(null);
                setMasterEditUri(null);
                setStep(STEPS.MASTER_LIST);
              }}
              onRetakePhoto={() => setStep(STEPS.MASTER_EDIT_CAMERA)}
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

                setStep(STEPS.MASTER_LIST);
              }}
            />
          );
        }

        if (step === STEPS.MASTER_EDIT_CAMERA && editingMaster) {
          return (
            <CameraScreen
              onBack={() => setStep(STEPS.MASTER_EDIT)}
              onCaptured={u => {
                setMasterEditUri(u);
                setStep(STEPS.MASTER_EDIT_PREVIEW);
              }}
            />
          );
        }

        if (
          step === STEPS.MASTER_EDIT_PREVIEW &&
          editingMaster &&
          masterEditUri
        ) {
          return (
            <PreviewScreen
              uri={masterEditUri}
              onBack={() => setStep(STEPS.MASTER_EDIT)}
              onRetake={() => {
                setMasterEditUri(null);
                setStep(STEPS.MASTER_EDIT_CAMERA);
              }}
              onUse={() => setStep(STEPS.MASTER_EDIT)}
            />
          );
        }

        // 유통기한관리에서 신규 등록(스캔)
        if (step === STEPS.SCAN) {
          return (
            <BarcodeScanScreen
              onBack={() => {
                setBarcode(null);
                setStep(STEPS.LIST);
              }}
              onScanned={async code => {
                setBarcode(code);

                const found = await getMasterByBarcode(code);
                if (found) {
                  const inventory = await getInventoryByProductId(found.id);

                  if (inventory) {
                    setInventoryToCheck(inventory);
                    setStep(STEPS.INVENTORY_CHECK_MODAL);
                  } else {
                    setProductId(found.id);
                    setProductImageUri(found.imageUri);
                    setStep(STEPS.EXPIRY);
                  }
                } else {
                  console.log(
                    '[PATH] SCAN -> NEW_PRODUCT_FULL (requireExpiry=true)',
                  );

                  // ✅ 유통기한관리에서 등록: 유통기한 포함
                  setNewProductFrom('EXPIRY');
                  setNewProductRequireExpiry(true);

                  setStep(STEPS.NEW_PRODUCT_FULL);
                }
              }}
            />
          );
        }

        // 유통기한관리에서 바코드로 찾기
        if (step === STEPS.LIST_SCAN) {
          return (
            <BarcodeScanScreen
              onBack={() => setStep(STEPS.LIST)}
              onScanned={async code => {
                const master = await getMasterByBarcode(code);

                if (master) {
                  const inventory = await getInventoryByProductId(master.id);

                  if (inventory) {
                    setListQuery(code);
                    setStep(STEPS.LIST);
                    return;
                  }

                  setBarcode(code);
                  setProductId(master.id);
                  setProductImageUri(master.imageUri);
                  setStep(STEPS.EXPIRY);
                  return;
                }

                // 유통기한관리 쪽에서 없는 상품이면: 새로 등록(유통기한 포함)
                Alert.alert(
                  '상품 없음',
                  '해당 바코드의 상품이 [보관함]에 없습니다. 새로 등록하시겠습니까?',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '새로 등록',
                      onPress: () => {
                        console.log(
                          '[PATH] LIST_SCAN -> NEW_PRODUCT_FULL (requireExpiry=true)',
                        );

                        setBarcode(code);

                        // ✅ 유통기한관리에서 등록: 유통기한 포함
                        setNewProductFrom('EXPIRY');
                        setNewProductRequireExpiry(true);

                        setStep(STEPS.NEW_PRODUCT_FULL);
                      },
                    },
                  ],
                );
              }}
            />
          );
        }

        if (step === STEPS.NEW_PRODUCT_FULL && barcode) {
          return (
            <NewProductFullScreen
              barcode={barcode}
              requireExpiry={newProductRequireExpiry}
              onBack={goBackFromNewProduct}
              onSave={async ({ photoUri, name, expiryDate }) => {
                const { mainUri, thumbUri } = await createResizedImages(
                  photoUri,
                );

                const id = await upsertMasterProduct({
                  barcode,
                  name,
                  imageUri: mainUri,
                  thumbUri,
                  createdAt: new Date().toISOString(),
                });

                // requireExpiry=true일 때만 재고/유통기한 저장
                if (newProductRequireExpiry) {
                  await insertOrUpdateEarliestExpiry(
                    id,
                    expiryDate as string,
                    new Date().toISOString(),
                  );
                }

                setBarcode(null);
                setProductId(null);
                setProductImageUri(null);

                setMasterReload(s => s + 1);
                setReloadSignal(s => s + 1);

                // ✅ 저장 후 출처에 따라 복귀
                setStep(
                  newProductFrom === 'MASTER' ? STEPS.MASTER_LIST : STEPS.LIST,
                );

                // 원복
                setNewProductRequireExpiry(true);
                setNewProductFrom('EXPIRY');
              }}
            />
          );
        }

        if (step === STEPS.EXPIRY && productId && productImageUri) {
          return (
            <ExpiryScreen
              uri={productImageUri}
              mode="create"
              onBack={() => setStep(STEPS.LIST)}
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
                  return;
                }

                setBarcode(null);
                setProductId(null);
                setProductImageUri(null);

                setReloadSignal(s => s + 1);
                setStep(STEPS.LIST);
              }}
            />
          );
        }

        if (step === STEPS.EDIT && editing) {
          const currentUri = editUri ?? editing.imageUri;

          return (
            <ExpiryScreen
              uri={currentUri}
              mode="edit"
              initialExpiryDate={editing.expiryDate}
              onBack={() => {
                setEditing(null);
                setEditUri(null);
                setStep(STEPS.LIST);
              }}
              onRetakePhoto={() => setStep(STEPS.EDIT_CAMERA)}
              onNext={async ({ expiryDate }) => {
                await updateInventoryExpiry(editing.inventoryId, expiryDate);

                if (editUri) {
                  const { mainUri, thumbUri } = await createResizedImages(
                    editUri,
                  );
                  await updateMasterPhoto(editing.productId, mainUri, thumbUri);
                  setMasterReload(s => s + 1);
                }

                setEditing(null);
                setEditUri(null);

                setReloadSignal(s => s + 1);
                setStep(STEPS.LIST);
              }}
            />
          );
        }

        if (step === STEPS.EDIT_CAMERA && editing) {
          return (
            <CameraScreen
              onBack={() => setStep(STEPS.EDIT)}
              onCaptured={u => {
                setEditUri(u);
                setStep(STEPS.EDIT_PREVIEW);
              }}
            />
          );
        }

        if (step === STEPS.EDIT_PREVIEW && editing && editUri) {
          return (
            <PreviewScreen
              uri={editUri}
              onBack={() => setStep(STEPS.EDIT)}
              onRetake={() => {
                setEditUri(null);
                setStep(STEPS.EDIT_CAMERA);
              }}
              onUse={() => setStep(STEPS.EDIT)}
            />
          );
        }

        return null;
      })()}

      {inventoryToCheck && (
        <InventoryCheckModal
          visible={step === STEPS.INVENTORY_CHECK_MODAL}
          inventory={inventoryToCheck}
          onClose={() => {
            setInventoryToCheck(null);
            setStep(STEPS.LIST);
          }}
          onEdit={() => {
            setEditing(inventoryToCheck);
            setEditUri(null);
            setInventoryToCheck(null);
            setStep(STEPS.EDIT);
          }}
          onDelete={async () => {
            await deleteInventoryItem(inventoryToCheck.inventoryId);
            ToastAndroid.show('재고를 삭제했습니다.', ToastAndroid.SHORT);
            setInventoryToCheck(null);
            setReloadSignal(s => s + 1);
            setStep(STEPS.LIST);
          }}
        />
      )}
    </View>
  );
}
