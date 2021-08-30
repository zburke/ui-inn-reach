import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import CentralItemTypeCreateEditRoute from './CentralItemTypeCreateEditRoute';
import CentralItemTypeForm from '../../components/CentralItemType/CentralItemTypeForm';

jest.mock('../../components/CentralItemType/CentralItemTypeForm', () => {
  return jest.fn(() => <div>CentralItemTypeForm</div>);
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

const materialTypes = [
  {
    id: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
    name: 'test mtype 1',
    source: 'local',
  },
  {
    id: '9d405941-7294-4e71-b5ed-9216bc5a739d',
    name: 'test mtype 2',
    source: 'local',
  },
  {
    id: 'b1394eea-2609-4ff4-9380-b3b09b5492d3',
    name: 'test mtype 3',
    source: 'local',
  },
];

const innReachItemTypes = {
  itemTypeList: [
    {
      centralItemType: 200,
      description: 'Book',
    }
  ],
};

const itemTypeMappings = {
  itemTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      materialTypeId: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
      itemType: 200
    },
  ],
};

const record = {
  itemTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      materialTypeId: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
      itemTypeLabel: '200 (Book)',
      itemType: 200,
    },
  ],
};

const payload = {
  itemTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      materialTypeId: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
      itemType: 200,
    },
  ],
};

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
  materialTypes: {
    records: [{ mtypes: materialTypes }],
    isPending: false,
    hasLoaded: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  itemTypeMappings: {
    GET: jest.fn(() => Promise.resolve(itemTypeMappings)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  innReachItemTypes: {
    GET: jest.fn(() => Promise.resolve(innReachItemTypes)),
  },
};

const renderCentralItemTypeCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <CentralItemTypeCreateEditRoute
      resources={resources}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('renderCentralItemTypeCreateEditRoute component', () => {
  beforeEach(() => {
    CentralItemTypeForm.mockClear();
  });

  it('should be rendered', () => {
    const component = renderCentralItemTypeCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderCentralItemTypeCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    beforeEach(async () => {
      renderCentralItemTypeCreateEditRoute();
      await act(async () => { await CentralItemTypeForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(CentralItemTypeForm.mock.calls[7][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      expect(CentralItemTypeForm.mock.calls[7][0].initialValues).toEqual({
        itemTypeMappings: [
          {
            id: '508657aa-927a-4515-91d8-a4e7a759b3db',
            materialTypeId: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
            itemType: 200,
            itemTypeLabel: '200 (Book)',
          },
        ],
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a PUT request', async () => {
      renderCentralItemTypeCreateEditRoute();
      await act(async () => { await CentralItemTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => { await CentralItemTypeForm.mock.calls[7][0].onSubmit(record); });
      expect(mutatorMock.itemTypeMappings.PUT).toHaveBeenCalledWith(payload);
    });
  });

  describe('banner', () => {
    it('should be visible', async () => {
      const newMutatorMock = cloneDeep(mutatorMock);

      newMutatorMock.innReachItemTypes.GET = jest.fn(() => Promise.reject());
      renderCentralItemTypeCreateEditRoute({ mutator: newMutatorMock });
      await act(async () => { await CentralItemTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(CentralItemTypeForm.mock.calls[8][0].innReachItemTypesFailed).toBeTruthy();
    });

    it('should be invisible', async () => {
      renderCentralItemTypeCreateEditRoute();
      await act(async () => { await CentralItemTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(CentralItemTypeForm.mock.calls[7][0].innReachItemTypesFailed).toBeFalsy();
    });
  });
});
