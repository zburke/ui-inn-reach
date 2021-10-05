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
