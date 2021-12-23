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
  BARCODE_AUGMENTED: 'barcodeAugmented',
  BARCODE: ITEM_FIELDS.BARCODE,
  TITLE: HOLD_FIELDS.TITLE,
  PICK_UP_LOCATION: HOLD_FIELDS.PICK_UP_LOCATION,
  HOLD: TRANSACTION_FIELDS.HOLD,
  NO: 'no',
  ACTIONS: 'actions',
};

export const CHECK_IN_STATUSES = {
  AWAITING_PICKUP: 'Awaiting pickup',
  IN_TRANSIT: 'In transit',
};

export const AUGMENTED_BARCODE_TEMPLATE = `
  <h1>{{item.title}}</h1>
  <ul>
    <li>Original Barcode: {{transaction.shippedItemBarcode}}</li>
    <li>Item Agency: {{transaction.itemAgencyCode}}</li>
    <li>New Barcode: {{transaction.folioItemBarcode}}</li>
  <ul>
  <span>{{item.barcodeImage}}</span>
`;
