export const TRANSACTION_STATUSES = {
  ITEM_HOLD: 'ITEM_HOLD',
  PATRON_HOLD: 'PATRON_HOLD',
  LOCAL_HOLD: 'LOCAL_HOLD',
  TRANSFER: 'TRANSFER',
  ITEM_SHIPPED: 'ITEM_SHIPPED',
  ITEM_IN_TRANSIT: 'ITEM_IN_TRANSIT',
  ITEM_RECEIVED: 'ITEM_RECEIVED',
  RECEIVE_UNANNOUNCED: 'RECEIVE_UNANNOUNCED',
  RETURN_UNCIRCULATED: 'RETURN_UNCIRCULATED',
  LOCAL_CHECKOUT: 'LOCAL_CHECKOUT',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  BORROWING_SITE_CANCEL: 'BORROWING_SITE_CANCEL',
  BORROWER_RENEW: 'BORROWER_RENEW',
  CLAIMS_RETURNED: 'CLAIMS_RETURNED',
  RECALL: 'RECALL',
  FINAL_CHECKIN: 'FINAL_CHECKIN',
};

export const TRANSACTION_TYPES = {
  ITEM: 'ITEM',
  PATRON: 'PATRON',
  LOCAL: 'LOCAL',
};

export const HOLD_FIELDS = {
  ID: 'id',
  TRANSACTION_TIME: 'transactionTime',
  PICH_UP_LOCATION: 'pickupLocation',
  PATRON_ID: 'patronId',
  PATRON_AGENCY_CODE: 'patronAgencyCode',
  ITEM_AGENCY_CODE: 'itemAgencyCode',
  ITEM_ID: 'itemId',
  NEED_BEFORE: 'needBefore',
  CENTRAL_ITEM_TYPE: 'centralItemType',
  CENTRAL_PATRON_TYPE: 'centralPatronType',
  PATRON_NAME: 'patronName',
  PATRON_HOME_LIBRARY: 'patronHomeLibrary',
  PATRON_PHONE: 'patronPhone',
  TITLE: 'title',
  AUTHOR: 'author',
  CALL_NUMBER: 'callNumber',
  SHIPPED_ITEM_BARCODE: 'shippedItemBarcode',
  METADATA: 'metadata',
};

export const TRANSACTION_FIELDS = {
  ID: 'id',
  CENTRAL_SERVER_CODE: 'centralServerCode',
  TYPE: 'type',
  TRACKING_ID: 'trackingId',
  HOLD: 'hold',
  STATUS: 'state',
  ITEM_TITLE: HOLD_FIELDS.TITLE,
  PATRON_NAME: HOLD_FIELDS.PATRON_NAME,
  TIME: HOLD_FIELDS.TRANSACTION_TIME,
};

export const TRANSACTION_LIST_DEFAULT_SORT_FIELD = TRANSACTION_FIELDS.TIME;

export const RESULT_COUNT_INCREMENT = 100;

export const TRANSACTION_SUMMARY = 'transactionSummary';
export const PATRON_INFORMATION = 'patronInformation';
export const ITEM_INFORMATION = 'itemInformation';

export const TRANSACTION_DETAIL_ACCORDION_STATE = {
  [TRANSACTION_SUMMARY]: true,
  [PATRON_INFORMATION]: true,
  [ITEM_INFORMATION]: true,
};

export const TRANSACTION_DETAIL_FIELDS = {
  TITLE: 'title',
  TRANSACTION_TIME: 'transactionTime',
  TRACKING_ID: 'trackingId',
  TYPE: 'transactionType',
  STATUS: 'status',
  PATRON_NAME: 'patronName',
  PICKUP_LOCATION: 'pickupLocation',
  REQUEST: 'request',
  LOAN: 'loan',
  PATRON_ID: 'patronId',
  PATRON_TYPE: 'patronType',
  PATRON_AGENCY: 'patronAgency',
  ITEM_ID: 'itemId',
  ITEM_TITLE: 'itemTitle',
  CENTRAL_ITEM_TYPE: 'centralItemType',
  AUTHOR: 'author',
  CALL_NO: 'callNo',
  ITEM_AGENCY: 'itemAgency',
  METADATA: 'metadata',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
};
