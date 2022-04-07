import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import VisiblePatronIdCreateEditRoute from './VisiblePatronIdCreateEditRoute';

const VisiblePatronIdRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={VisiblePatronIdCreateEditRoute}
      />
    </Switch>
  );
};

VisiblePatronIdRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default VisiblePatronIdRoute;
