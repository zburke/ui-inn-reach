import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import FolioCirculationUserCreateEditRoute from './FolioCirculationUserCreateEditRoute';
import FolioCirculationUserForm from '../../components/FolioCirculationUser/FolioCirculationUserForm';

jest.mock('../../components/FolioCirculationUser/FolioCirculationUserForm', () => {
  return jest.fn(() => <div>FolioCirculationUserForm</div>);
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

const innReachPatronTypes = {
  patronTypeList: [
    {
      centralPatronType: 200,
      description: 'Patron',
    },
    {
      centralPatronType: 201,
      description: 'Staff',
    },
  ],
};

const centralPatronTypeMappings = {
  centralPatronTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      centralPatronType: 200,
      barcode: '1630029773640558945'
    },
    {
      id: '6a58f3d5-5933-4941-b3fa-ff6f7395557e',
      centralPatronType: 201,
      barcode: '111111'
    },
  ],
};

const record = {
  centralPatronTypeMappings: [
    {
      barcode: '1630029773640558945',
      centralPatronType: 200,
      centralPatronTypeLabel: '200 (Patron)',
    },
    {
      barcode: '111111',
      centralPatronType: 201,
      centralPatronTypeLabel: '201 (Staff)',
    },
  ],
};

const payload = {
  centralPatronTypeMappings: [
    {
      barcode: '1630029773640558945',
      centralPatronType: 200,
    },
    {
      barcode: '111111',
      centralPatronType: 201,
    },
  ],
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
  centralPatronTypeMappings: {
    GET: jest.fn(() => Promise.resolve(centralPatronTypeMappings)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  innReachPatronTypes: {
    GET: jest.fn(() => Promise.resolve(innReachPatronTypes)),
  },
};

const renderFolioCirculationUserCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <FolioCirculationUserCreateEditRoute
      resources={resources}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('renderFolioCirculationUserCreateEditRoute component', () => {
  beforeEach(() => {
    FolioCirculationUserForm.mockClear();
  });

  it('should be rendered', () => {
    const component = renderFolioCirculationUserCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderFolioCirculationUserCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    beforeEach(async () => {
      renderFolioCirculationUserCreateEditRoute();
      await act(async () => { await FolioCirculationUserForm.mock.calls[1][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(FolioCirculationUserForm.mock.calls[7][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      expect(FolioCirculationUserForm.mock.calls[7][0].initialValues).toEqual({
        centralPatronTypeMappings: [
          {
            id: '508657aa-927a-4515-91d8-a4e7a759b3db',
            barcode: '1630029773640558945',
            centralPatronType: 200,
            centralPatronTypeLabel: '200 (Patron)',
          },
          {
            id: '6a58f3d5-5933-4941-b3fa-ff6f7395557e',
            barcode: '111111',
            centralPatronType: 201,
            centralPatronTypeLabel: '201 (Staff)',
          },
        ],
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a PUT request', async () => {
      renderFolioCirculationUserCreateEditRoute();
      await act(async () => { await FolioCirculationUserForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioCirculationUserForm.mock.calls[7][0].onSubmit(record); });
      expect(mutatorMock.centralPatronTypeMappings.PUT).toHaveBeenCalledWith(payload);
    });
  });

  describe('banner', () => {
    it('should be visible', async () => {
      const newMutatorMock = cloneDeep(mutatorMock);

      newMutatorMock.innReachPatronTypes.GET = jest.fn(() => Promise.reject());
      renderFolioCirculationUserCreateEditRoute({ mutator: newMutatorMock });
      await act(async () => { await FolioCirculationUserForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(FolioCirculationUserForm.mock.calls[8][0].innReachPatronTypesFailed).toBeTruthy();
    });

    it('should be invisible', async () => {
      renderFolioCirculationUserCreateEditRoute();
      await act(async () => { await FolioCirculationUserForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(FolioCirculationUserForm.mock.calls[7][0].innReachPatronTypesFailed).toBeFalsy();
    });
  });
});
