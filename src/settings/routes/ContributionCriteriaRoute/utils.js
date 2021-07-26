import {
  forEach,
  isEmpty,
  omit,
} from 'lodash';
import {
  CONTRIBUTION_CRITERIA,
  METADATA,
} from '../../../constants';

const {
  LOCATIONS_IDS,
  CENTRAL_SERVER_ID,
} = CONTRIBUTION_CRITERIA;

export const DEFAULT_VALUES = {
  [LOCATIONS_IDS]: [],
};

const getLocations = (locationIds, folioLocations) => {
  return locationIds.map(id => ({
    value: id,
    label: folioLocations.find(location => location.id === id)?.name,
  }));
};

export const getInitialValues = (contributionCriteria, folioLocations) => {
  const locationIds = contributionCriteria[LOCATIONS_IDS];
  const initialValues = {
    ...DEFAULT_VALUES,
    ...omit(contributionCriteria, LOCATIONS_IDS, CENTRAL_SERVER_ID),
  };

  if (locationIds) {
    initialValues[LOCATIONS_IDS] = getLocations(locationIds, folioLocations);
  }

  return initialValues;
};

export const getFinalRecord = (record) => {
  const finalRecord = {};
  const folioLocations = record[LOCATIONS_IDS];

  forEach(record, (value, key) => {
    if (key === LOCATIONS_IDS) {
      if (!isEmpty(folioLocations)) {
        finalRecord[LOCATIONS_IDS] = folioLocations.map(({ val }) => val);
      }
    } else if (key !== METADATA && value) {
      finalRecord[key] = value;
    }
  });

  return finalRecord;
};
