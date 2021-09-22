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
  CANCELLED,
  IN_PROGRESS,
} = CONTRIBUTION_STATUSES;

const ManageContributionView = ({
  currentContribution,
  currentContributionHistory,
  currentContributionHistoryCount,
  isCurrentContributionPending,
  isCurrentContributionHistoryPending,
  showContributionHistory,
  serverOptions,
  selectContributionHistory,
  selectCurrentContribution,
  selectedServer,
  onChangeServer,
  onInitiateContribution,
  onCancelContribution,
  onNeedMoreContributionHistoryData,
}) => {
  const { formatMessage } = useIntl();
  const initiateContributionRef = useRef(null);

  const getFooter = () => {
    if (!selectedServer.id || showContributionHistory) return null;

    const canInitiateContribution = (
      (currentContribution[STATUS] === NOT_STARTED || currentContribution[STATUS] === CANCELLED) &&
      currentContribution[ITEM_TYPE_MAPPING_STATUS] === ITEM_TYPE_MAPPING_STATUSES.VALID &&
      currentContribution[LOCATIONS_MAPPING_STATUS] === LOCATIONS_MAPPING_STATUSES.VALID
    );
    const ariaLabelledby = !canInitiateContribution ? { 'aria-labelledby': 'tooltip-text' } : {};

    const initiateContributionBtn = () => (
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

    const cancelContributionBtn = () => (
      <Button
        marginBottom0
        buttonStyle="default mega"
        onClick={onCancelContribution}
      >
        <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.cancel-contribution" />
      </Button>
    );

    const pauseContributionBtn = () => (
      <Button
        marginBottom0
        buttonStyle="primary mega"
      >
        <FormattedMessage id="ui-inn-reach.settings.manage-contribution.button.pause-contribution" />
      </Button>
    );

    switch (currentContribution[STATUS]) {
      case NOT_STARTED:
        return <PaneFooter renderEnd={initiateContributionBtn()} />;
      case IN_PROGRESS:
        return (
          <PaneFooter
            renderStart={cancelContributionBtn()}
            renderEnd={pauseContributionBtn()}
          />
        );
      case CANCELLED:
        return <PaneFooter renderEnd={initiateContributionBtn()} />;
      default:
        return null;
    }
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
              onClick={selectCurrentContribution}
            >
              <FormattedMessage id="ui-inn-reach.settings.manage-contribution.navigation.current" />
            </Button>
            <Button
              buttonStyle={`${showContributionHistory ? 'primary' : 'default'}`}
              onClick={selectContributionHistory}
            >
              <FormattedMessage id="ui-inn-reach.settings.manage-contribution.navigation.history" />
            </Button>
          </ButtonGroup>
        }
        {(isCurrentContributionPending || isCurrentContributionHistoryPending) && <Loading />}
        {selectedServer.id && !showContributionHistory && !isCurrentContributionPending && currentContribution &&
          <CurrentContribution
            currentContribution={currentContribution}
          />
        }
        {selectedServer.id && showContributionHistory && !isCurrentContributionHistoryPending && currentContributionHistory &&
          <ContributionHistory
            currentContributionHistory={currentContributionHistory}
            currentContributionHistoryCount={currentContributionHistoryCount}
            isCurrentContributionHistoryPending={isCurrentContributionHistoryPending}
            onNeedMoreContributionHistoryData={onNeedMoreContributionHistoryData}
          />
        }
      </>
    </Pane>
  );
};

ManageContributionView.propTypes = {
  currentContribution: PropTypes.object.isRequired,
  currentContributionHistory: PropTypes.array.isRequired,
  currentContributionHistoryCount: PropTypes.number.isRequired,
  isCurrentContributionHistoryPending: PropTypes.bool.isRequired,
  isCurrentContributionPending: PropTypes.bool.isRequired,
  selectContributionHistory: PropTypes.func.isRequired,
  selectCurrentContribution: PropTypes.func.isRequired,
  selectedServer: PropTypes.object.isRequired,
  serverOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  showContributionHistory: PropTypes.bool.isRequired,
  onCancelContribution: PropTypes.func.isRequired,
  onChangeServer: PropTypes.func.isRequired,
  onInitiateContribution: PropTypes.func.isRequired,
  onNeedMoreContributionHistoryData: PropTypes.func.isRequired,
};

export default ManageContributionView;
