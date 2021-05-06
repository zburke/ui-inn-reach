import React, {
  useCallback,
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
} from '@folio/stripes/components';

import {
  CentralServersConfigurationList,
} from '../../components';
import {
  PAGE_AMOUNT,
  CALLOUT_ERROR_TYPE,
  DEFAULT_PANE_WIDTH,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../constants';
import {
  getCentralServerConfigurationViewUrl,
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
  const [centralServersCount, setCentralServersCount] = useState(0);
  const [centralServersOffset, setCentralServersOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const showCallout = useCallout();

  const loadCentralServers = (offset) => {
    setIsLoading(true);

    return mutator.centralServerRecords.GET({
      params: {
        limit: PAGE_AMOUNT,
        offset,
      }
    })
      .then(centralServersResponse => {
        if (!offset) {
          setCentralServersCount(centralServersResponse.totalRecords);
        }

        setCentralServers((prev) => [...prev, ...centralServersResponse.centralServers]);
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.get" />,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = centralServersOffset + PAGE_AMOUNT;

      loadCentralServers(newOffset)
        .then(() => {
          setCentralServersOffset(newOffset);
        });
    },
    [centralServersOffset],
  );

  const refreshList = () => {
    setCentralServers([]);
    setCentralServersCount(0);
    setCentralServersOffset(0);
    loadCentralServers(0);
  };

  useEffect(
    () => {
      refreshList();
    },
    [],
  );

  useLocationReset(history, location, getCentralServerConfigurationListUrl(), refreshList);

  const onRowClick = useCallback((e, meta) => {
    history.push({
      pathname: getCentralServerConfigurationViewUrl(meta[CENTRAL_SERVER_CONFIGURATION_FIELDS.ID]),
      search: location.search,
    });
  }, [history, location.search]);

  const isInitialLoading = isLoading && !centralServers.length;

  if (isInitialLoading) {
    return (
      <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />
    );
  }

  return (
    <CentralServersConfigurationList
      centralServers={centralServers}
      onRowClick={onRowClick}
      totalCount={centralServersCount}
      onNeedMoreData={onNeedMoreData}
      loading={isLoading}
    >
      { children}
    </CentralServersConfigurationList>
  );
};

CentralServersConfigurationListRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    fetch: false,
    accumulate: true,
  },
});

CentralServersConfigurationListRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
  }),
  children: PropTypes.node,
};

export default stripesConnect(CentralServersConfigurationListRoute);