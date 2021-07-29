import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-components';

import {
  CentralServersConfigurationList,
} from '../../components';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  DEFAULT_PANE_WIDTH,
} from '../../../constants';
import {
  getCentralServerConfigurationListUrl,
} from '../../../utils';
import {
  useCallout,
  useLocationReset,
} from '../../../hooks';

const CentralServersConfigurationListRoute = ({
  history,
  location,
  mutator,
  children,
}) => {
  const [centralServers, setCentralServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const showCallout = useCallout();

  const loadCentralServers = () => {
    setIsLoading(true);

    return mutator.centralServerRecords.GET({})
      .then(centralServersResponse => {
        setCentralServers(centralServersResponse.centralServers);
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const refreshList = () => {
    setCentralServers([]);
    loadCentralServers();
  };

  useEffect(
    () => {
      refreshList();
    },
    [],
  );

  useLocationReset(history, location, getCentralServerConfigurationListUrl(), refreshList);

  const isInitialLoading = isLoading && !centralServers.length;

  if (isInitialLoading) {
    return (
      <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />
    );
  }

  return (
    <CentralServersConfigurationList
      centralServers={centralServers}
    >
      {children}
    </CentralServersConfigurationList>
  );
};

CentralServersConfigurationListRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

CentralServersConfigurationListRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(CentralServersConfigurationListRoute);
