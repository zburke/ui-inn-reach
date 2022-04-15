import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import CentralItemTypeCreateEditRoute from './CentralItemTypeCreateEditRoute';

const CentralItemTypeRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={CentralItemTypeCreateEditRoute}
      />
    </Switch>
  );
};

CentralItemTypeRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default CentralItemTypeRoute;
