import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  NO_VALUE_LOCATION_OPTION,
} from '../../../../constants';
import {
  required,
} from '../../../../utils';

const {
  INN_REACH_LOCATIONS,
  TABULAR_LIST,
  FOLIO_LIBRARY,
  FOLIO_LOCATION,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

export const getInnReachLocationOptions = (innReachLocations) => {
  return innReachLocations.reduce((accum, { id, code }) => {
    const option = {
      id,
      value: code,
      label: code,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCATION_OPTION]);
};

export const validate = (value, allValues) => {
  const tabularList = allValues[TABULAR_LIST];
  const leftColName = tabularList[0][FOLIO_LIBRARY]
    ? FOLIO_LIBRARY
    : FOLIO_LOCATION;

  if (leftColName === FOLIO_LIBRARY) {
    return required(value);
  } else {
    const isSomeFieldFilledIn = tabularList.some(row => row[INN_REACH_LOCATIONS]);

    return required(value || isSomeFieldFilledIn);
  }
};
