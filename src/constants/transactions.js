export const TRANSACTION_STATUS = {
  PATRON_HOLD: 'PATRON_HOLD',
  ITEM_RECEIVED: 'ITEM_RECEIVED',
};

export const TRANSACTION_FIELDS = {
  ID: 'id',
  TIME: 'time',
  TYPE: 'type',
  ITEM_TITLE: 'itemTitle',
  PATRON_NAME: 'patronName',
  STATUS: 'status',
};

export const TRANSACTION_LIST_DEFAULT_SORT_FIELD = TRANSACTION_FIELDS.TIME;

export const RESULT_COUNT_INCREMENT = 100;




export const TRANSACTION_TYPES = {
  ITEM: 'item',
  PATRON: 'patron',
  LOCAL: 'local',
};
