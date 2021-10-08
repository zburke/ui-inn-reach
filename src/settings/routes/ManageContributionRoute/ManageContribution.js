import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
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
  PAGE_AMOUNT,
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
  const {
    serverOptions,
    selectedServer,
    handleServerChange,
  } = useCentralServers(history, servers);

  const showCallout = useCallout();
  const [currentContribution, setCurrentContribution] = useState({});
  const [currentContributionHistory, setCurrentContributionHistory] = useState([]);
  const [contributionHistoryCount, setContributionHistoryCount] = useState(0);
  const [contributionHistoryOffset, setContributionHistoryOffset] = useState(0);

  const [isCurrentContributionPending, setIsCurrentContributionPending] = useState(false);
  const [isCurrentContributionHistoryPending, setIsCurrentContributionHistoryPending] = useState(false);

  const [showContributionHistory, setShowContributionHistory] = useState(false);

  const fetchCurrentContribution = () => {
    mutator.currentContribution.GET()
      .then(response => setCurrentContribution(response))
      .catch(() => null)
      .finally(() => setIsCurrentContributionPending(false));
  };

  const selectCurrentContribution = () => {
    setIsCurrentContributionPending(true);
    setShowContributionHistory(false);
    fetchCurrentContribution();
  };

  const handleInitiateContribution = () => {
    mutator.initiateContribution.POST({})
      .then(() => {
        setIsCurrentContributionPending(true);
        showCallout({
          message: <FormattedMessage id='ui-inn-reach.settings.manage-contribution.initaiate.success' />,
        });
        fetchCurrentContribution();
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id='ui-inn-reach.settings.manage-contribution.initaiate.failed' />,
        });
      });
  };

  const handleCancelContribution = () => {
    mutator.jobs.DELETE({ id: currentContribution.jobId })
      .then(() => {
        setIsCurrentContributionPending(true);
        showCallout({
          message: <FormattedMessage id='ui-inn-reach.settings.manage-contribution.cancel.success' />,
        });
        fetchCurrentContribution();
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id='ui-inn-reach.settings.manage-contribution.cancel.failed' />,
        });
      });
  };

  const loadContributionHistory = (offset) => {
    setIsCurrentContributionHistoryPending(true);

    return mutator.contributionHistory.GET({
      params: {
        limit: PAGE_AMOUNT,
        offset,
      }
    })
      .then(response => {
        if (!offset) {
          setContributionHistoryCount(response.totalRecords);
        }

        setCurrentContributionHistory((prev) => [...prev, ...response.contributionHistory]);
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.callout.connectionProblem.get" />,
        });
      })
      .finally(() => setIsCurrentContributionHistoryPending(false));
  };

  const refreshList = () => {
    setIsCurrentContributionHistoryPending(true);
    setShowContributionHistory(true);
    setCurrentContributionHistory([]);
    setContributionHistoryCount(0);
    setContributionHistoryOffset(0);
    loadContributionHistory(0);
  };

  const handleNeedMoreContributionHistoryData = useCallback(
    () => {
      const newOffset = contributionHistoryOffset + PAGE_AMOUNT;

      loadContributionHistory(newOffset)
        .then(() => {
          setContributionHistoryOffset(newOffset);
        });
    },
    [contributionHistoryOffset],
  );

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setIsCurrentContributionPending(true);
      setCurrentContribution({});
      setCurrentContributionHistory([]);
      fetchCurrentContribution();
    }
  }, [selectedServer]);

  if (isServersPending && !hasLoadedServers) return <LoadingPane />;

  return (
    <ManageContributionView
      currentContribution={currentContribution}
      currentContributionHistory={currentContributionHistory}
      currentContributionHistoryCount={contributionHistoryCount}
      isCurrentContributionPending={isCurrentContributionPending}
      isCurrentContributionHistoryPending={isCurrentContributionHistoryPending}
      showContributionHistory={showContributionHistory}
      serverOptions={serverOptions}
      selectContributionHistory={refreshList}
      selectCurrentContribution={selectCurrentContribution}
      selectedServer={selectedServer}
      onChangeServer={handleServerChange}
      onInitiateContribution={handleInitiateContribution}
      onNeedMoreContributionHistoryData={handleNeedMoreContributionHistoryData}
      onCancelContribution={handleCancelContribution}
    />
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
    throwErrors: false,
    fetch: false,
  },
  jobs: {
    type: 'okapi',
    path: 'instance-storage/instances/iteration',
    clientGeneratePk: false,
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
    jobs: PropTypes.shape({
      DELETE: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(ManageContribution);
