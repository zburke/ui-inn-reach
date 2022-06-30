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
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
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
  const [marcTransformationOptions, setMarcTransformationOptions] = useState({});
  const [isMarcTransformationOptionsPending, setIsMarcTransformationOptionsPending] = useState(false);

  const serverOptions = useMemo(() => getCentralServerOptions(servers), [servers]);

  const fetchMarcTransformationOptions = () => {
    setIsMarcTransformationOptionsPending(true);

    mutator.marcTransformationOptions.GET()
      .then(response => setMarcTransformationOptions(response))
      .catch(() => setMarcTransformationOptions({}))
      .finally(() => setIsMarcTransformationOptionsPending(false));
  };

  const reset = () => {
    setIsConfigActive(false);
    setInitialValues(DEFAULT_INITIAL_VALUES);
  };

  const handleServerChange = (selectedServerName) => {
    if (!selectedServerName || selectedServerName === selectedServer.name) return;

    const optedServer = servers.find(server => server.name === selectedServerName);

    setSelectedServer(optedServer);
    mutator.selectedServerId.replace(optedServer.id);
    reset();
    fetchMarcTransformationOptions();
  };

  const handleSubmit = (record) => {
    const { POST, PUT } = mutator.marcTransformationOptions;
    const saveMethod = isEmpty(marcTransformationOptions) ? POST : PUT;
    const action = isEmpty(marcTransformationOptions) ? 'create' : 'update';
    const payload = formatPayload(record, isConfigActive);

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

  const handleChangeConfigState = (form) => (event) => {
    const isChecked = event.target.checked;
    const value = isChecked
      ? initialValues[MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]
      : [];

    form.change(MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS, value);
    setIsConfigActive(isChecked);
  };

  useEffect(() => {
    if (!isEmpty(marcTransformationOptions)) {
      const formattedMarcTransformations = formatMARCTransformations(marcTransformationOptions);

      setInitialValues(formattedMarcTransformations);
      setIsConfigActive(formattedMarcTransformations[CONFIG_IS_ACTIVE]);
    }
  }, [marcTransformationOptions]);

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
  marcTransformationOptions: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/marc-transformation-options',
    accumulate: true,
    clientGeneratePk: false,
    pk: '',
    fetch: false,
    throwErrors: false,
  },
});

export default stripesConnect(BibTransformationOptionsCreateEditRoute);
