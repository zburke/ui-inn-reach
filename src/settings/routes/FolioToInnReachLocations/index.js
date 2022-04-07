import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import FolioToInnReachLocationsCreateEditRoute from './FolioToInnReachLocationsCreateEditRoute';

const FolioToInnReachLocationsRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={FolioToInnReachLocationsCreateEditRoute}
      />
    </Switch>
  );
};

FolioToInnReachLocationsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default FolioToInnReachLocationsRoute;
