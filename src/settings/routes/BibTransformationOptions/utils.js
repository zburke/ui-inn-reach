import {
  isEmpty,
  omit,
} from 'lodash';
import {
  BIB_TRANSFORMATION_FIELDS,
} from '../../../constants';

const {
  CONFIG_IS_ACTIVE,
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  STRIP_PREFIX,
  IGNORE_PREFIXES,
  EXCLUDED_MARC_FIELDS,
} = BIB_TRANSFORMATION_FIELDS;

const formatTabularList = (tabularListValues) => {
  return tabularListValues.map(row => ({
    ...row,
    [IGNORE_PREFIXES]: row[IGNORE_PREFIXES].join(', '),
  }));
};

export const formatMARCTransformations = (response) => {
  const formattedData = omit(response, [EXCLUDED_MARC_FIELDS], [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]);

  if (!isEmpty(response[EXCLUDED_MARC_FIELDS])) {
    formattedData[EXCLUDED_MARC_FIELDS] = response[EXCLUDED_MARC_FIELDS].join(', ');
  }

  formattedData[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS] = formatTabularList(response[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]);

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

export const formatPayload = (record) => {
  const payload = {
    [CONFIG_IS_ACTIVE]: true,
    [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: getFinalTabularListValues(record[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]),
    [EXCLUDED_MARC_FIELDS]: [],
  };

  if (record[EXCLUDED_MARC_FIELDS]) {
    payload[EXCLUDED_MARC_FIELDS] = separateWithComma(record[EXCLUDED_MARC_FIELDS]);
  }

  return payload;
};
