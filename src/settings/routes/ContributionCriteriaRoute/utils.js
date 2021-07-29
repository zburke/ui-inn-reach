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
  const initialValues = { ...DEFAULT_VALUES };

  forEach(contributionCriteria, (value, key) => {
    if (key === LOCATIONS_IDS) {
      if (!isEmpty(value)) {
        initialValues[key] = getLocations(value, folioLocations);
      }
    } else if (value) {
      initialValues[key] = value;
    }
  });

  return initialValues;
};

export const getFinalRecord = (record) => {
  const finalRecord = omit(record, LOCATIONS_IDS, METADATA);
  const folioLocations = record[LOCATIONS_IDS];

  if (!isEmpty(folioLocations)) {
    finalRecord[LOCATIONS_IDS] = folioLocations.map(({ value }) => value);
  }

  return finalRecord;
};
