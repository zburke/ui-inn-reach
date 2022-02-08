import {
  filter,
} from 'lodash';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  NO_VALUE_LOCATION_OPTION,
} from '../../../../constants';
import {
  required,
} from '../../../../utils';

const {
  INN_REACH_LOCATIONS,
  LIBRARIES_TABULAR_LIST,
  LOCATIONS_TABULAR_LIST,
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

export const validate = (value, allValues, index) => {
  const tabularList = allValues[LOCATIONS_TABULAR_LIST] || allValues[`${LIBRARIES_TABULAR_LIST}${index}`];
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

export const getUniqueLocationsForEachTable = (innReachLocationOptions, values, currentTableIndex) => {
  const excludeCurTable = (_, key) => !key.endsWith(currentTableIndex);
  const selectedLocationsOfOtherTables = filter(values, excludeCurTable)
    .flat()
    .filter(row => row[INN_REACH_LOCATIONS])
    .map(row => row[INN_REACH_LOCATIONS]);
  const excludeSelectedLocations = ({ value: location }) => !selectedLocationsOfOtherTables.includes(location);

  return innReachLocationOptions.filter(excludeSelectedLocations);
};

export const getLocationsForEachTableRow = (fields, index, dataOptions) => {
  const filterCurRow = (_, i) => i !== index;
  const rowNotSelected = (item) => !item[INN_REACH_LOCATIONS];
  const onlyCurRowSelected = fields.value
    .filter(filterCurRow)
    .every(rowNotSelected);

  const selectedLocation = fields.value.find(row => row[INN_REACH_LOCATIONS])?.[INN_REACH_LOCATIONS];
  const alreadySelectedOption = dataOptions.find(({ value: location }) => location === selectedLocation);
  const emptyOption = dataOptions[0];

  return onlyCurRowSelected
    ? dataOptions
    : [emptyOption, alreadySelectedOption];
};
