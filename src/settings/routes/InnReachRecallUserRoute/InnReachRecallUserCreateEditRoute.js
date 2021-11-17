import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import {
  LoadingPane,
} from '@folio/stripes-components';
import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  isEmpty,
} from 'lodash';
import useCentralServers from '../../../hooks/useCentralServers';
import {
  useCallout,
} from '../../../hooks';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  INN_REACH_RECALL_USER_FIELDS,
} from '../../../constants';
import {
  InnReachRecallUserForm,
} from '../../components/InnReachRecallUser';

const {
  RECALL_INN_REACH_ITEMS_AS_USER,
} = INN_REACH_RECALL_USER_FIELDS;

const InnReachRecallUserCreateEditRoute = ({
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

  const [innReachRecallUser, setInnReachRecallUser] = useState(null);
  const [isInnReachRecallUserPending, setInnReachRecallUserPending] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const fetchInnReachRecallUser = () => {
    setInnReachRecallUserPending(true);

    mutator.innReachRecallUser.GET()
      .then(response => setInnReachRecallUser(response))
      .catch(() => setInnReachRecallUser({}))
      .finally(() => setInnReachRecallUserPending(false));
  };

  const reset = () => {
    setInitialValues({});
    setInnReachRecallUser(null);
  };

  const handleSubmit = (record) => {
    const { POST, PUT } = mutator.innReachRecallUser;
    const saveMethod = isEmpty(innReachRecallUser) ? POST : PUT;
    const action = isEmpty(innReachRecallUser) ? 'create' : 'update';

    saveMethod(record)
      .then(() => {
        setInnReachRecallUser(record);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.inn-reach-recall-user.${action}.success`} /> });
      })
      .catch(() => {
        showCallout({ type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.inn-reach-recall-user.callout.connectionProblem.${action}`} /> });
      });
  };

  useEffect(() => {
    if (selectedServer.id && !isInnReachRecallUserPending && !isEmpty(innReachRecallUser)) {
      setInitialValues({
        [RECALL_INN_REACH_ITEMS_AS_USER]: innReachRecallUser?.[RECALL_INN_REACH_ITEMS_AS_USER],
      });
    }
  }, [selectedServer.id, innReachRecallUser, isInnReachRecallUserPending]);

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      reset();
      fetchInnReachRecallUser();
    }
  }, [selectedServer]);

  if (isServersPending && !hasLoadedServers) return <LoadingPane />;

  return (
    <InnReachRecallUserForm
      selectedServer={selectedServer}
      serverOptions={serverOptions}
      innReachRecallUser={innReachRecallUser}
      isInnReachRecallUserPending={isInnReachRecallUserPending}
      parentMutator={mutator}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onChangeServer={handleServerChange}
    />
  );
};

InnReachRecallUserCreateEditRoute.manifest = {
  selectedServerId: { initialValue: '' },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  innReachRecallUser: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/inn-reach-recall-user',
    pk: '',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  users: {
    type: 'okapi',
    path: 'users',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
};

InnReachRecallUserCreateEditRoute.propTypes = {
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
    innReachRecallUser: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    users: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(InnReachRecallUserCreateEditRoute);
