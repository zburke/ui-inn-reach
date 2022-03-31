import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  isEmpty,
} from 'lodash';

import {
  LoadingPane,
} from '@folio/stripes-components';
import {
  stripesConnect,
  useCustomFields,
} from '@folio/stripes/core';
import {
  VisiblePatronIdForm,
} from '../../components/VisiblePatronId';

import {
  useCallout,
} from '../../../hooks';
import useCentralServers from '../../../hooks/useCentralServers';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  PAYLOAD_FIELDS_FOR_VISIBLE_PATRON_ID,
} from '../../../constants';
import {
  getCustomFieldPatronIdentifiers,
  getPayload,
  getPrimaryValues,
} from './utils';

const {
  USER_C_FIELDS,
} = PAYLOAD_FIELDS_FOR_VISIBLE_PATRON_ID;

const VisiblePatronIdCreateEditRoute = ({
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
  const showCallout = useCallout();
  const servers = centralServers[0]?.centralServers || [];
  const {
    serverOptions,
    selectedServer,
    handleServerChange,
  } = useCentralServers(history, servers);
  const [customFields = [],, isCustomFieldsPending] = useCustomFields('users');
  const [visiblePatronIdConfiguration, setVisiblePatronIdConfiguration] = useState(null);
  const [isVisiblePatronIdConfigurationPending, setVisiblePatronIdConfigurationPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isCheckedUserCustomField, setIsCheckedUserCustomField] = useState(false);

  const customFieldPatronOptions = useMemo(() => getCustomFieldPatronIdentifiers(customFields), [customFields]);

  const processInitialValues = (response) => {
    if (response[USER_C_FIELDS]) {
      setIsCheckedUserCustomField(true);
    }
    const primaryValues = getPrimaryValues(response, customFieldPatronOptions);

    setInitialValues(primaryValues);
  };

  const fetchVisiblePatronIdConfiguration = () => {
    setVisiblePatronIdConfigurationPending(true);

    mutator.visiblePatronIdConfiguration.GET()
      .then(response => {
        processInitialValues(response);
        setVisiblePatronIdConfiguration(response);
      })
      .catch(() => setVisiblePatronIdConfiguration({}))
      .finally(() => setVisiblePatronIdConfigurationPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setVisiblePatronIdConfiguration(null);
  };

  const handleSubmit = (record) => {
    const { POST, PUT } = mutator.visiblePatronIdConfiguration;
    const saveMethod = isEmpty(visiblePatronIdConfiguration) ? POST : PUT;
    const action = isEmpty(visiblePatronIdConfiguration) ? 'create' : 'update';
    const payload = getPayload(record);

    saveMethod(payload)
      .then(() => {
        setInitialValues(record);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.visible-patron-id.${action}.success`} /> });
      })
      .catch(() => {
        showCallout({ type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.visible-patron-id.callout.connectionProblem.${action}`} /> });
      });
  };

  const handleChangeUserCustomCheckbox = (event) => {
    setIsCheckedUserCustomField(event.target.checked);
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      reset();
      fetchVisiblePatronIdConfiguration();
    }
  }, [selectedServer]);

  if (
    (isServersPending && !hasLoadedServers) ||
    isCustomFieldsPending
  ) {
    return <LoadingPane />;
  }

  return (
    <VisiblePatronIdForm
      selectedServer={selectedServer}
      initialValues={initialValues}
      serverOptions={serverOptions}
      customFieldPatronOptions={customFieldPatronOptions}
      visiblePatronIdConfiguration={visiblePatronIdConfiguration}
      isVisiblePatronIdConfigurationPending={isVisiblePatronIdConfigurationPending}
      isCheckedUserCustomField={isCheckedUserCustomField}
      onChangeServer={handleServerChange}
      onSubmit={handleSubmit}
      onChangeUserCustomCheckbox={handleChangeUserCustomCheckbox}
    />
  );
};

VisiblePatronIdCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  visiblePatronIdConfiguration: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/visible-patron-field-configuration',
    pk: '',
    clientGeneratePk: false,
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

VisiblePatronIdCreateEditRoute.propTypes = {
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
    visiblePatronIdConfiguration: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(VisiblePatronIdCreateEditRoute);
