import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';

const ContributionCriteriaRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={ContributionCriteriaCreateEditRoute}
      />
    </Switch>
  );
};

ContributionCriteriaRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(ContributionCriteriaRoute);
