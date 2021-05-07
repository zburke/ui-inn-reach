import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes-core';

import CentralServersConfigurationContext from '../../../contexts/CentralServersConfigurationContext';
import {
  useCallout,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
} from '../../../constants';

const CentralServersConfigurationRootLayer = ({
  children,
  mutator,
}) => {
  const [folioLibraries, setFolioLibraries] = useState([]);

  const showCallout = useCallout();

  useEffect(
    () => {
      mutator.folioLibraries.GET()
        .then(response => {
          setFolioLibraries(response.loclibs);
        })
        .catch(() => {
          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
          });
        });
    }, [showCallout]
  );

  return (
    <CentralServersConfigurationContext.Provider
      value={{ folioLibraries }}
    >
      {children}
    </CentralServersConfigurationContext.Provider>
  );
};

CentralServersConfigurationRootLayer.manifest = Object.freeze({
  folioLibraries: {
    type: 'okapi',
    path: 'location-units/libraries?query=cql.allRecords=1%20sortby%20name&limit=2000',
    accumulate: 'true',
    fetch: false,
  },
});

CentralServersConfigurationRootLayer.propTypes = {
  children: PropTypes.node.isRequired,
  mutator: PropTypes.shape({
    folioLibraries: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(CentralServersConfigurationRootLayer);
