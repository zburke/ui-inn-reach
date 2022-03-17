import {
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
} from './transactions';
import {
  METADATA_FIELDS,
} from './base';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  ITEM_AGENCY_CODE,
  CALL_NUMBER,
  FOLIO_ITEM_BARCODE,
  TITLE,
  PATRON_AGENCY_CODE,
  PATRON_ID,
} = HOLD_FIELDS;

const {
  CREATED_DATE,
} = METADATA_FIELDS;

export const REQUESTED_TOO_LONG = 'requestedTooLong';
export const SHOW_REQUESTED_TOO_LONG_REPORT_MODAL = 'showRequestedTooLongReportModal';

export const REQUESTED_TOO_LONG_COLUMNS_FOR_CSV = [
  ITEM_AGENCY_CODE,
  CALL_NUMBER,
  `${HOLD}.${FOLIO_ITEM_BARCODE}`,
  `${HOLD}.${TITLE}`,
  PATRON_AGENCY_CODE,
  `${HOLD}.${PATRON_ID}`,
  CREATED_DATE,
];

export const REQUESTED_TOO_LONG_FIELDS = {
  MINIMUM_DAYS_REQUESTED: 'minDaysRequested',
};
