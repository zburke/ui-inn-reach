import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  PaneHeaderIconButton,
  PaneMenu,
} from '@folio/stripes/components';

const FirsrMenuCloseButton = ({
  onClickHandler,
}) => (
  <PaneMenu>
    <FormattedMessage id="ui-inn-reach.settings.cancel">
      {ariaLabel => (
        <PaneHeaderIconButton
          data-testId="pane-header-dismiss-button"
          id="pane-header-dismiss-button"
          icon="times"
          ariaLabel={ariaLabel}
          onClick={onClickHandler}
        />
      )}
    </FormattedMessage>
  </PaneMenu>
);

FirsrMenuCloseButton.propTypes = {
  onClickHandler: PropTypes.func.isRequired
};

export default FirsrMenuCloseButton;
