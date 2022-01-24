import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route,
  stripesShape,
  Switch,
  Redirect,
} from '@folio/stripes/core';

import InnReachSettings from './settings';
import TransactionDetailContainer from './components/transaction/TransactionDetails';
import ReceiveShippedItem from './components/ReceiveShippedItem';
import CheckOutBorrowingSite from './components/CheckOutBorrowingSite';
import {
  sections,
} from './constants/sections';
import {
  TransactionListRoute,
} from './routes';

export default function InnReach({
  showSettings,
  match: {
    path,
  },
  stripes,
}) {
  if (showSettings) {
    return (
      <Route
        path={path}
        component={InnReachSettings}
      >
        <Switch>
          {sections
            .flatMap(section => section.pages)
            .filter(setting => !setting.perm || stripes.hasPerm(setting.perm))
            .map(setting => (
              <Route
                path={`${path}/${setting.route}`}
                key={setting.route}
                component={setting.component}
              />
            ))
          }
        </Switch>
      </Route>
    );
  }

  return (
    <Switch>
      <Route
        component={TransactionListRoute}
        path={`${path}/transactions`}
      >
        <Route
          path={`${path}/transactions/:id/view`}
          render={props => <TransactionDetailContainer {...props} />}
        />
      </Route>
      <Route
        path={`${path}/receive-shipped-item`}
        component={ReceiveShippedItem}
      />
      <Route
        path={`${path}/check-out-to-borrowing-site`}
        component={CheckOutBorrowingSite}
      />
      <Redirect to={`${path}/transactions`} />
    </Switch>
  );
}

InnReach.propTypes = {
  match: matchShape.isRequired,
  stripes: stripesShape.isRequired,
  showSettings: PropTypes.bool,
};
