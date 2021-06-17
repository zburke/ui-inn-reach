import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CentralServersConfigurationRoute,
  InnreachLocations,
  ContributionCriteriaRoute,
} from '../settings/routes';
import {
  CONTRIBUTION_CRITERIA_ROUTE,
  RECORD_CONTRIBUTION,
} from './index';

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
    ],
  }
];
