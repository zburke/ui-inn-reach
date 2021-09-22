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
    GET: jest.fn(() => Promise.resolve()),
  },
  contributionHistory: {
    GET: jest.fn(() => Promise.resolve()),
  },
  initiateContribution: {
    GET: jest.fn(() => Promise.resolve()),
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
});
