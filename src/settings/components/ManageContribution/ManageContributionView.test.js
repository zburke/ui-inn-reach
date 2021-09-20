import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties } from '../../../../test/jest/helpers';
import ManageContributionView from './ManageContributionView';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Tooltip: jest.fn(() => <div>Tooltip</div>),
}));

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'CSC',
    value: 'f8723a94-25d5-4f19-9043-cc3c306d54a1'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'testName2',
    value: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const currentContribution = {
  itemTypeMappingStatus: 'Valid',
  locationsMappingStatus: 'Invalid',
  status: 'Not started',
};

const renderCentralPatronTypeForm = ({
  selectedServer = selectedServerMock,
  currentContributionHistory = [],
  currentContributionHistoryCount = 0,
  isCurrentContributionPending = false,
  isCurrentContributionHistoryPending = false,
  showContributionHistory = false,
  selectContributionHistory,
  selectCurrentContribution,
  onChangeServer,
  onInitiateContribution,
  onNeedMoreContributionHistoryData,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <ManageContributionView
        currentContribution={currentContribution}
        currentContributionHistory={currentContributionHistory}
        currentContributionHistoryCount={currentContributionHistoryCount}
        isCurrentContributionPending={isCurrentContributionPending}
        isCurrentContributionHistoryPending={isCurrentContributionHistoryPending}
        showContributionHistory={showContributionHistory}
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        selectContributionHistory={selectContributionHistory}
        selectCurrentContribution={selectCurrentContribution}
        onChangeServer={onChangeServer}
        onInitiateContribution={onInitiateContribution}
        onNeedMoreContributionHistoryData={onNeedMoreContributionHistoryData}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ManageContributionView', () => {
  const onChangeServer = jest.fn();
  const selectContributionHistory = jest.fn();
  const selectCurrentContribution = jest.fn();
  const onInitiateContribution = jest.fn();
  const onNeedMoreContributionHistoryData = jest.fn();

  const commonProps = {
    onChangeServer,
    selectContributionHistory,
    selectCurrentContribution,
    onInitiateContribution,
    onNeedMoreContributionHistoryData,
  };

  it('should be rendered', () => {
    const { container } = renderCentralPatronTypeForm(commonProps);

    expect(container).toBeVisible();
  });
});
