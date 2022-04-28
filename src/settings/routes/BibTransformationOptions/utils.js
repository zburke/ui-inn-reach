import {
  isEmpty,
} from 'lodash';
import {
  BIB_TRANSFORMATION_FIELDS,
  NEW_ROW_VALUES,
} from '../../../constants';

const {
  ID,
  CONFIG_IS_ACTIVE,
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  STRIP_PREFIX,
  IGNORE_PREFIXES,
  EXCLUDED_MARC_FIELDS,
  RESOURCE_IDENTIFIER_TYPE_ID,
} = BIB_TRANSFORMATION_FIELDS;

const formatTabularList = (tabularListValues) => {
  return tabularListValues.map(row => ({
    ...row,
    [IGNORE_PREFIXES]: row[IGNORE_PREFIXES].join(', '),
  }));
};

export const formatMARCTransformations = (response) => {
  const formattedData = {
    ...response,
    [CONFIG_IS_ACTIVE]: false,
    [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [NEW_ROW_VALUES],
    [EXCLUDED_MARC_FIELDS]: '',
  };

  if (!isEmpty(response[EXCLUDED_MARC_FIELDS])) {
    formattedData[EXCLUDED_MARC_FIELDS] = response[EXCLUDED_MARC_FIELDS].join(', ');
  }

  if (!isEmpty(response[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS])) {
    formattedData[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS] = formatTabularList(response[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]);
    formattedData[CONFIG_IS_ACTIVE] = true;
  }

  return formattedData;
};

const separateWithComma = (prefixes) => {
  return prefixes
    .split(',')
    .map(prefix => prefix.trim())
    .filter(prefix => prefix);
};

const getFinalTabularListValues = (tabularListValues) => {
  return tabularListValues.map(row => {
    const rowValues = {
      ...row,
      [STRIP_PREFIX]: !!row[STRIP_PREFIX],
      [IGNORE_PREFIXES]: [],
    };

    if (row[IGNORE_PREFIXES]) {
      rowValues[IGNORE_PREFIXES] = separateWithComma(row[IGNORE_PREFIXES]);
    }

    return rowValues;
  });
};

export const formatPayload = (record, configIsActive) => {
  const payload = {
    [CONFIG_IS_ACTIVE]: configIsActive,
    [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [],
    [EXCLUDED_MARC_FIELDS]: [],
  };

  const isSomeIdentifierTypeSelected = record[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS].some(row => row[RESOURCE_IDENTIFIER_TYPE_ID]);

  if (record[ID]) {
    payload[ID] = record[ID];
  }

  if (isSomeIdentifierTypeSelected) {
    payload[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS] = getFinalTabularListValues(record[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]);
  }

  if (record[EXCLUDED_MARC_FIELDS]) {
    payload[EXCLUDED_MARC_FIELDS] = separateWithComma(record[EXCLUDED_MARC_FIELDS]);
  }

  return payload;
};
