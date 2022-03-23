export const REPORT_FIELDS = {
  ITEM_TITLE: 'itemTitle',
  ITEM_BARCODE: 'itemBarcode',
  ITEM_CALL_NUMBER: 'itemCallNumber',
  ITEM_LOCATION: 'itemLocation',
  REQUESTING_PATRON_ID: 'requestingPatronId',
  PATRON_HOME_LIBRARY: 'patronHomeLibrary',
  DATE_RETURNED: 'dateReturned',
  PATRON_AGENCY: 'patronAgency',
  PATRON_ID_FIELD: 'patronIdField',
  DATE_REQUESTED: 'dateRequested',
  EFFECTIVE_LOCATION: 'effectiveLocation',
  LOAN_DUE_DATE: 'loanDueDate',
  ITEM_HRID: 'itemHRID',
  PAGED_DATE: 'pagedDate',
  REQUESTING_PATRON_AGENCY: 'requestingPatronAgency',
};

const {
  ITEM_TITLE,
  ITEM_BARCODE,
  ITEM_CALL_NUMBER,
  ITEM_LOCATION,
  REQUESTING_PATRON_ID,
  PATRON_HOME_LIBRARY,
  DATE_RETURNED,
  PATRON_AGENCY,
  PATRON_ID_FIELD,
  DATE_REQUESTED,
  EFFECTIVE_LOCATION,
  LOAN_DUE_DATE,
  ITEM_HRID,
  PAGED_DATE,
  REQUESTING_PATRON_AGENCY,
} = REPORT_FIELDS;

export const REPORT_TYPES = {
  OVERDUE: 'overdue',
  REQUESTED_TOO_LONG: 'requestedTooLong',
  RETURNED_TOO_LONG: 'returnedTooLong',
  PAGED_TOO_LONG: 'pagedTooLong',
};

export const REPORT_MODALS = {
  SHOW_RETURNED_TOO_LONG_REPORT_MODAL: 'showReturnedTooLongReportModal',
  SHOW_REQUESTED_TOO_LONG_REPORT_MODAL: 'showRequestedTooLongReportModal',
  SHOW_OVERDUE_REPORT_MODAL: 'showOverdueReportModal',
  SHOW_PAGED_TOO_LONG_REPORT_MODAL: 'showPagedTooLongReportModal',
};

export const FIELDS_OF_REPORT_MODALS = {
  MINIMUM_DAYS_OVERDUE: 'minDaysOverdue',
  MINIMUM_DAYS_REQUESTED: 'minDaysRequested',
  MINIMUM_DAYS_RETURNED: 'minDaysReturned',
  MINIMUM_DAYS_PAGED: 'minDaysPaged',
};

export const COLUMN_NAMES_FOR_OVERDUE_REPORT = [
  PATRON_ID_FIELD,
  EFFECTIVE_LOCATION,
  ITEM_CALL_NUMBER,
  ITEM_BARCODE,
  ITEM_TITLE,
  PATRON_AGENCY,
  LOAN_DUE_DATE,
];

export const COLUMN_NAMES_FOR_REQUESTED_TOO_LONG_REPORT = [
  ITEM_LOCATION,
  ITEM_CALL_NUMBER,
  ITEM_BARCODE,
  ITEM_TITLE,
  PATRON_AGENCY,
  PATRON_ID_FIELD,
  DATE_REQUESTED,
];

export const COLUMN_NAMES_FOR_RETURNED_TOO_LONG_REPORT = [
  ITEM_LOCATION,
  ITEM_CALL_NUMBER,
  ITEM_BARCODE,
  ITEM_TITLE,
  PATRON_HOME_LIBRARY,
  REQUESTING_PATRON_ID,
  DATE_RETURNED,
];

export const COLUMN_NAMES_FOR_PAGED_TOO_LONG_REPORT = [
  ITEM_HRID,
  EFFECTIVE_LOCATION,
  ITEM_CALL_NUMBER,
  ITEM_BARCODE,
  ITEM_TITLE,
  REQUESTING_PATRON_AGENCY,
  PAGED_DATE,
];
