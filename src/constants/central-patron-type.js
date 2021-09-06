import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NO_VALUE_OPTION_VALUE } from './base';

export const CENTRAL_PATRON_TYPE_ROUTE = 'central-patron-type';

export const CENTRAL_PATRON_TYPE_FIELDS = {
  ID: 'id',
  PATRON_TYPE_MAPPINGS: 'patronTypeMappings',
  PATRON_GROUP_ID: 'patronGroupId',
  PATRON_GROUP_LABEL: 'patronGroupLabel',
  PATRON_TYPE: 'patronType',
};

export const PATRON_TYPE_NO_VALUE_OPTION = {
  label: <FormattedMessage id="ui-inn-reach.settings.central-patron-type.placeholder.patron-type" />,
  value: NO_VALUE_OPTION_VALUE,
};
