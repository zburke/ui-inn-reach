import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import MaterialTypeCreateEditRoute from './MaterialTypeCreateEditRoute';

const MaterialTypeRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={MaterialTypeCreateEditRoute}
      />
    </Switch>
  );
};

MaterialTypeRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(MaterialTypeRoute);
