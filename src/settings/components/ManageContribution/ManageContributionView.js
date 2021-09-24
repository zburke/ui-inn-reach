import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Pane,
  Selection,
  Loading,
} from '@folio/stripes-components';
import {
  DEFAULT_PANE_WIDTH,
  CENTRAL_SERVER_ID,
} from '../../../constants';
import {
  CurrentContribution,
  ContributionHistory,
  Footer,
} from './components';

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
  const footer = !selectedServer.id || showContributionHistory
    ? null
    : (
      <Footer
        currentContribution={currentContribution}
        onInitiateContribution={onInitiateContribution}
        onCancelContribution={onCancelContribution}
      />
    );

  return (
    <Pane
      defaultWidth={DEFAULT_PANE_WIDTH}
      footer={footer}
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
