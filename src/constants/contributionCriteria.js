import { SETTINGS_PATH } from './base';

export const RECORD_CONTRIBUTION = 'recordContribution';
export const CONTRIBUTION_CRITERIA_ROUTE = 'contribution-criteria';
export const CONTRIBUTION_CRITERIA_PATH = `/${SETTINGS_PATH}/${CONTRIBUTION_CRITERIA_ROUTE}`;

export const CONTRIBUTION_CRITERIA = {
  CENTRAL_SERVER_ID: 'centralServerId',
  LOCATIONS_IDS: 'locationIds',
  CONTRIBUTE_BUT_SUPPRESS_ID: 'contributeButSuppressId',
  DO_NOT_CONTRIBUTE_ID: 'doNotContributeId',
  CONTRIBUTE_AS_SYSTEM_OWNED_ID: 'contributeAsSystemOwnedId',
};
