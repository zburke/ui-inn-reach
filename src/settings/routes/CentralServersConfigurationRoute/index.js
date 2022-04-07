import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import CentralServersConfigurationCreateRoute from './CentralServersConfigurationCreateRoute';
import CentralServersConfigurationListRoute from './CentralServersConfigurationListRoute';
import CentralServersConfigurationEditRoute from './CentralServersConfigurationEditRoute';
import CentralServersConfigurationViewRoute from './CentralServersConfigurationViewRoute';
import CentralServersConfigurationRootLayer from './CentralServersConfigurationRootLayer';

const CentralServersConfigurationRoute = ({ match }) => {
  return (
    <CentralServersConfigurationRootLayer>
      <Switch>
        <Route
          exact
          path={`${match.path}/create`}
          component={CentralServersConfigurationCreateRoute}

        />
        <Route
          exact
          path={`${match.path}/:id/edit`}
          component={CentralServersConfigurationEditRoute}
        />
        <Route
          path={`${match.path}`}
          component={CentralServersConfigurationListRoute}
        >
          <Route
            exact
            path={`${match.path}/:id/view`}
            component={CentralServersConfigurationViewRoute}
          />
        </Route>
      </Switch>
    </CentralServersConfigurationRootLayer>
  );
};

CentralServersConfigurationRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default CentralServersConfigurationRoute;
