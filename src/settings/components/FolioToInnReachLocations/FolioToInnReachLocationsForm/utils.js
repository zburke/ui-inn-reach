import {
  filter,
} from 'lodash';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  NO_VALUE_LOCATION_OPTION,
} from '../../../../constants';

const {
  INN_REACH_LOCATIONS,
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

export const getUniqueLocationsForEachTable = (innReachLocationOptions, values, currentTableIndex) => {
  const excludeCurTable = (_, key) => !key.endsWith(currentTableIndex);
  const selectedLocationsOfOtherTables = filter(values, excludeCurTable)
    .flat()
    .filter(row => row[INN_REACH_LOCATIONS])
    .map(row => row[INN_REACH_LOCATIONS]);
  const excludeSelectedLocations = ({ value: location }) => !selectedLocationsOfOtherTables.includes(location);

  return innReachLocationOptions.filter(excludeSelectedLocations);
};
