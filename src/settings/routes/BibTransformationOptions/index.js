import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { hot } from 'react-hot-loader';

import {
  Route,
  Switch,
} from '@folio/stripes/core';

import BibTransformationOptionsCreateEditRoute from './BibTransformationOptionsCreateEditRoute';

const BibTransformationOptionsRoute = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={BibTransformationOptionsCreateEditRoute}
      />
    </Switch>
  );
};

BibTransformationOptionsRoute.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default hot(module)(BibTransformationOptionsRoute);
