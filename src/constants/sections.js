import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CentralServersConfigurationRoute,
  InnreachLocations,
  ContributionCriteriaRoute,
  MaterialTypeRoute,
  FolioToInnReachLocationsRoute,
  ContributionOptionsRoute,
} from '../../routes';
import {
  MATERIAL_TYPE_ROUTE,
} from './material-type';
import {
  CONTRIBUTION_CRITERIA_ROUTE,
  RECORD_CONTRIBUTION,
} from './contribution-criteria';
import {
  FOLIO_TO_INN_REACH_LOCATIONS_ROUTE,
} from './folio-to-innreach-locations';
import {
  CONTRIBUTION_OPTIONS_ROUTE,
} from './contribution-options';

export const sections = [
  {
    label: <FormattedMessage id="ui-inn-reach.settings.general" />,
    pages: [
      {
        route: 'central-server-configurations',
        label: <FormattedMessage id="ui-inn-reach.settings.central-server.configuration" />,
        component: CentralServersConfigurationRoute,
      },
      {
        route: 'locations',
        label: <FormattedMessage id="ui-inn-reach.settings.central-server.locations" />,
        component: InnreachLocations,
      },
    ],
  },
  {
    id: RECORD_CONTRIBUTION,
    label: <FormattedMessage id="ui-inn-reach.settings.record-contribution" />,
    pages: [
      {
        route: CONTRIBUTION_CRITERIA_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.contribution-criteria" />,
        component: ContributionCriteriaRoute,
      },
      {
        route: MATERIAL_TYPE_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.material-type-mappings" />,
        component: MaterialTypeRoute,
      },
      {
        route: FOLIO_TO_INN_REACH_LOCATIONS_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations" />,
        component: FolioToInnReachLocationsRoute,
      },
      {
        route: CONTRIBUTION_OPTIONS_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.contribution-options" />,
        component: ContributionOptionsRoute,
      },
    ],
  }
];
