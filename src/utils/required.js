import React from 'react';
import { FormattedMessage } from 'react-intl';

export const required = (value) => {
  return value || parseInt(value, 10) === 0
    ? undefined
    : <FormattedMessage id="ui-inn-reach.validate.required" />;
};
