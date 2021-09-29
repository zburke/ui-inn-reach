import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import ManageContributionRoute from './ManageContribution';
import ManageContributionView from '../../components/ManageContribution/ManageContributionView';
import { useCentralServers } from '../../../hooks';

jest.mock('../../components/ManageContribution/ManageContributionView', () => {
  return jest.fn(() => <div>ManageContributionView</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue({}),
}));

const servers = [
  {
    id: '1',
    name: 'testServerName1',
  },
  {
    id: '2',
    name: 'testServerName2',
  },
];

const serverOptions = [
  {
    id: '1',
    value: 'testServerName1',
    label: 'testServerName1',
  },
  {
    id: '2',
    value: 'testServerName2',
    label: 'testServerName2',
  },
];

const currentContribution = {
  itemTypeMappingStatus: 'Valid',
  locationsMappingStatus: 'Valid',
  status: 'Not started',
};

const contributionInProgress = {
  contributionStarted: '2021-09-23T15:58:21.011+00:00',
  contributionStartedBy: 'diku_admin',
  errors: [],
  id: 'c3402202-cf99-4373-8543-47e358432dfb',
  itemTypeMappingStatus: 'Valid',
  jobId: 'a471a791-17dd-4728-88dc-9784cc46064a',
  locationsMappingStatus: 'Valid',
  recordsContributed: 0,
  recordsDecontributed: 0,
  recordsProcessed: 0,
  recordsTotal: 0,
  recordsUpdated: 0,
  status: 'In Progress',
};

const contributionCancelled = {
  ...contributionInProgress,
  status: 'Cancelled',
};

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  currentContribution: {
    GET: jest.fn(() => Promise.resolve(currentContribution)),
  },
  contributionHistory: {
    GET: jest.fn(() => Promise.resolve()),
  },
  initiateContribution: {
    GET: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
  jobs: {
    DELETE: jest.fn(() => Promise.resolve()),
  },
};

const renderManageContributionRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <ManageContributionRoute
      resources={resources}
      mutator={mutator}
      history={createMemoryHistory()}
    />,
    translationsProperties,
  );
};

describe('renderManageContributionRoute component', () => {
  const selectedServer = servers[1];
  const handleServerChange = jest.fn();

  beforeEach(() => {
    ManageContributionView.mockClear();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer,
      serverOptions,
      handleServerChange,
    });
  });

  it('should be rendered', async () => {
    let component;

    await act(async () => {
      component = renderManageContributionRoute();
    });

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    await act(async () => {
      renderManageContributionRoute({ resources: newResources });
    });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    beforeEach(async () => {
      renderManageContributionRoute();
      await act(async () => { await ManageContributionView.mock.calls[1][0].onChangeServer(servers[1].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalled();
    });

    it('should pass the selected server', () => {
      expect(ManageContributionView.mock.calls[3][0].selectedServer).toEqual(servers[1]);
    });
  });

  describe('handleInitiateContribution', () => {
    const newMutator = cloneDeep(mutatorMock);

    newMutator.currentContribution.GET = jest.fn(() => Promise.resolve(contributionInProgress));

    beforeEach(async () => {
      renderManageContributionRoute({ mutator: newMutator });
      await act(async () => { await ManageContributionView.mock.calls[1][0].onChangeServer(servers[1].name); });
      await act(async () => { ManageContributionView.mock.calls[3][0].onInitiateContribution(); });
    });

    it('should trigger an initial contribution', async () => {
      expect(newMutator.initiateContribution.POST).toHaveBeenCalled();
    });

    it('should fetch the current contribution state', async () => {
      expect(newMutator.currentContribution.GET).toHaveBeenCalled();
    });

    it('should fetch the current contribution state', async () => {
      expect(ManageContributionView.mock.calls[5][0].currentContribution).toEqual(contributionInProgress);
    });
  });

  describe('handleCancelContribution', () => {
    const newMutator = cloneDeep(mutatorMock);

    newMutator.currentContribution.GET = jest.fn(() => Promise.resolve(contributionCancelled));

    beforeEach(async () => {
      renderManageContributionRoute({ mutator: newMutator });
      await act(async () => { await ManageContributionView.mock.calls[1][0].onChangeServer(servers[1].name); });
      await act(async () => { ManageContributionView.mock.calls[3][0].onCancelContribution(); });
    });

    it('should be canceled the contribution process', () => {
      expect(newMutator.jobs.DELETE).toHaveBeenCalledWith({ id: contributionCancelled.jobId });
    });

    it('should fetch the current contribution state', () => {
      expect(newMutator.currentContribution.GET).toHaveBeenCalled();
    });
  });
});
