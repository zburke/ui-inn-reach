import {
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
} from './transactions';

export const ITEM_FIELDS = {
  BARCODE: 'barcode',
};

export const FOLIO_CHECK_IN_FIELDS = {
  LOAN: 'loan',
  ITEM: 'item',
};

export const RECEIVED_ITEM_FIELDS = {
  TRANSACTION: 'transaction',
  FOLIO_CHECK_IN: 'folioCheckIn',
  BARCODE: ITEM_FIELDS.BARCODE,
  TITLE: HOLD_FIELDS.TITLE,
  PICK_UP_LOCATION: HOLD_FIELDS.PICK_UP_LOCATION,
  HOLD: TRANSACTION_FIELDS.HOLD,
  NO: 'no',
  ACTIONS: 'actions',
};
