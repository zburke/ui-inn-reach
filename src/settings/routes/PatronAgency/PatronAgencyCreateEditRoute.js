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
  getCustomFieldValueOptions,
  getAgencyCodeOptions,
} from './utils';
import useCentralServers from '../../../hooks/useCentralServers';

const {
  CUSTOM_FIELD_ID,
  USER_CUSTOM_FIELD_MAPPINGS,
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

  const handleCustomFieldChange = (customFieldId) => {
    if (userCustomFieldMappings?.[CUSTOM_FIELD_ID] === customFieldId) {
      setInitialValues(userCustomFieldMappings);
    } else {
      setInitialValues({
        [CUSTOM_FIELD_ID]: customFieldId,
        [USER_CUSTOM_FIELD_MAPPINGS]: getCustomFieldValueOptions(customFields, customFieldId),
      });
    }
  };

  const handleSubmit = (payload) => {
    mutator.userCustomFieldMappings.PUT(payload)
      .then(() => {
        const action = isEmpty(userCustomFieldMappings) ? 'create' : 'update';

        setUserCustomFieldMappings(payload[USER_CUSTOM_FIELD_MAPPINGS]);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.patron-agency.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(userCustomFieldMappings) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.patron-agency.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id && !isUserCustomFieldMappingsPending && !isEmpty(userCustomFieldMappings)) {
      setInitialValues(userCustomFieldMappings);
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
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(PatronAgencyCreateEditRoute);
