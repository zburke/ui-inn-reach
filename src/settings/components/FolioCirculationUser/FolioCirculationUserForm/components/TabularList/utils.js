import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
  isEqual,
} from 'lodash';
import {
  FOLIO_CIRCULATION_USER_FIELDS,
} from '../../../../../../constants';

const {
  CENTRAL_PATRON_TYPE_MAPPINGS,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

const simpleMemoize = (fn) => {
  let lastAllValues;
  let lastResult;

  return (barcodesFromTable, parentMutator, allValues) => {
    if (!isEqual(allValues, lastAllValues)) {
      lastAllValues = allValues;
      lastResult = fn(barcodesFromTable, parentMutator, allValues);
    }

    return lastResult;
  };
};

const fetchUsersByBarcode = simpleMemoize(async (barcodesFromTable, parentMutator) => {
  const { users } = await parentMutator.users.GET({
    params: {
      query: barcodesFromTable
        .map(barcode => `barcode==${barcode}`)
        .join(' or '),
    },
  });

  return users;
});

export const validateBarcode = async (value, allValues, parentMutator) => {
  const barcodesFromTable = allValues[CENTRAL_PATRON_TYPE_MAPPINGS].map(field => field[BARCODE]);
  const users = await fetchUsersByBarcode(barcodesFromTable, parentMutator, allValues);
  const isBarcodeExist = users.some(user => user.barcode === value);

  return isBarcodeExist
    ? undefined
    : <FormattedMessage id="ui-inn-reach.not-valid" />;
};
