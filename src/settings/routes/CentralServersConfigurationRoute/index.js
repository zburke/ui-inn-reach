import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch
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
          path={`${match.path}/create`}
          component={CentralServersConfigurationCreateRoute}
          exact
        />
        <Route
          path={`${match.path}/:id/edit`}
          component={CentralServersConfigurationEditRoute}
          exact
        />
        <Route
          path={`${match.path}`}
          component={CentralServersConfigurationListRoute}
        >
          <Route
            path={`${match.path}/:id/view`}
            component={CentralServersConfigurationViewRoute}
            exact
          />
        </Route>
      </Switch>
    </CentralServersConfigurationRootLayer>
  );
};

CentralServersConfigurationRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(CentralServersConfigurationRoute);