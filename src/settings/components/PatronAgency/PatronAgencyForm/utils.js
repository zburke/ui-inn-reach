import {
  required,
} from '../../../../utils';
import {
  PATRON_AGENCY_FIELDS,
} from '../../../../constants';

const {
  USER_CUSTOM_FIELD_MAPPINGS,
  AGENCY_CODE,
} = PATRON_AGENCY_FIELDS;

export const validate = (value, allValues) => {
  const isSomeFieldFilledIn = allValues[USER_CUSTOM_FIELD_MAPPINGS].some(row => row[AGENCY_CODE]);

  return required(value || isSomeFieldFilledIn);
};
