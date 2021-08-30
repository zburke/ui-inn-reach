import React, {
  useRef,
} from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonGroup,
  Pane,
  PaneFooter,
  Selection,
  Loading,
  Tooltip,
} from '@folio/stripes-components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  CONTRIBUTION_STATUSES,
  DEFAULT_PANE_WIDTH,
  CENTRAL_SERVER_ID,
  ITEM_TYPE_MAPPING_STATUSES,
  LOCATIONS_MAPPING_STATUSES,
} from '../../../constants';
import {
  CurrentContribution,
  ContributionHistory,
} from './components';
import css from './ManageContributionView.css';

const {
  STATUS,
  ITEM_TYPE_MAPPING_STATUS,
  LOCATIONS_MAPPING_STATUS,
} = MANAGE_CONTRIBUTION_FIELDS;

const {
  NOT_STARTED,
} = CONTRIBUTION_STATUSES;

const ManageContributionView = ({
  currentContribution,
  currentContributionHistory,
  currentContributionHistoryCount,
  isСurrentContributionPending,
  isСurrentContributionHistoryPending,
  showContributionHistory,
  serverOptions,
  selectContibutionHistory,
  selectCurrentContibution,
  selectedServer,
  onChangeServer,
  onInitiateContribution,
  onNeedMoreContributionHistoryData,
}) => {
  const { formatMessage } = useIntl();
  const initiateContributionRef = useRef(null);
  const canInitiateContribution = currentContribution[STATUS]
    && currentContribution[STATUS] === NOT_STARTED &&
    currentContribution[ITEM_TYPE_MAPPING_STATUS] === ITEM_TYPE_MAPPING_STATUSES.VALID &&
    currentContribution[LOCATIONS_MAPPING_STATUS] === LOCATIONS_MAPPING_STATUSES.VALID;
  const ariaLabelledby = !canInitiateContribution ? { 'aria-labelledby': 'tooltip-text' } : {};
  const getFooter = () => {
    const initiateCintributionBtn = (
      <>
        <div
          ref={initiateContributionRef}
          className={css.tooltipWrapper}
          {...ariaLabelledby}
        >
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
        </div>
        {!canInitiateContribution &&
          <Tooltip
            id="save-button-tooltip"
            name="tooltip-text"
            text={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.tooltip.check-mappings" />}
            triggerRef={initiateContributionRef}
          />
        }

      </>
    );

    return !selectedServer.id || showContributionHistory || currentContribution[STATUS] !== NOT_STARTED
      ? null
      : <PaneFooter renderEnd={initiateCintributionBtn} />;
  };

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={getFooter()}
      paneTitle={<FormattedMessage id='ui-inn-reach.settings.manage-contribution.title' />}
    >
      <>
        <Selection
          id={CENTRAL_SERVER_ID}
          label={<FormattedMessage id="ui-inn-reach.settings.field.centralServer" />}
          dataOptions={serverOptions}
          placeholder={formatMessage({ id: 'ui-inn-reach.settings.placeholder.centralServer' })}
          value={selectedServer.name}
          onChange={onChangeServer}
        />
        { selectedServer.id &&
          <ButtonGroup
            fullWidth
          >
            <Button
              buttonStyle={`${!showContributionHistory ? 'primary' : 'default'}`}
              onClick={selectCurrentContibution}
            >
              <FormattedMessage id="ui-inn-reach.settings.manage-contribution.navigation.current" />
            </Button>
            <Button
              buttonStyle={`${showContributionHistory ? 'primary' : 'default'}`}
              onClick={selectContibutionHistory}
            >
              <FormattedMessage id="ui-inn-reach.settings.manage-contribution.navigation.history" />
            </Button>
          </ButtonGroup>
        }
        {(isСurrentContributionPending || isСurrentContributionHistoryPending) && <Loading />}
        {selectedServer.id && !showContributionHistory && !isСurrentContributionPending && currentContribution &&
          <CurrentContribution
            currentContribution={currentContribution}
          />
        }
        {selectedServer.id && showContributionHistory && !isСurrentContributionHistoryPending && currentContributionHistory &&
          <ContributionHistory
            currentContributionHistory={currentContributionHistory}
            currentContributionHistoryCount={currentContributionHistoryCount}
            isСurrentContributionHistoryPending={isСurrentContributionHistoryPending}
            onNeedMoreContributionHistoryData={onNeedMoreContributionHistoryData}
          />
        }
      </>
    </Pane>
  );
};

ManageContributionView.propTypes = {
  currentContribution: PropTypes.object.isRequired,
  currentContributionHistory: PropTypes.object.isRequired,
  currentContributionHistoryCount: PropTypes.number.isRequired,
  isСurrentContributionHistoryPending: PropTypes.bool.isRequired,
  isСurrentContributionPending: PropTypes.bool.isRequired,
  selectContibutionHistory: PropTypes.func.isRequired,
  selectCurrentContibution: PropTypes.func.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  showContributionHistory: PropTypes.bool.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onInitiateContribution: PropTypes.func.isRequired,
  onNeedMoreContributionHistoryData: PropTypes.func.isRequired,
};

export default ManageContributionView;
