import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import PickupLocationsRoute from './PickupLocationsRoute';

const PatronAgencyRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={PickupLocationsRoute}
      />
    </Switch>
  );
};

PatronAgencyRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default PatronAgencyRoute;
