import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route,
  stripesShape,
  Switch,
} from '@folio/stripes/core';

import InnReachSettings from './settings';
import {
  sections,
} from './settings/components/Settings/constants';

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
}

InnReach.propTypes = {
  match: matchShape.isRequired,
  stripes: stripesShape.isRequired,
  showSettings: PropTypes.bool,
};
