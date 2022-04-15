import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import CentralPatronTypeCreateEditRoute from './CentralPatronTypeCreateEditRoute';

const CentralPatronTypeRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={CentralPatronTypeCreateEditRoute}
      />
    </Switch>
  );
};

CentralPatronTypeRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default CentralPatronTypeRoute;
