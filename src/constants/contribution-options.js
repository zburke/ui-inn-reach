export const CONTRIBUTION_OPTIONS = 'Record contribution';
export const CONTRIBUTION_OPTIONS_ROUTE = 'item-contribution-options';

export const CONTRIBUTION_OPTIONS_FIELDS = {
  CENTRAL_SERVER_ID: 'centralServerId',
  STATUSES: 'notAvailableItemStatuses',
  LOAN_TYPE_IDS: 'nonLendableLoanTypes',
  LOCATION_IDS: 'nonLendableLocations',
  MATERIAL_TYPE_IDS: 'nonLendableMaterialTypes',
  METADATA: 'metadata',
};

export const STATUSES_LIST = {
  AWAITING_DELIVERY: 'Awaiting delivery',
  CLAIMED_RETURNED: 'Claimed returned',
  LOST_AND_PAID: 'Lost and paid',
  LONG_MISSING: 'Long missing',
  MISSING: 'Missing',
  IN_PROCESS: 'In process',
  IN_PROCESS_NON_REQUASTABLE: 'In process (non-requestable)',
  INTELLECTUAL_ITEM: 'Intellectual item',
  ON_ORDER: 'On order',
  ORDER_CLOSED: 'Order closed',
  RESTRICTED: 'Restricted',
  UNAVAILIBLE: 'Unavailable',
  UNKNOWN: 'Unknown',
};

export const STATUSES_LIST_OPTIONS = [
  { label: 'ui-inn-reach.settings.contribution-options.status.awaiting-delivery', value: STATUSES_LIST.AWAITING_DELIVERY },
  { label: 'ui-inn-reach.settings.contribution-options.status.claimed-returned', value: 'Claimed returned' },
  { label: 'ui-inn-reach.settings.contribution-options.status.lost-and-paid', value: 'Lost and paid' },
  { label: 'ui-inn-reach.settings.contribution-options.status.long-missing', value: 'Long missing' },
  { label: 'ui-inn-reach.settings.contribution-options.status.missing', value: 'Missing' },
  { label: 'ui-inn-reach.settings.contribution-options.status.in-process', value: 'In process' },
  { label: 'ui-inn-reach.settings.contribution-options.status.in-process-non-requestable', value: 'In process (non-requestable)' },
  { label: 'ui-inn-reach.settings.contribution-options.status.intellectual-item', value: 'Intellectual item' },
  { label: 'ui-inn-reach.settings.contribution-options.status.on-order', value: 'On order' },
  { label: 'ui-inn-reach.settings.contribution-options.status.order-closed', value: 'Order closed' },
  { label: 'ui-inn-reach.settings.contribution-options.status.restricted', value: 'Restricted' },
  { label: 'ui-inn-reach.settings.contribution-options.status.unavailable', value: 'Unavailable' },
  { label: 'ui-inn-reach.settings.contribution-options.status.unknown', value: 'Unknown' },
];
