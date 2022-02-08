import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  NO_VALUE_OPTION_VALUE,
} from './base';

export const FOLIO_TO_INN_REACH_LOCATIONS_ROUTE = 'folio-to-inn-reach-locations';

export const FOLIO_TO_INN_REACH_LOCATION_FIELDS = {
  LIBRARIES_TABULAR_LIST: 'librariesTabularList',
  LOCATIONS_TABULAR_LIST: 'locationsTabularList',
  LEFT_COLUMN: 'leftColumn',
  MAPPING_TYPE: 'mappingType',
  LIBRARY: 'library',
  LIBRARIES: 'libraries',
  LOCATIONS: 'locations',
  INN_REACH_LOCATIONS: 'innReachLocations',
  FOLIO_LIBRARY: 'folioLibrary',
  FOLIO_LOCATION: 'folioLocation',
  CODE: 'code',
};

export const NO_VALUE_LOCATION_OPTION = {
  id: NO_VALUE_OPTION_VALUE,
  label: <FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-location" />,
  value: NO_VALUE_OPTION_VALUE,
};

export const NO_VALUE_LIBRARY_OPTION = {
  id: NO_VALUE_OPTION_VALUE,
  label: <FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.placeholder.select-library" />,
  value: NO_VALUE_OPTION_VALUE,
};
