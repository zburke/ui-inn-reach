import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
  FOLIO_CIRCULATION_USER_FIELDS,
} from '../../../../../../constants';

const {
  CENTRAL_PATRON_TYPE_MAPPINGS,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

export const validateBarcode = (invalid, existingBarcodesSet) => (value, allValues) => {
  const isAllFieldsFilledIn = allValues[CENTRAL_PATRON_TYPE_MAPPINGS].every(field => field[BARCODE]);

  if (isAllFieldsFilledIn && !existingBarcodesSet.has(value)) {
    return <FormattedMessage id="ui-inn-reach.not-valid" />;
  }

  return undefined;
};
