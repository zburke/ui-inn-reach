import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isEmpty,
} from 'lodash';
import {
  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { BibTransformationOptionsForm } from '../../components/BibTransformationOptions';
import {
  CENTRAL_SERVERS_LIMITING,
  DEFAULT_INITIAL_VALUES,
  BIB_TRANSFORMATION_FIELDS,
  CALLOUT_ERROR_TYPE,
} from '../../../constants';
import {
  useCallout,
} from '../../../hooks';
import {
  getCentralServerOptions,
} from '../../../utils';
import {
  formatMARCTransformations,
  formatPayload,
} from './utils';

const {
  CONFIG_IS_ACTIVE,
} = BIB_TRANSFORMATION_FIELDS;

const BibTransformationOptionsCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    identifierTypes: {
      records: identifierTypesData,
      isPending: isIdentifierTypesPending,
      hasLoaded: hasLoadedIdentifierTypes,
    },
  },
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const identifierTypes = identifierTypesData[0]?.identifierTypes || [];

  const { formatMessage } = useIntl();
  const showCallout = useCallout();

  const [selectedServer, setSelectedServer] = useState({});
  const [isConfigActive, setIsConfigActive] = useState(false);
  const [initialValues, setInitialValues] = useState(DEFAULT_INITIAL_VALUES);
  const [MARCTransformationOptions, setMarcTransformationOptions] = useState({});
  const [isMarcTransformationOptionsPending, setIsMarcTransformationOptionsPending] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);

  const fetchMarcTransformationOptions = () => {
    setIsMarcTransformationOptionsPending(true);

    mutator.MARCTransformationOptions.GET()
      .then(response => setMarcTransformationOptions(response))
      .catch(() => setMarcTransformationOptions({}))
      .finally(() => setIsMarcTransformationOptionsPending(false));
  };

  const reset = () => {
    setIsConfigActive(false);
    setInitialValues(DEFAULT_INITIAL_VALUES);
  };

  const handleServerChange = (selectedServerName) => {
    if (selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    reset();
    fetchMarcTransformationOptions();
  };

  const handleSubmit = (record) => {
    const { POST, PUT } = mutator.MARCTransformationOptions;
    const saveMethod = isEmpty(MARCTransformationOptions) ? POST : PUT;
    const action = isEmpty(MARCTransformationOptions) ? 'create' : 'update';
    const payload = formatPayload(record);

    saveMethod(payload)
      .then(() => {
        setMarcTransformationOptions(payload);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.bib-transformation.${action}.success`} /> });
      })
      .catch(error => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage
            id={`ui-inn-reach.settings.bib-transformation.callout.connection-problem.${action}`}
            values={JSON.parse(error.message)}
          />,
        });
      });
  };

  const handleChangeConfigState = (event) => {
    setIsConfigActive(event.target.checked);
  };

  useEffect(() => {
    if (!isEmpty(MARCTransformationOptions)) {
      const formattedMarcTransformations = formatMARCTransformations(MARCTransformationOptions);

      setInitialValues(formattedMarcTransformations);
      setIsConfigActive(formattedMarcTransformations[CONFIG_IS_ACTIVE]);
    }
  }, [MARCTransformationOptions]);

  if (
    (isServersPending && !hasLoadedServers) ||
    (isIdentifierTypesPending && !hasLoadedIdentifierTypes)
  ) {
    return <LoadingPane />;
  }

  return (
    <BibTransformationOptionsForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      identifierTypes={identifierTypes}
      initialValues={initialValues}
      isConfigActive={isConfigActive}
      isMarcTransformationOptionsPending={isMarcTransformationOptionsPending}
      formatMessage={formatMessage}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
      onChangeConfigState={handleChangeConfigState}
    />
  );
};

BibTransformationOptionsCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  identifierTypes: {
    type: 'okapi',
    path: 'identifier-types?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  MARCTransformationOptions: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/marc-transformation-options',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

export default stripesConnect(BibTransformationOptionsCreateEditRoute);
