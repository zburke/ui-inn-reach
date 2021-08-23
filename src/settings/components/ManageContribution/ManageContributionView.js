import React, {
  useEffect,
  useMemo,
} from 'react';
import {
  isEqual,
} from 'lodash';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonGroup,
  Col,
  MultiSelection,
  Pane,
  PaneFooter,
  Row,
  Select,
  Selection,
  Loading,
} from '@folio/stripes-components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  CONTRIBUTION_STATUSES,
  DEFAULT_PANE_WIDTH,
  CENTRAL_SERVER_ID,
} from '../../../constants';
import {
  CurrentContribution,
  ContributionHistory,
} from './components';

const {
  STATUS,
  ITEM_TYPE_MAPPING_STATUS,
  LOCATIONS_MAPPING_STATUS,
  CONTRIBUTION_STARTED,
  CONTRIBUTION_STARTED_BY,
  CONTRIBUTION_PAUSED,
  CONTRIBUTION_PAUSED_BY,
  CONTRIBUTION_RESUMED,
  CONTRIBUTION_RESUMED_BY,
  CONTRIBUTION_CANCELLED,
  CONTRIBUTION_CANCELLED_BY,
  CONTRIBUTION_COMPLETE,
  TOTAL_FOLIO_INSTANCE_RECORDS,
  RECORDS_EVALUATED,
  CONTRIBUTED,
  UPDATED,
  DE_CONTRIBUTED,
  ERRORS,
} = MANAGE_CONTRIBUTION_FIELDS;

const {
  NOT_STARTED,
} = CONTRIBUTION_STATUSES;

const ManageContributionView = ({
  currentContribution,
  currentContributionHistory,
  isСurrentContributionPending,
  isСurrentContributionHistoryPending,
  showContributionHistory,
  serverOptions,
  selectContibutionHistory,
  selectCurrentContibution,
  selectedServer,
  onChangeServer,
  onInitiateContribution,
}) => {
  const { formatMessage } = useIntl();

  const canInitiateContribution = currentContribution[STATUS]
    && currentContribution[STATUS] === CONTRIBUTION_STATUSES[NOT_STARTED];

  const getFooter = () => {

    const initiateCintributionBtn = (
      <Button
        marginBottom0
        data-testid="initiate-contribution"
        id="clickable-initiate-contribution"
        buttonStyle="primary mega"
        disabled={!canInitiateContribution}
        onClick={onInitiateContribution}
      >
        <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.initiate-contribution" />
      </Button>
    );
    return showContributionHistory && currentContribution[STATUS] !== CONTRIBUTION_STATUSES[NOT_STARTED]
      ? null
      : <PaneFooter renderEnd={initiateCintributionBtn} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.manage-contribution.title' />}
    >

      <Selection
        id={CENTRAL_SERVER_ID}
        label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
        dataOptions={serverOptions}
        placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
        value={selectedServer.name}
        onChange={onChangeServer}
      />
      <ButtonGroup
        fullWidth
      >
        <Button
          onClick={selectCurrentContibution}
          buttonStyle={`${!showContributionHistory ? 'primary' : 'default'}`}
        >
          <FormattedMessage id="ui-orders.navigation.orders" />
        </Button>
        <Button
          onClick={selectContibutionHistory}
          buttonStyle={`${showContributionHistory ? 'primary' : 'default'}`}
        >
          <FormattedMessage id="ui-orders.navigation.orderLines" />
        </Button>
      </ButtonGroup>

      {isСurrentContributionPending || isСurrentContributionHistoryPending && <Loading />}
      {selectedServer.id && !showContributionHistory && !isСurrentContributionPending && currentContribution &&
        <CurrentContribution
          currentContribution={currentContribution}
        />
      }
      {selectedServer.id && showContributionHistory && !isСurrentContributionHistoryPending && currentContributionHistory &&
        <ContributionHistory
          currentContributionHistory={currentContributionHistory}
        />
      }
    </Pane>
  );
};

ManageContributionView.propTypes = {
  currentContribution: PropTypes.object.isRequired,
  currentContributionHistory: PropTypes.object.isRequired,
  isСurrentContributionPending: PropTypes.bool.isRequired,
  isСurrentContributionHistoryPending: PropTypes.bool.isRequired,
  showContributionHistory: PropTypes.bool.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectContibutionHistory: PropTypes.func.isRequired,
  selectCurrentContibution: PropTypes.func.isRequired,
  selectedServer: PropTypes.object.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onInitiateContribution: PropTypes.func.isRequired,
};

export default ManageContributionView;
