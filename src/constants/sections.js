import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CentralServersConfigurationRoute,
  InnreachLocations,
  ContributionCriteriaRoute,
  FolioToInnReachLocationsRoute,
} from '../settings/routes';
import {
  CONTRIBUTION_CRITERIA_ROUTE,
  FOLIO_TO_INN_REACH_LOCATIONS_ROUTE,
  RECORD_CONTRIBUTION,
} from '../constants';

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
        route: FOLIO_TO_INN_REACH_LOCATIONS_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations" />,
        component: FolioToInnReachLocationsRoute,
      },
    ],
  }
];
