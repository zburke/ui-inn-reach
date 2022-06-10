import React, {
  useEffect,
  useState,
} from 'react';
import {
  omit,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  LoadingPane,
} from '@folio/stripes-components';
import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  PickupLocationsForm,
} from '../../components';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  METADATA,
  PICKUP_LOCATIONS_FIELDS,
} from '../../../constants';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';

const {
  CHECK_PICKUP_LOCATION,
} = PICKUP_LOCATIONS_FIELDS;

const PickupLocationsRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
  },
  mutator,
  history,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const showCallout = useCallout();
  const {
    serverOptions,
    selectedServer,
    handleServerChange,
  } = useCentralServers(history, servers);

  const [initialValues, setInitialValues] = useState({});

  const setOriginValues = (checkPickupLocation) => {
    setInitialValues({
      [CHECK_PICKUP_LOCATION]: checkPickupLocation,
    });
  };

  const handleSubmit = (record) => {
    const payload = {
      ...omit(selectedServer, METADATA),
      [CHECK_PICKUP_LOCATION]: record[CHECK_PICKUP_LOCATION],
    };

    mutator.centralServerRecords.PUT(payload)
      .then(() => {
        setOriginValues(record[CHECK_PICKUP_LOCATION]);

        showCallout({ message: <FormattedMessage id="ui-inn-reach.settings.pickup-locations.update.success" /> });
      })
      .catch(() => {
        showCallout({ type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.pickup-locations.callout.connectionProblem.update" /> });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setOriginValues(selectedServer[CHECK_PICKUP_LOCATION]);
    }
  }, [selectedServer]);

  if (isServersPending && !hasLoadedServers) {
    return <LoadingPane />;
  }

  return (
    <PickupLocationsForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

PickupLocationsRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    PUT: {
      path: 'inn-reach/central-servers',
    },
    throwErrors: false,
  },
});

PickupLocationsRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    centralServerRecords: PropTypes.shape({
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(PickupLocationsRoute);
