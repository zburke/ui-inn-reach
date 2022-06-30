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
  CENTRAL_ITEM_TYPE_FIELDS,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import {
  getCentralServerOptions,
} from '../../../utils';
import {
  useCallout,
} from '../../../hooks';
import CentralItemTypeForm from '../../components/CentralItemType/CentralItemTypeForm';
import {
  formatItemTypeMappings,
  getInnReachItemTypeOptions,
  getFolioMaterialTypeOptions,
  formatPayload,
  getItemTypeMappingsMap,
} from './utils';

const {
  ITEM_TYPE_MAPPINGS,
} = CENTRAL_ITEM_TYPE_FIELDS;

const CentralItemTypeCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    materialTypes: {
      records: materialTypesData,
      isPending: isMaterialTypesPending,
      hasLoaded: hasLoadedMaterialTypes,
    },
  },
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const materialTypes = materialTypesData[0]?.mtypes || [];

  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [itemTypeMappings, setItemTypeMappings] = useState([]);
  const [innReachItemTypes, setInnReachItemTypes] = useState([]);
  const [innReachItemTypesFailed, setInnReachItemTypesFailed] = useState(false);
  const [isItemTypeMappingsPending, setIsItemTypeMappingsPending] = useState(false);
  const [isInnReachItemTypesPending, setIsInnReachItemTypesPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);
  const innReachItemTypeOptions = useMemo(() => getInnReachItemTypeOptions(innReachItemTypes), [innReachItemTypes]);
  const folioMaterialTypeOptions = useMemo(() => getFolioMaterialTypeOptions(materialTypes), [materialTypes]);

  const fetchInnReachItemTypes = () => {
    setIsInnReachItemTypesPending(true);

    mutator.innReachItemTypes.GET()
      .then(response => setInnReachItemTypes(response.itemTypeList))
      .catch(() => {
        setInnReachItemTypesFailed(true);
        setInnReachItemTypes([]);
      })
      .finally(() => setIsInnReachItemTypesPending(false));
  };

  const fetchItemTypeMappings = () => {
    setIsItemTypeMappingsPending(true);

    mutator.itemTypeMappings.GET()
      .then(response => setItemTypeMappings(response.itemTypeMappings))
      .catch(() => setItemTypeMappings([]))
      .finally(() => setIsItemTypeMappingsPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setInnReachItemTypesFailed(false);
  };

  const handleServerChange = (selectedServerName) => {
    if (!selectedServerName || selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    reset();
    fetchInnReachItemTypes();
    fetchItemTypeMappings();
  };

  const handleSubmit = (record) => {
    const payload = formatPayload(record);

    mutator.itemTypeMappings.PUT(payload)
      .then(() => {
        const action = isEmpty(itemTypeMappings) ? 'create' : 'update';

        setItemTypeMappings(payload[ITEM_TYPE_MAPPINGS]);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.central-item-type.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(itemTypeMappings) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.central-item-type.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (!isItemTypeMappingsPending && !isInnReachItemTypesPending) {
      if (isEmpty(itemTypeMappings)) {
        setInitialValues({
          [ITEM_TYPE_MAPPINGS]: innReachItemTypeOptions,
        });
      } else {
        const itemTypeMappingsMap = getItemTypeMappingsMap(itemTypeMappings);

        setInitialValues({
          [ITEM_TYPE_MAPPINGS]: formatItemTypeMappings(innReachItemTypes, itemTypeMappingsMap),
        });
      }
    }
  }, [itemTypeMappings, isItemTypeMappingsPending, isInnReachItemTypesPending]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isMaterialTypesPending && !hasLoadedMaterialTypes)
  ) {
    return <LoadingPane />;
  }

  return (
    <CentralItemTypeForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      folioMaterialTypeOptions={folioMaterialTypeOptions}
      isItemTypeMappingsPending={isItemTypeMappingsPending}
      isInnReachItemTypesPending={isInnReachItemTypesPending}
      innReachItemTypesFailed={innReachItemTypesFailed}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

CentralItemTypeCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  innReachItemTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/d2r/contribution/itemtypes',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  itemTypeMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/item-type-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

CentralItemTypeCreateEditRoute.propTypes = {
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    itemTypeMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    innReachItemTypes: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(CentralItemTypeCreateEditRoute);
