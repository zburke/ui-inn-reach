import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isEmpty,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  LoadingPane,
} from '@folio/stripes-components';
import {
  stripesConnect,
  useCustomFields,
} from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import {
  CALLOUT_ERROR_TYPE,
  PATRON_AGENCY_FIELDS,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import {
  useCallout,
} from '../../../hooks';
import { PatronAgencyForm } from '../../components/PatronAgency';
import {
  getCustomFieldOptions,
  getSelectedCustomField,
  getOnlyCustomFieldValues,
  getAgencyCodeOptions,
  formatUserCustomFieldMappings,
  formatPayload,
} from './utils';
import useCentralServers from '../../../hooks/useCentralServers';

const {
  CUSTOM_FIELD_ID,
  CONFIGURED_OPTIONS,
} = PATRON_AGENCY_FIELDS;

const PatronAgencyCreateEditRoute = ({
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

  const {
    serverOptions,
    selectedServer,
    handleServerChange,
  } = useCentralServers(history, servers);
  const [customFields = [],, isCustomFieldsPending] = useCustomFields('users');

  const showCallout = useCallout();

  const [userCustomFieldMappings, setUserCustomFieldMappings] = useState(null);
  const [isUserCustomFieldMappingsPending, setIsUserCustomFieldMappingsPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const customFieldOptions = useMemo(() => getCustomFieldOptions(customFields), [customFields]);
  const agencyCodeOptions = useMemo(() => getAgencyCodeOptions(selectedServer), [selectedServer]);

  const fetchUserCustomFieldMappings = () => {
    setIsUserCustomFieldMappingsPending(true);

    mutator.userCustomFieldMappings.GET()
      .then(response => setUserCustomFieldMappings(response))
      .catch(() => setUserCustomFieldMappings({}))
      .finally(() => setIsUserCustomFieldMappingsPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setUserCustomFieldMappings(null);
  };

  const setFullMappings = (customFieldId) => {
    const selectedCustomField = getSelectedCustomField(customFields, customFieldId);
    const formattedMappings = formatUserCustomFieldMappings(selectedCustomField, userCustomFieldMappings);

    setInitialValues(formattedMappings);
  };

  const handleCustomFieldChange = (customFieldId) => {
    if (userCustomFieldMappings?.[CUSTOM_FIELD_ID] === customFieldId) {
      setFullMappings(customFieldId);
    } else {
      const selectedCustomField = getSelectedCustomField(customFields, customFieldId);

      setInitialValues({
        [CUSTOM_FIELD_ID]: customFieldId,
        [CONFIGURED_OPTIONS]: getOnlyCustomFieldValues(selectedCustomField),
      });
    }
  };

  const handleSubmit = (record) => {
    const { POST, PUT } = mutator.userCustomFieldMappings;
    const saveMethod = isEmpty(userCustomFieldMappings) ? POST : PUT;
    const action = isEmpty(userCustomFieldMappings) ? 'create' : 'update';
    const payload = formatPayload(record);

    saveMethod(payload)
      .then(() => {
        setUserCustomFieldMappings(payload);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.patron-agency.${action}.success`} /> });
      })
      .catch(() => {
        showCallout({ type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.patron-agency.callout.connectionProblem.${action}`} /> });
      });
  };

  useEffect(() => {
    if (selectedServer.id && !isUserCustomFieldMappingsPending && !isEmpty(userCustomFieldMappings)) {
      setFullMappings(userCustomFieldMappings[CUSTOM_FIELD_ID]);
    }
  }, [selectedServer.id, userCustomFieldMappings, isUserCustomFieldMappingsPending]);

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      reset();
      fetchUserCustomFieldMappings();
    }
  }, [selectedServer]);

  if (
    (isServersPending && !hasLoadedServers) ||
    isCustomFieldsPending
  ) {
    return <LoadingPane />;
  }

  return (
    <PatronAgencyForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      agencyCodeOptions={agencyCodeOptions}
      customFieldOptions={customFieldOptions}
      userCustomFieldMappings={userCustomFieldMappings}
      isUserCustomFieldMappingsPending={isUserCustomFieldMappingsPending}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
      onChangeCustomField={handleCustomFieldChange}
    />
  );
};

PatronAgencyCreateEditRoute.manifest = Object.freeze({
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  userCustomFieldMappings: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/user-custom-field-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

PatronAgencyCreateEditRoute.propTypes = {
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
    userCustomFieldMappings: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(PatronAgencyCreateEditRoute);
