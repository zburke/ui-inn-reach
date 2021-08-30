import React from 'react';
import { FormattedMessage } from 'react-intl';

export const validateIdentifierType = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.folio-to-inn-reach-locations.create-edit.validation.pleaseEnterAValue" />;
};
