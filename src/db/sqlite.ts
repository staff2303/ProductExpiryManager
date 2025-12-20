import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'product_expiry_v2.db';
let db: any = null;

export async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  return db;
}

/**
 * ✅ DB 날림 모드
 * - 기존 테이블 있으면 DROP
 * - 새 스키마(master_products + inventory_items) 재생성
 */
export async function initDb() {
  const d = await getDb();

  await d.executeSql(`DROP TABLE IF EXISTS products;`).catch(() => {});
  await d.executeSql(`DROP TABLE IF EXISTS inventory_items;`).catch(() => {});
  await d.executeSql(`DROP TABLE IF EXISTS master_products;`).catch(() => {});

  await d.executeSql(`
    CREATE TABLE IF NOT EXISTS master_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE,
      name TEXT NOT NULL,
      image_uri TEXT NOT NULL,
      thumb_uri TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await d.executeSql(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL UNIQUE,
      expiry_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES master_products(id)
    );
  `);
}

/** ---------- Types ---------- */
export type MasterProduct = {
  id: number;
  barcode: string | null;
  name: string;
  imageUri: string;
  thumbUri: string;
  createdAt: string;
};

export type InventoryRow = {
  inventoryId: number;
  expiryDate: string;
  createdAt: string;

  productId: number;
  barcode: string | null;
  name: string;
  imageUri: string;
  thumbUri: string;
};

/** ---------- Master Products ---------- */
export async function getMasterByBarcode(
  barcode: string,
): Promise<MasterProduct | null> {
  const d = await getDb();
  const [res] = await d.executeSql(
    `SELECT id, barcode, name, image_uri, thumb_uri, created_at
     FROM master_products
     WHERE barcode = ?
     LIMIT 1`,
    [barcode],
  );

  if (!res.rows.length) return null;
  const row = res.rows.item(0);
  return {
    id: row.id,
    barcode: row.barcode,
    name: row.name,
    imageUri: row.image_uri,
    thumbUri: row.thumb_uri,
    createdAt: row.created_at,
  };
}

export async function upsertMasterProduct(
  p: Omit<MasterProduct, 'id'>,
): Promise<number> {
  const d = await getDb();

  await d.executeSql(
    `INSERT INTO master_products (barcode, name, image_uri, thumb_uri, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(barcode) DO UPDATE SET
       name = excluded.name,
       image_uri = excluded.image_uri,
       thumb_uri = excluded.thumb_uri`,
    [p.barcode, p.name, p.imageUri, p.thumbUri, p.createdAt],
  );

  const [res] = await d.executeSql(
    `SELECT id FROM master_products WHERE barcode = ? LIMIT 1`,
    [p.barcode],
  );
  return res.rows.item(0).id as number;
}

export async function updateMasterPhoto(
  productId: number,
  imageUri: string,
  thumbUri: string,
) {
  const d = await getDb();
  await d.executeSql(
    `UPDATE master_products SET image_uri = ?, thumb_uri = ? WHERE id = ?`,
    [imageUri, thumbUri, productId],
  );
}

/** ---------- Master 관리 ---------- */
export async function fetchMasterProducts(): Promise<MasterProduct[]> {
  const d = await getDb();
  const [res] = await d.executeSql(
    `SELECT id, barcode, name, image_uri, thumb_uri, created_at
     FROM master_products
     ORDER BY id DESC`,
  );

  const out: MasterProduct[] = [];
  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows.item(i);
    out.push({
      id: row.id,
      barcode: row.barcode,
      name: row.name,
      imageUri: row.image_uri,
      thumbUri: row.thumb_uri,
      createdAt: row.created_at,
    });
  }
  return out;
}

export async function updateMasterName(productId: number, name: string) {
  const d = await getDb();
  await d.executeSql(`UPDATE master_products SET name = ? WHERE id = ?`, [
    name,
    productId,
  ]);
}

/**
 * ✅ 마스터 삭제 시 연결된 재고도 같이 삭제
 */
export async function deleteMasterProduct(productId: number) {
  const d = await getDb();
  await d.executeSql(`DELETE FROM inventory_items WHERE product_id = ?`, [
    productId,
  ]);
  await d.executeSql(`DELETE FROM master_products WHERE id = ?`, [productId]);
}

/** ---------- Inventory ---------- */

/**
 * ✅ 유통기한 등록 규칙
 * - 해당 상품(product_id)에 유통기한이 이미 있으면 "더 빠른 날짜"만 반영
 * - 더 느리거나 같으면 반영 안 함
 *
 * @returns true = 반영됨(신규 또는 업데이트), false = 반영 안 됨
 */
export async function insertOrUpdateEarliestExpiry(
  productId: number,
  expiryDate: string, // YYYY-MM-DD
  createdAt: string,
): Promise<boolean> {
  const d = await getDb();

  // ✅ 기존 값이 더 빠르면 유지, 새 값이 더 빠를 때만 갱신
  await d.executeSql(
    `INSERT INTO inventory_items (product_id, expiry_date, created_at)
     VALUES (?, ?, ?)
     ON CONFLICT(product_id) DO UPDATE SET
       expiry_date = excluded.expiry_date,
       created_at  = excluded.created_at
     WHERE excluded.expiry_date < inventory_items.expiry_date`,
    [productId, expiryDate, createdAt],
  );

  // 변경이 실제로 일어났는지 판단(=현재 값이 expiryDate인지 확인)
  const [check] = await d.executeSql(
    `SELECT expiry_date FROM inventory_items WHERE product_id = ? LIMIT 1`,
    [productId],
  );

  if (check.rows.length === 0) return false;
  return check.rows.item(0).expiry_date === expiryDate;
}

export async function updateInventoryExpiry(
  inventoryId: number,
  expiryDate: string,
) {
  const d = await getDb();
  await d.executeSql(
    `UPDATE inventory_items SET expiry_date = ? WHERE id = ?`,
    [expiryDate, inventoryId],
  );
}

export async function deleteInventoryItem(inventoryId: number) {
  const d = await getDb();
  await d.executeSql(`DELETE FROM inventory_items WHERE id = ?`, [inventoryId]);
}

export async function getInventoryByProductId(
  productId: number,
): Promise<InventoryRow | null> {
  const d = await getDb();
  const [res] = await d.executeSql(
    `SELECT
        i.id AS inventory_id,
        i.expiry_date AS expiry_date,
        i.created_at AS inventory_created_at,

        p.id AS product_id,
        p.barcode AS barcode,
        p.name AS name,
        p.image_uri AS image_uri,
        p.thumb_uri AS thumb_uri
     FROM inventory_items i
     JOIN master_products p ON p.id = i.product_id
     WHERE i.product_id = ?
     LIMIT 1`,
    [productId],
  );

  if (!res.rows.length) return null;
  const row = res.rows.item(0);
  return {
    inventoryId: row.inventory_id,
    expiryDate: row.expiry_date,
    createdAt: row.inventory_created_at,
    productId: row.product_id,
    barcode: row.barcode,
    name: row.name,
    imageUri: row.image_uri,
    thumbUri: row.thumb_uri,
  };
}

export async function fetchInventoryWithProduct(): Promise<InventoryRow[]> {
  const d = await getDb();
  const [res] = await d.executeSql(
    `SELECT
        i.id AS inventory_id,
        i.expiry_date AS expiry_date,
        i.created_at AS inventory_created_at,

        p.id AS product_id,
        p.barcode AS barcode,
        p.name AS name,
        p.image_uri AS image_uri,
        p.thumb_uri AS thumb_uri
     FROM inventory_items i
     JOIN master_products p ON p.id = i.product_id
     ORDER BY i.expiry_date ASC, i.id DESC`,
  );

  const out: InventoryRow[] = [];
  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows.item(i);
    out.push({
      inventoryId: row.inventory_id,
      expiryDate: row.expiry_date,
      createdAt: row.inventory_created_at,
      productId: row.product_id,
      barcode: row.barcode,
      name: row.name,
      imageUri: row.image_uri,
      thumbUri: row.thumb_uri,
    });
  }
  return out;
}