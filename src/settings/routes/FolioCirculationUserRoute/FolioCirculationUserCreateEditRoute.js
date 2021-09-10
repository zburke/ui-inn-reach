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
  formatPayload,
} from './utils';

const {
  CENTRAL_PATRON_TYPE_MAPPINGS,
} = FOLIO_CIRCULATION_USER_FIELDS;

const FolioCirculationUserCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
  },
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];

  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [innReachPatronTypes, setInnReachPatronTypes] = useState([]);
  const [isInnReachPatronTypesPending, setIsInnReachPatronTypesPending] = useState(false);
  const [centralPatronTypeMappings, setCentralPatronTypeMappings] = useState([]);
  const [isCentralPatronTypeMappingsPending, setIsCentralPatronTypeMappingsPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [innReachPatronTypesFailed, setInnReachPatronTypesFailed] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);

  const fetchBarcodeMappings = () => {
    setIsCentralPatronTypeMappingsPending(true);

    mutator.centralPatronTypeMappings.GET()
      .then(response => setCentralPatronTypeMappings(response.centralPatronTypeMappings))
      .catch(() => setCentralPatronTypeMappings([]))
      .finally(() => setIsCentralPatronTypeMappingsPending(false));
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

    mutator.centralPatronTypeMappings.PUT(payload)
      .then(() => {
        const action = isEmpty(centralPatronTypeMappings) ? 'create' : 'update';

        setCentralPatronTypeMappings(payload[CENTRAL_PATRON_TYPE_MAPPINGS]);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.folio-circulation-user.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(centralPatronTypeMappings) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.folio-circulation-user.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (!isCentralPatronTypeMappingsPending && !isInnReachPatronTypesPending) {
      if (isEmpty(centralPatronTypeMappings)) {
        setInitialValues({
          [CENTRAL_PATRON_TYPE_MAPPINGS]: getInnReachPatronTypeOptions(innReachPatronTypes),
        });
      } else {
        const barcodeMappingsMap = getBarcodeMappingsMap(centralPatronTypeMappings);

        setInitialValues({
          [CENTRAL_PATRON_TYPE_MAPPINGS]: formatBarcodeMappings(innReachPatronTypes, barcodeMappingsMap),
        });
      }
    }
  }, [centralPatronTypeMappings, isCentralPatronTypeMappingsPending, isInnReachPatronTypesPending, innReachPatronTypes]);

  if (isServersPending && !hasLoadedServers) return <LoadingPane />;

  return (
    <FolioCirculationUserForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      isCentralPatronTypeMappingsPending={isCentralPatronTypeMappingsPending}
      isInnReachPatronTypesPending={isInnReachPatronTypesPending}
      initialValues={initialValues}
      parentMutator={mutator}
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
    path: 'users',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  centralPatronTypeMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/centralPatronTypeMappings',
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
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    centralPatronTypeMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    innReachPatronTypes: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(FolioCirculationUserCreateEditRoute);
