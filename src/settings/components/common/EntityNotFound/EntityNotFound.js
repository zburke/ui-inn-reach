import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  MessageBanner,
} from '@folio/stripes/components';

const EntityNotFound = ({
  pageTitleTranslationKey,
  errorTextTranslationKey,
  paneWidth,
  onBack,
}) => (
  <Pane
    data-test-entity-not-found
    dismissible
    defaultWidth={paneWidth}
    paneTitle={<FormattedMessage id={pageTitleTranslationKey} />}
    onClose={onBack}
  >
    <MessageBanner type="error">
      <FormattedMessage id={errorTextTranslationKey} />
    </MessageBanner>
  </Pane>
);

EntityNotFound.propTypes = {
  errorTextTranslationKey: PropTypes.string.isRequired,
  pageTitleTranslationKey: PropTypes.string.isRequired,
  paneWidth: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default EntityNotFound;
