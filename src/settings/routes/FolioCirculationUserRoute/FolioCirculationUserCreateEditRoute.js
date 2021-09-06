import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import {
  CALLOUT_ERROR_TYPE,
  FOLIO_CIRCULATION_USER_FIELDS,
  CENTRAL_SERVERS_LIMITING,
  USERS_LIMIT,
} from '../../../constants';
import {
  getCentralServerOptions,
} from '../../../utils';
import {
  useCallout,
} from '../../../hooks';
import {
  FolioCirculationUserForm,
} from '../../components/FolioCirculationUser';
import {
  getInnReachPatronTypeOptions,
  getBarcodeMappingsMap,
  formatBarcodeMappings,
  getExistingBarcodesSet,
  formatPayload,
} from './utils';

const {
  BARCODE_MAPPINGS,
} = FOLIO_CIRCULATION_USER_FIELDS;

const FolioCirculationUserCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    users: {
      records: usersList,
      isPending: isUsersPending,
      hasLoaded: hasLoadedUsers,
    },
  },
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const users = usersList[0]?.users || [];
  const existingBarcodesSet = useMemo(() => getExistingBarcodesSet(users), [users]);

  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [innReachPatronTypes, setInnReachPatronTypes] = useState([]);
  const [isInnReachPatronTypesPending, setIsInnReachPatronTypesPending] = useState(false);
  const [barcodeMappings, setBarcodeMappings] = useState([]);
  const [isBarcodeMappingsPending, setIsBarcodeMappingsPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [innReachPatronTypesFailed, setInnReachPatronTypesFailed] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);

  const fetchBarcodeMappings = () => {
    setIsBarcodeMappingsPending(true);

    mutator.barcodeMappings.GET()
      .then(response => setBarcodeMappings(response.barcodeMappings))
      .catch(() => setBarcodeMappings([]))
      .finally(() => setIsBarcodeMappingsPending(false));
  };

  const fetchInnReachPatronTypes = () => {
    setIsInnReachPatronTypesPending(true);

    mutator.innReachPatronTypes.GET()
      .then(response => setInnReachPatronTypes(response.patronTypeList))
      .catch(() => {
        setInnReachPatronTypesFailed(true);
        setInnReachPatronTypes([]);
      })
      .finally(() => setIsInnReachPatronTypesPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setInnReachPatronTypesFailed(false);
  };

  const handleServerChange = (selectedServerName) => {
    if (selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    reset();
    fetchBarcodeMappings();
    fetchInnReachPatronTypes();
  };

  const handleSubmit = (record) => {
    const payload = formatPayload(record);

    mutator.barcodeMappings.PUT(payload)
      .then(() => {
        const action = isEmpty(barcodeMappings) ? 'create' : 'update';

        setBarcodeMappings(payload[BARCODE_MAPPINGS]);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.folio-circulation-user.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(barcodeMappings) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.folio-circulation-user.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (!isBarcodeMappingsPending && !isInnReachPatronTypesPending) {
      if (isEmpty(barcodeMappings)) {
        setInitialValues({
          [BARCODE_MAPPINGS]: getInnReachPatronTypeOptions(innReachPatronTypes),
        });
      } else {
        const barcodeMappingsMap = getBarcodeMappingsMap(barcodeMappings);

        setInitialValues({
          [BARCODE_MAPPINGS]: formatBarcodeMappings(innReachPatronTypes, barcodeMappingsMap),
        });
      }
    }
  }, [barcodeMappings, isBarcodeMappingsPending, isInnReachPatronTypesPending, innReachPatronTypes]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isUsersPending && !hasLoadedUsers)
  ) {
    return <LoadingPane />;
  }

  return (
    <FolioCirculationUserForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      isBarcodeMappingsPending={isBarcodeMappingsPending}
      isInnReachPatronTypesPending={isInnReachPatronTypesPending}
      existingBarcodesSet={existingBarcodesSet}
      initialValues={initialValues}
      innReachPatronTypesFailed={innReachPatronTypesFailed}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

FolioCirculationUserCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  users: {
    type: 'okapi',
    path: `users?limit=${USERS_LIMIT}`,
    throwErrors: false,
  },
  barcodeMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/barcode-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  innReachPatronTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/d2r/circ/patrontypes',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

FolioCirculationUserCreateEditRoute.propTypes = {
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    users: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    barcodeMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    innReachPatronTypes: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(FolioCirculationUserCreateEditRoute);
