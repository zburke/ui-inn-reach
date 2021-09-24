import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NO_VALUE_OPTION_VALUE } from './base';

export const PATRON_AGENCY_ROUTE = 'patron-agency';

export const PATRON_AGENCY_FIELDS = {
  CUSTOM_FIELD_ID: 'customFieldId',
  CONFIGURED_OPTIONS: 'configuredOptions',
  CUSTOM_FIELD_VALUE: 'customFieldValue',
  AGENCY_CODE: 'agencyCode',
};

export const AGENCY_CODE_NO_VALUE_OPTION = {
  label: <FormattedMessage id="ui-inn-reach.settings.patron-agency.placeholder.agency-code" />,
  value: NO_VALUE_OPTION_VALUE,
};
