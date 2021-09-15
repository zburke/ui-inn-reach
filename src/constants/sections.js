import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CentralServersConfigurationRoute,
  InnreachLocations,
  ContributionCriteriaRoute,
  MaterialTypeRoute,
  FolioToInnReachLocationsRoute,
  ContributionOptionsRoute,
  AgencyToFolioLocationsRoute,
  ManageContributionRoute,
  BibTransformationOptionsRoute,
  CentralPatronTypeRoute,
  CentralItemTypeRoute,
  PatronAgencyRoute,
} from '../settings/routes';
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
import {
  AGENCY_TO_FOLIO_LOCATIONS_ROUTE,
  CIRCULATION_MAPPINGS,
} from './agency-to-folio-locations';
import {
  MANAGE_CONTRIBUTION_ROUTE,
} from './manage-contribution';
import {
  BIB_TRANSFORMATION_ROUTE,
} from './bib-transformation-options';
import {
  CENTRAL_PATRON_TYPE_ROUTE,
} from './central-patron-type';
import {
  CENTRAL_ITEM_TYPE_ROUTE,
} from './central-item-type';
import {
  PATRON_AGENCY_ROUTE,
} from './patron-agency';

export const sections = [
  {
    label: 'ui-inn-reach.settings.general',
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
    label: 'ui-inn-reach.settings.record-contribution',
    pages: [
      {
        route: CONTRIBUTION_CRITERIA_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.contribution-criteria" />,
        component: ContributionCriteriaRoute,
      },
      {
        route: MATERIAL_TYPE_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.material-type-mapping" />,
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
      {
        route: BIB_TRANSFORMATION_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.bib-transformation" />,
        component: BibTransformationOptionsRoute,
      },
      {
        route: MANAGE_CONTRIBUTION_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.title" />,
        component: ManageContributionRoute,
      },
    ],
  },
  {
    id: CIRCULATION_MAPPINGS,
    label: 'ui-inn-reach.settings.circulation-mappings',
    pages: [
      {
        route: AGENCY_TO_FOLIO_LOCATIONS_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations" />,
        component: AgencyToFolioLocationsRoute,
      },
      {
        route: CENTRAL_ITEM_TYPE_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.central-item-type" />,
        component: CentralItemTypeRoute,
      },
      {
        route: CENTRAL_PATRON_TYPE_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.central-patron-type" />,
        component: CentralPatronTypeRoute,
      },
      {
        route: PATRON_AGENCY_ROUTE,
        label: <FormattedMessage id="ui-inn-reach.settings.patron-agency" />,
        component: PatronAgencyRoute,
      },
    ],
  },
];
