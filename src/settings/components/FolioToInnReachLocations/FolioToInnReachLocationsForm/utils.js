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
      value: id,
      label: code,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCATION_OPTION]);
};

const getFetchedLocationsToExcludeSet = (pickedLocationsByAgencyCodeMap, curAgencyCode) => {
  const fetchedLocationsToExcludeSet = new Set();

  pickedLocationsByAgencyCodeMap.forEach((locationsSet, key) => {
    if (key !== curAgencyCode) {
      locationsSet.forEach(location => {
        fetchedLocationsToExcludeSet.add(location);
      });
    }
  });

  return fetchedLocationsToExcludeSet;
};

export const getUniqueLocationsForEachTable = ({
  innReachLocationOptions,
  values,
  currentTableIndex,
  pickedLocationsByAgencyCodeMap,
  curAgencyCode,
}) => {
  const fetchedLocationsToExcludeSet = getFetchedLocationsToExcludeSet(pickedLocationsByAgencyCodeMap, curAgencyCode);
  const excludeCurTable = (_, key) => !key.endsWith(currentTableIndex);
  const selectedLocationsOfOtherTablesOfLibrariesLevel = filter(values, excludeCurTable)
    .flat()
    .filter(row => row[INN_REACH_LOCATIONS])
    .map(row => row[INN_REACH_LOCATIONS]);

  const selectedLocationsOfOtherTablesOfLibrariesLevelSet = new Set(selectedLocationsOfOtherTablesOfLibrariesLevel);

  const excludeSelectedLocations = ({ value: locationId }) => {
    return !(
      selectedLocationsOfOtherTablesOfLibrariesLevelSet.has(locationId) ||
      fetchedLocationsToExcludeSet.has(locationId)
    );
  };

  return innReachLocationOptions.filter(excludeSelectedLocations);
};

export const getInnReachLocationsForLocationsMappingType = ({
  innReachLocationOptions,
  pickedLocationsByAgencyCodeMap,
  curAgencyCode,
}) => {
  const fetchedLocationsToExcludeSet = getFetchedLocationsToExcludeSet(pickedLocationsByAgencyCodeMap, curAgencyCode);
  const excludeSelectedLocations = ({ value: locationId }) => !fetchedLocationsToExcludeSet.has(locationId);

  return innReachLocationOptions.filter(excludeSelectedLocations);
};
