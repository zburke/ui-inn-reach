import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import AgencyToFolioLocationsCreateEditRoute from './AgencyToFolioLocationsCreateEditRoute';

const AgencyToFolioLocationsRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={AgencyToFolioLocationsCreateEditRoute}
      />
    </Switch>
  );
};

AgencyToFolioLocationsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(AgencyToFolioLocationsRoute);
