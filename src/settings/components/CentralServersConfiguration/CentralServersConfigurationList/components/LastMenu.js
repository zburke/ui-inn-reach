import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  PaneMenu,
  Button,
} from '@folio/stripes-components';

import {
  getCentralServerConfigurationCreateUrl,
} from '../../../../../utils';

const LastMenu = ({
  history,
  location,
}) => {
  const navigateToCreate = () => history.push({
    pathname: getCentralServerConfigurationCreateUrl(),
    search: location.search
  });

  return (
    <PaneMenu>
      <FormattedMessage id="stripes-smart-components.addNew">
        {ariaLabel => (
          <Button
            marginBottom0
            data-test-add-new-set-button
            aria-label={ariaLabel}
            buttonStyle="primary"
            onClick={navigateToCreate}
          >
            <FormattedMessage id="stripes-smart-components.new" />
          </Button>
        )}
      </FormattedMessage>
    </PaneMenu>
  );
};

LastMenu.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(LastMenu);
