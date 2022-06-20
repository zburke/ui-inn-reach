export const PAGING_SLIP_TEMPLATE_ROUTE = 'paging-slip-template';

export const PAGING_SLIP_TEMPLATE_FIELDS = {
  DESCRIPTION: 'description',
  TEMPLATE: 'template',
};

export const PAGING_SLIP_INITIAL_VALUES = {
  [PAGING_SLIP_TEMPLATE_FIELDS.DESCRIPTION]: '',
  [PAGING_SLIP_TEMPLATE_FIELDS.TEMPLATE]: '<div><br></div>',
};

export const TOKEN_NAMES = {
  INN_REACH_PATRON: 'innReachPatron',
  INN_REACH_SERVER: 'innReachServer',
  INN_REACH_AGENCY: 'innReachAgency',
  INN_REACH_PICKUP_LOCATIONS: 'innReachPickupLocation',
  ITEM: 'item',
  EFFECTIVE_LOCATION: 'effectiveLocation',
  STAFF_SLIP: 'staffSlip',
};
