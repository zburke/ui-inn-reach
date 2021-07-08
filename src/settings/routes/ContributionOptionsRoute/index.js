import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import ContributionOptionsCreateEditRoute from './ContributionOptionsCreateEditRoute';

const ContributionOptionsRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={ContributionOptionsCreateEditRoute}
      />
    </Switch>
  );
};

ContributionOptionsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(ContributionOptionsRoute);
