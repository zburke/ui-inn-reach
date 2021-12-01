import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import InnReachRecallUserRoute from './InnReachRecallUserCreateEditRoute';
import InnReachRecallUserForm from '../../components/InnReachRecallUser/InnReachRecallUserForm';
import { useCentralServers } from '../../../hooks';

jest.mock('../../components/InnReachRecallUser/InnReachRecallUserForm', () => {
  return jest.fn(() => <div>InnReachRecallUserForm</div>);
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
    localAgencies: [
      { code: '1qwer' },
      { code: 'qwer1' },
    ],
  },
  {
    id: '2',
    name: 'testServerName2',
    localAgencies: [
      { code: '2qwer' },
      { code: 'qwer2' },
    ],
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

const record = {
  userId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
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
  innReachRecallUser: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
  users: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const renderInnReachRecallUserCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <InnReachRecallUserRoute
      resources={resources}
      mutator={mutator}
      history={createMemoryHistory()}
    />,
    translationsProperties,
  );
};

describe('renderInnReachRecallUserCreateEditRoute component', () => {
  beforeEach(() => {
    InnReachRecallUserForm.mockClear();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer: servers[1],
      serverOptions,
      handleServerChange: jest.fn(),
    });
  });

  it('should be rendered', () => {
    const component = renderInnReachRecallUserCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderInnReachRecallUserCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    const newMutator = cloneDeep(mutatorMock);

    newMutator.innReachRecallUser.GET = jest.fn(() => Promise.resolve(record));

    beforeEach(async () => {
      renderInnReachRecallUserCreateEditRoute({ mutator: newMutator });
      await act(async () => { await InnReachRecallUserForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(InnReachRecallUserForm.mock.calls[4][0].selectedServer).toEqual(servers[0]);
    });

    it('should retrieve user id', () => {
      expect(InnReachRecallUserForm.mock.calls[5][0].initialValues).toEqual(record);
    });
  });

  describe('handleSubmit', () => {
    it('should make a POST request', async () => {
      await act(async () => { renderInnReachRecallUserCreateEditRoute(); });
      await act(async () => { InnReachRecallUserForm.mock.calls[0][0].onSubmit(record); });
      expect(mutatorMock.innReachRecallUser.POST).toHaveBeenCalledWith(record);
    });

    it('should make a PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.innReachRecallUser.GET = jest.fn(() => Promise.resolve(record));
      await act(async () => { renderInnReachRecallUserCreateEditRoute({ mutator: newMutator }); });
      await act(async () => { InnReachRecallUserForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { InnReachRecallUserForm.mock.calls[5][0].onSubmit(record); });
      expect(mutatorMock.innReachRecallUser.PUT).toHaveBeenCalledWith(record);
    });
  });
});
