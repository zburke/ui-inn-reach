export const MANAGE_CONTRIBUTION_ROUTE = 'manage-contribution';

export const MANAGE_CONTRIBUTION_HISTORY_METADATA = {
  UPDATED_DATE: 'updatedDate',
};

export const MANAGE_CONTRIBUTION_FIELDS = {
  ID: 'id',
  STATUS: 'status',
  ITEM_TYPE_MAPPING_STATUS: 'itemTypeMappingStatus',
  LOCATIONS_MAPPING_STATUS: 'locationsMappingStatus',
  CONTRIBUTION_STARTED: 'contributionStarted',
  CONTRIBUTION_STARTED_BY: 'contributionStartedBy',
  CONTRIBUTION_PAUSED: 'contributionPaused',
  CONTRIBUTION_PAUSED_BY: 'contributionPausedBy',
  CONTRIBUTION_RESUMED: 'contributionResumed',
  CONTRIBUTION_RESUMED_BY: 'contributionResumedBy',
  CONTRIBUTION_CANCELLED: 'contributionCancelled',
  CONTRIBUTION_CANCELLED_BY: 'contributionCancelledBy',
  CONTRIBUTION_COMPLETE: 'contributionComplete',
  TOTAL_FOLIO_INSTANCE_RECORDS: 'recordsTotal',
  RECORDS_EVALUATED: 'recordsProcessed',
  CONTRIBUTED: 'recordsContributed',
  UPDATED: 'recordsUpdated',
  DE_CONTRIBUTED: 'recordsDecontributed',
  ERRORS: 'errors',
  METADATA: 'metadata',
};

export const CONTRIBUTION_STATUSES = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In Progress',
  PAUSED: 'Paused',
  COMPLETE: 'Complete',
  CANCELLED: 'Cancelled',
};

export const CONTRIBUTION_STATUS_LABELS = {
  [CONTRIBUTION_STATUSES.NOT_STARTED]: 'ui-inn-reach.settings.manage-contribution.contribution-status.not-started',
  [CONTRIBUTION_STATUSES.IN_PROGRESS]: 'ui-inn-reach.settings.manage-contribution.contribution-status.in-progress',
  [CONTRIBUTION_STATUSES.PAUSED]: 'ui-inn-reach.settings.manage-contribution.contribution-status.paused',
  [CONTRIBUTION_STATUSES.COMPLETE]: 'ui-inn-reach.settings.manage-contribution.contribution-status.complete',
  [CONTRIBUTION_STATUSES.CANCELLED]: 'ui-inn-reach.settings.manage-contribution.contribution-status.cancelled',
};

export const ITEM_TYPE_MAPPING_STATUSES = {
  VALID: 'Valid',
  INVALID: 'Invalid',
};

export const ITEM_TYPE_MAPPING_STATUS_LABELS = {
  [ITEM_TYPE_MAPPING_STATUSES.VALID]: 'ui-inn-reach.settings.manage-contribution.item-mapping-type-status.valid',
  [ITEM_TYPE_MAPPING_STATUSES.INVALID]: 'ui-inn-reach.settings.manage-contribution.item-mapping-type-status.invalid',
};

export const LOCATIONS_MAPPING_STATUSES = {
  VALID: 'Valid',
  INVALID: 'Invalid',
};

export const LOCATIONS_MAPPING_STATUS_LABELS = {
  [LOCATIONS_MAPPING_STATUSES.VALID]: 'ui-inn-reach.settings.manage-contribution.location-mapping-status.valid',
  [LOCATIONS_MAPPING_STATUSES.INVALID]: 'ui-inn-reach.settings.manage-contribution.location-mapping-status.invalid',
};
