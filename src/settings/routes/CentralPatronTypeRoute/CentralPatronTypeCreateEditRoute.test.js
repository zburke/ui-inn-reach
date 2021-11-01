import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import CentralPatronTypeCreateEditRoute from './CentralPatronTypeCreateEditRoute';
import CentralPatronTypeForm from '../../components/CentralPatronType/CentralPatronTypeForm';

jest.mock('../../components/CentralPatronType/CentralPatronTypeForm', () => {
  return jest.fn(() => <div>CentralPatronTypeForm</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
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

const patronGroups = [
  {
    desc: 'Staff Member',
    expirationOffsetInDays: 730,
    group: 'staff',
    id: '55ca980e-2535-4945-a4f3-d8bd88f9a386',
  },
  {
    desc: 'test desc',
    group: 'testing',
    id: '21a7f3ce-d40d-4fc3-bf25-f1b0bbcb236f',
  },
];

const patronTypes = {
  patronTypeList: [
    {
      centralPatronType: 200,
      description: 'Patron',
    }
  ],
};

const patronTypeMappings = {
  patronTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      patronGroupId: '55ca980e-2535-4945-a4f3-d8bd88f9a386',
      patronType: 202
    },
    {
      id: '6a58f3d5-5933-4941-b3fa-ff6f7395557e',
      patronGroupId: '21a7f3ce-d40d-4fc3-bf25-f1b0bbcb236f',
      patronType: 219,
    },
  ],
};

const record = {
  patronTypeMappings: [
    {
      id: '4922c3e8-28a1-47dd-8856-4ab64f2f54a3',
      patronGroupId: '0fc3f0fc-6c4b-4a4d-8f91-e7fb2c7ce958',
      patronGroupLabel: 'Faculty Member',
      patronType: '201'
    },
    {
      id: '8fe7a430-bc20-4fdd-af42-b20b059b773b',
      patronGroupId: 'eaa226d0-8e57-44e2-b590-eda9d56adb7d',
      patronGroupLabel: 'Graduate Student',
      patronType: '219',
    },
  ],
};

const payload = {
  patronTypeMappings: [
    {
      id: '4922c3e8-28a1-47dd-8856-4ab64f2f54a3',
      patronGroupId: '0fc3f0fc-6c4b-4a4d-8f91-e7fb2c7ce958',
      patronType: 201,
    },
    {
      id: '8fe7a430-bc20-4fdd-af42-b20b059b773b',
      patronGroupId: 'eaa226d0-8e57-44e2-b590-eda9d56adb7d',
      patronType: 219,
    },
  ],
};

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
  patronGroups: {
    records: [{ usergroups: patronGroups }],
    isPending: false,
    hasLoaded: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  patronTypeMappings: {
    GET: jest.fn(() => Promise.resolve(patronTypeMappings)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  patronTypes: {
    GET: jest.fn(() => Promise.resolve(patronTypes)),
  },
};

const renderCentralPatronTypeCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <CentralPatronTypeCreateEditRoute
      resources={resources}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('renderCentralPatronTypeCreateEditRoute component', () => {
  beforeEach(() => {
    CentralPatronTypeForm.mockClear();
  });

  it('should be rendered', () => {
    const component = renderCentralPatronTypeCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderCentralPatronTypeCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    beforeEach(async () => {
      renderCentralPatronTypeCreateEditRoute();
      await act(async () => { await CentralPatronTypeForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(CentralPatronTypeForm.mock.calls[7][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      expect(CentralPatronTypeForm.mock.calls[7][0].initialValues).toEqual({
        patronTypeMappings: [
          {
            patronType: '202',
            patronGroupId: '55ca980e-2535-4945-a4f3-d8bd88f9a386',
            patronGroupLabel: 'staff',
            id: '508657aa-927a-4515-91d8-a4e7a759b3db'
          },
          {
            patronType: '219',
            patronGroupId: '21a7f3ce-d40d-4fc3-bf25-f1b0bbcb236f',
            patronGroupLabel: 'testing',
            id: '6a58f3d5-5933-4941-b3fa-ff6f7395557e'
          }
        ],
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a PUT request', async () => {
      renderCentralPatronTypeCreateEditRoute();
      await act(async () => { await CentralPatronTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => { await CentralPatronTypeForm.mock.calls[7][0].onSubmit(record); });
      expect(mutatorMock.patronTypeMappings.PUT).toHaveBeenCalledWith(payload);
    });
  });

  describe('banner', () => {
    it('should be visible', async () => {
      const newMutatorMock = cloneDeep(mutatorMock);

      newMutatorMock.patronTypes.GET = jest.fn(() => Promise.reject());
      renderCentralPatronTypeCreateEditRoute({ mutator: newMutatorMock });
      await act(async () => { await CentralPatronTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(CentralPatronTypeForm.mock.calls[8][0].patronTypesFailed).toBeTruthy();
    });

    it('should be invisible', async () => {
      renderCentralPatronTypeCreateEditRoute();
      await act(async () => { await CentralPatronTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(CentralPatronTypeForm.mock.calls[7][0].patronTypesFailed).toBeFalsy();
    });
  });
});
