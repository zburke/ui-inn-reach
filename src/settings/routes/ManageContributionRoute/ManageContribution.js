import React, {
  useEffect,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  isEmpty,
} from 'lodash';
import {
  FormattedMessage,
} from 'react-intl';

import {

  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import ManageContributionView from '../../components/ManageContribution';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';


const ManageContribution = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];

  const [
    selectedServer,
    serverOptions,
    handleServerChange,
  ] = useCentralServers(history, servers);
  const showCallout = useCallout();
  const [currentContribution, setСurrentContribution] = useState({});
  const [currentContributionHistory, setCurrentContributionHistory] = useState({});

  const [isСurrentContributionPending, setIsСurrentContributionPending] = useState(false);
  const [isInitiateContributionPending, setIsInitiateContributionPending] = useState(false);
  const [isСurrentContributionHistoryPending, setIsСurrentContributionHistoryPending] = useState(false);

  const [showContributionHistory, setShowContributionHistory] = useState(false);

  const fetchCurrentContribution = () => {
    mutator.currentContribution.GET()
      .then(response => setСurrentContribution(response))
      .catch(() => null)
      .finally(() => setIsСurrentContributionPending(false));
  };

  const fetchCurrentContributionHistory = () => {
    mutator.currentContribution.GET()
      .then(response => setCurrentContributionHistory(response))
      .catch(() => null)
      .finally(() => setIsСurrentContributionHistoryPending(false));
  };

  const selectContibutionHistory = () => {
    isСurrentContributionHistoryPending(true);
    fetchCurrentContributionHistory();
    setShowContributionHistory(true);
  }

  const selectCurrentContibution = () => {
    isСurrentContributionPending(true);
    fetchCurrentContribution();
    setShowContributionHistory(false);
  }

  const onInitiateContribution = () => {
    setIsInitiateContributionPending(true);
    mutator.initiateContribution.POST()
      .then(() => {
        isСurrentContributionPending(true);
        fetchCurrentContribution();
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={'ui-inn-reach.settings.manage-contribution.initaiate.failed'} />,
        });
      })
      .finally(() => setIsInitiateContributionPending(false));
  }

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setСurrentContribution({});
      setCurrentContributionHistory({});
      setShowHistory(false);
      setIsСurrentContributionPending(true);
      fetchCurrentContribution();
    }
  }, [selectedServer]);



  if (isServersPending && !hasLoadedServers) return <LoadingPane />;

  return (
    <>
      <ManageContributionView
        currentContribution={currentContribution}
        currentContributionHistory={currentContributionHistory}
        isСurrentContributionPending={isСurrentContributionPending}
        isСurrentContributionHistoryPending={isСurrentContributionHistoryPending}
        showContributionHistory={showContributionHistory}
        serverOptions={serverOptions}
        selectContibutionHistory={selectContibutionHistory}
        selectCurrentContibution={selectCurrentContibution}
        selectedServer={selectedServer}
        onChangeServer={handleServerChange}
        onInitiateContribution={onInitiateContribution}
      />
    </>
  );
};

ManageContribution.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  selectedServerId: { initialValue: '' },
  contributionHistory: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/contributions/history',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  currentContribution: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/contributions/current',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  initiateContribution: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/contributions',
    clientGeneratePk: false,
    pk: '',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

ManageContribution.propTypes = {
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
    currentContribution: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
    contributionHistory: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
    initiateContribution: PropTypes.shape({
      POST: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(ManageContribution);
