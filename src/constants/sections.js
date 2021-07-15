import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CentralServersConfigurationRoute,
  InnreachLocations,
  ContributionCriteriaRoute,
  FolioToInnReachLocationsRoute,
  AgencyToFolioLocationsRoute,
} from '../settings/routes';
import {
  CONTRIBUTION_CRITERIA_ROUTE,
  RECORD_CONTRIBUTION,
} from './contribution-criteria';
import {
  FOLIO_TO_INN_REACH_LOCATIONS_ROUTE,
} from './folio-to-innreach-locations';
import {
  AGENCY_TO_FOLIO_LOCATIONS_ROUTE,
  CIRCULATION_MAPPINGS,
} from './agency-to-folio-locations';

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
  },
  {
    id: CIRCULATION_MAPPINGS,
    label: <FormattedMessage id="ui-inn-reach.settings.circulation-mappings" />,
    pages: [
      {
        route: AGENCY_TO_FOLIO_LOCATIONS_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations" />,
        component: AgencyToFolioLocationsRoute,
      },
    ],
  },
];
