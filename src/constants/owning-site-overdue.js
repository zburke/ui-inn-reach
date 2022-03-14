import {
  HOLD_FIELDS,
  INVENTORY_ITEM_FIELDS,
  TRANSACTION_FIELDS,
} from './transactions';

const {
  PATRON_ID,
  CALL_NUMBER,
  FOLIO_ITEM_BARCODE,
  TITLE,
  PATRON_AGENCY_CODE,
  DUE_DATE_TIME,
} = HOLD_FIELDS;

const {
  EFFECTIVE_LOCATION,
} = INVENTORY_ITEM_FIELDS;

const {
  HOLD,
} = TRANSACTION_FIELDS;

export const OVERDUE = 'overdue';

export const OVERDUE_COLUMNS_FOR_CSV = [
  `${HOLD}.${PATRON_ID}`,
  EFFECTIVE_LOCATION,
  CALL_NUMBER,
  `${HOLD}.${FOLIO_ITEM_BARCODE}`,
  `${HOLD}.${TITLE}`,
  PATRON_AGENCY_CODE,
  `${HOLD}.${DUE_DATE_TIME}`,
];

export const OWNING_SITE_OVERDUE_FIELDS = {
  MINIMUM_DAYS_OVERDUE: 'minDaysOverdue',
};
