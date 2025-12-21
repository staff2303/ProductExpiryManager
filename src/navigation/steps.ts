export const STEPS = {
  LIST: 'list',
  SCAN: 'scan',
  NEW_PRODUCT_FULL: 'new_product_full',
  EXPIRY: 'expiry',
  EDIT: 'edit',
  EDIT_CAMERA: 'edit_camera',
  EDIT_PREVIEW: 'edit_preview',
  INVENTORY_CHECK_MODAL: 'inventory_check_modal',
  MASTER_LIST: 'master_list',
  MASTER_SCAN: 'master_scan',
  MASTER_EDIT: 'master_edit',
  MASTER_EDIT_CAMERA: 'master_edit_camera',
  MASTER_EDIT_PREVIEW: 'master_edit_preview',
  LIST_SCAN: 'list_scan',
} as const;

export type Step = typeof STEPS[keyof typeof STEPS];
