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
  CENTRAL_PATRON_TYPE_FIELDS,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import {
  getCentralServerOptions,
} from '../../../utils';
import {
  useCallout,
} from '../../../hooks';
import {
  CentralPatronTypeForm,
} from '../../components/CentralPatronType';
import {
  formatPatronTypeMappings,
  getFolioPatronGroupOptions,
  getPatronTypeOptions,
  formatPayload,
  getPatronTypeMappingsMap,
} from './utils';

const {
  PATRON_TYPE_MAPPINGS,
} = CENTRAL_PATRON_TYPE_FIELDS;

const CentralPatronTypeCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    patronGroups: {
      records: patronGroupsData,
      isPending: isPatronGroupsPending,
      hasLoaded: hasPatronGroups,
    },
  },
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const patronGroups = patronGroupsData[0]?.usergroups || [];

  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [patronTypes, setPatronTypes] = useState([]);
  const [isPatronTypesPending, setIsPatronTypesPending] = useState(false);
  const [patronTypeMappings, setPatronTypeMappings] = useState([]);
  const [isPatronTypeMappingsPending, setIsPatronTypeMappingsPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [patronTypesFailed, setPatronTypesFailed] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);
  const patronGroupOptions = useMemo(() => getFolioPatronGroupOptions(patronGroups), [patronGroups]);
  const patronTypeOptions = useMemo(() => getPatronTypeOptions(patronTypes), [patronTypes]);

  const fetchPatronTypeMappings = () => {
    setIsPatronTypeMappingsPending(true);

    mutator.patronTypeMappings.GET()
      .then(response => setPatronTypeMappings(response.patronTypeMappings))
      .catch(() => setPatronTypeMappings([]))
      .finally(() => setIsPatronTypeMappingsPending(false));
  };

  const fetchPatronTypes = () => {
    setIsPatronTypesPending(true);

    mutator.patronTypes.GET()
      .then(response => setPatronTypes(response.patronTypeList))
      .catch(() => {
        setPatronTypesFailed(true);
        setPatronTypes([]);
      })
      .finally(() => setIsPatronTypesPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setPatronTypesFailed(false);
  };

  const handleServerChange = (selectedServerName) => {
    if (selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    reset();
    fetchPatronTypeMappings();
    fetchPatronTypes();
  };

  const handleSubmit = (record) => {
    const payload = formatPayload(record);

    mutator.patronTypeMappings.PUT(payload)
      .then(() => {
        const action = isEmpty(patronTypeMappings) ? 'create' : 'update';

        setPatronTypeMappings(payload[PATRON_TYPE_MAPPINGS]);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.central-patron-type.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(patronTypeMappings) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.central-patron-type.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (!isPatronTypeMappingsPending && !isPatronTypesPending) {
      if (isEmpty(patronTypeMappings)) {
        setInitialValues({
          [PATRON_TYPE_MAPPINGS]: patronGroupOptions,
        });
      } else {
        const patronTypeMappingsMap = getPatronTypeMappingsMap(patronTypeMappings);

        setInitialValues({
          [PATRON_TYPE_MAPPINGS]: formatPatronTypeMappings(patronGroups, patronTypeMappingsMap),
        });
      }
    }
  }, [patronTypeMappings, isPatronTypeMappingsPending, isPatronTypesPending]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isPatronGroupsPending && !hasPatronGroups)
  ) {
    return <LoadingPane />;
  }

  return (
    <CentralPatronTypeForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      patronTypeOptions={patronTypeOptions}
      patronTypeMappings={patronTypeMappings}
      isPatronTypeMappingsPending={isPatronTypeMappingsPending}
      isPatronTypesPending={isPatronTypesPending}
      initialValues={initialValues}
      patronTypesFailed={patronTypesFailed}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

CentralPatronTypeCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  patronGroups: {
    type: 'okapi',
    path: 'groups?query=cql.allRecords=1%20sortby%20group&limit=2000',
    throwErrors: false,
  },
  patronTypeMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/patron-type-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  patronTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/d2r/circ/patrontypes',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

CentralPatronTypeCreateEditRoute.propTypes = {
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    patronGroups: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    patronTypeMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    patronTypes: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(CentralPatronTypeCreateEditRoute);
