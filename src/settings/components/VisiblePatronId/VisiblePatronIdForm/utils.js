import {
  FormattedMessage,
} from 'react-intl';
import {
  some,
} from 'lodash';

import {
  VISIBLE_PATRON_ID_FIELDS,
} from '../../../../constants';

const {
  CUSTOM,
} = VISIBLE_PATRON_ID_FIELDS;

export const validateVisiblePatronIdFields = (allValues) => {
  const {
    [CUSTOM]: customFieldIdentifiers,
    ...restIdentifiers
  } = allValues;
  const errors = {};
  const hasIdentifiers = customFieldIdentifiers?.length || some(restIdentifiers, Boolean);

  if (!hasIdentifiers) {
    errors.identifiers = <FormattedMessage id="ui-inn-reach.settings.visible-patron-id.validate.select-to-continue" />;
  }

  return errors;
};
