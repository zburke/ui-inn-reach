import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import PagingSlipTemplateRoute from './PagingSlipTemplateRoute';

const FolioCirculationUserRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={PagingSlipTemplateRoute}
      />
    </Switch>
  );
};

FolioCirculationUserRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default FolioCirculationUserRoute;
