import {
  filter,
} from 'lodash';
import {
  NO_VALUE_LOCATION_OPTION,
} from '../../../../constants';

export const getInnReachLocationOptions = (innReachLocations) => {
  return innReachLocations.reduce((accum, { id, code }) => {
    const option = {
      value: id,
      label: code,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCATION_OPTION]);
};

export const getUniqueLocations = ({
  innReachLocationOptions,
  pickedLocationsByAgencyCode,
  curLocalAgencyCode,
}) => {
  const selectedLocationsOfOtherTables = filter(pickedLocationsByAgencyCode, (_, localAgencyCode) => {
    return localAgencyCode !== curLocalAgencyCode;
  }).flat();
  const selectedLocationsOfOtherTablesSet = new Set(selectedLocationsOfOtherTables);
  const excludeSelectedLocations = ({ value: locationId }) => !selectedLocationsOfOtherTablesSet.has(locationId);

  return innReachLocationOptions.filter(excludeSelectedLocations);
};
