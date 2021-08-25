import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NO_VALUE_OPTION_VALUE } from './base';

export const CENTRAL_ITEM_TYPE_ROUTE = 'central-patron-type';

export const CENTRAL_ITEM_TYPE_FIELDS = {
  ID: 'id',
  ITEM_TYPE_MAPPINGS: 'itemTypeMappings',
  ITEM_TYPE: 'itemType',
  ITEM_TYPE_LABEL: 'itemTypeLabel',
  MATERIAL_TYPE_ID: 'materialTypeId',
};

export const ITEM_TYPE_NO_VALUE_OPTION = {
  label: <FormattedMessage id="ui-inn-reach.settings.central-item-type.placeholder.material-type" />,
  value: NO_VALUE_OPTION_VALUE,
};
