import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import ManageContribution from './ManageContribution';

const ManageContributionRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={ManageContribution}
      />
    </Switch>
  );
};

ManageContributionRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default ManageContributionRoute;
