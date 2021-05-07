import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  stripesShape,
} from '@folio/stripes/core';

import InnReachSettings from './settings';

export default function InnReach(props) {
  const {
    showSettings,
  } = props;

  if (showSettings) {
    return <InnReachSettings {...props} />;
  }
}
InnReach.propTypes = {
  match: matchShape.isRequired,
  stripes: stripesShape.isRequired,
  showSettings: PropTypes.bool,
};
