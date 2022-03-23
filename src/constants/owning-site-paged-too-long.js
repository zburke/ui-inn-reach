export const PAGED_TOO_LONG = 'pagedTooLong';
export const SHOW_PAGED_TOO_LONG_REPORT_MODAL = 'showPagedTooLongReportModal';

export const PAGED_TOO_LONG_FIELDS = {
  MINIMUM_DAYS_PAGED: 'minDaysPaged',
};

export const PAGED_TOO_LONG_COLUMN_TRANSLATIONS = {
  PAGED_ITEM_HRID: 'paged.itemId',
  PAGED_EFFECTIVE_LOCATION: 'paged.effectiveLocation',
  PAGED_CALL_NUMBER: 'paged.callNumber',
  PAGED_BARCODE: 'paged.barcode',
  PAGED_TITLE: 'paged.title',
  PAGED_PATRON_AGENCY_CODE: 'paged.requestingPatronAgencyCode',
  PAGED_DATE: 'paged.date',
};

export const PAGED_TOO_LONG_COLUMNS_FOR_CSV = [
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_ITEM_HRID,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_EFFECTIVE_LOCATION,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_CALL_NUMBER,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_BARCODE,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_TITLE,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_PATRON_AGENCY_CODE,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS.PAGED_DATE,
];
