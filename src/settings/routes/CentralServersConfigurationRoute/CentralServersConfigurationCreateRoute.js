import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import {
  CentralServersConfigurationContext,
} from '../../../contexts';

import CentralServersConfigurationFormContainer from '../../components/CentralServersConfiguration/CentralServersConfigurationForm/CentralServersConfigurationFormContainer';

const CentralServersConfigurationCreateRoute = ({
  history,
  location,
  children,
}) => {
  return (
    <CentralServersConfigurationContext.Consumer>
      {data => (
        <CentralServersConfigurationFormContainer
          history={history}
          location={location}
          data={data}
        >
          {children}
        </CentralServersConfigurationFormContainer>
      )}
    </CentralServersConfigurationContext.Consumer>
  );
};

CentralServersConfigurationCreateRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node,
};

export default CentralServersConfigurationCreateRoute;
