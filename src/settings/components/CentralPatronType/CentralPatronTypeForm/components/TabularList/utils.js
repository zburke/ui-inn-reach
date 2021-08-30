import React from 'react';
import { FormattedMessage } from 'react-intl';

export const validatePatronType = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.validate.required" />;
};
