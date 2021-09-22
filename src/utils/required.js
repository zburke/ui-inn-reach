import React from 'react';
import { FormattedMessage } from 'react-intl';

export const required = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.validate.required" />;
};
