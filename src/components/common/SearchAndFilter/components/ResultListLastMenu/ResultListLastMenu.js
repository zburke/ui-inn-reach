import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';

const ResultListLastMenu = ({ history, match, location }) => {
  const navigateToCreate = () => history.push({
    pathname: `${match.path}/create`,
    search: location.search
  });

  return (
    <PaneMenu>
      <FormattedMessage id="stripes-smart-components.addNew">
        {ariaLabel => (
          <Button
            data-test-add-new-item-button
            marginBottom0
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

ResultListLastMenu.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(ResultListLastMenu);
