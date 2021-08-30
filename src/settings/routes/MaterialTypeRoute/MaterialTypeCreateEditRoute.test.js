import React from 'react';
import { cloneDeep } from 'lodash';

import { createMemoryHistory } from 'history';
import { waitFor, screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { translationsProperties } from '../../../../test/jest/helpers';
import MaterialTypeCreateEditRoute from './MaterialTypeCreateEditRoute';
import MaterialTypeForm from '../../components/MaterialType/MaterialTypeForm';
import { useCentralServers } from '../../../hooks';

jest.mock('../../components/MaterialType/MaterialTypeForm', () => {
  return jest.fn(() => <div>MaterialTypeForm</div>);
});

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue({}),
}));

jest.mock('@folio/stripes-components', () => ({
  ConfirmationModal: jest.fn(() => 'ConfirmationModal'),
  LoadingPane: jest.fn(() => 'LoadingPane'),
}));

const materialTypes = [
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    name: 'testMaterialType1',
  },
  {
    id: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    name: 'testMaterialType2',
  }
];

const materialTypeMappings = [
  {
    materialTypeId: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffa',
    centralItemType: 202
  },
  {
    materialTypeId: '7a82f404-07df-4e5e-8e8f-a15f3b6ddffb',
    centralItemType: 211
  },
];

const centralItemTypes = [
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    centralItemType: 202,
    description: 'test1'
  },
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    centralItemType: 211,
    description: 'test2'
  }
];

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
  selectedServerId: servers[1].id,
  centralServerRecords: {
    records: servers,
    isPending: false,
  },
  materialTypes: {
    records: [{ mtypes: materialTypes }],
  },
  innReachItemTypes: {
    records: [{ itemTypeList: centralItemTypes }],
  },
  materialTypeMappings: {
    records: [{ materialTypeMapping: materialTypeMappings }],
  }
};

const innReachItemTypes = {
  itemTypeList: [
    {
      centralItemType: 200,
      description: 'Book',
    }
  ],
};

const putMock = jest.fn(() => Promise.resolve());
const getMock = jest.fn(() => Promise.resolve());
const replaceMock = jest.fn();

const mutatorMock = {
  selectedServerId: {
    replace: replaceMock,
  },
  materialTypeMappings: {
    GET: getMock,
    PUT: putMock,
  },
  innReachItemTypes: {
    GET: jest.fn(() => Promise.resolve(innReachItemTypes)),
  },
};

const renderMaterialTypesCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history,
} = {}) => {
  return renderWithIntl(
    <MaterialTypeCreateEditRoute
      history={history}
      mutator={mutator}
      resources={resources}
    />,
    translationsProperties,
  );
};

describe('MaterialTypeCreateEditRoute component', () => {
  const selectedServer = servers[1];
  const openModal = false;
  const isResetForm = false;
  const isPristine = false;
  const changePristineState = jest.fn();
  const changeFormResetState = jest.fn();
  const handleServerChange = jest.fn();
  const handleModalConfirm = jest.fn();
  const handleModalCancel = jest.fn();
  let history;

  beforeEach(() => {
    ConfirmationModal.mockClear();
    MaterialTypeForm.mockClear();
    history = createMemoryHistory();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer,
      openModal,
      isResetForm,
      isPristine,
      serverOptions,
      changePristineState,
      changeFormResetState,
      handleServerChange,
      handleModalConfirm,
      handleModalCancel,
    });
  });

  it('should be rendered', async () => {
    let component;

    await waitFor(() => {
      component = renderMaterialTypesCreateEditRoute({ history });
    });
    expect(component).toBeDefined();
  });

  it('should call GET', async () => {
    await waitFor(() => {
      renderMaterialTypesCreateEditRoute({ history });
    });
    expect(replaceMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalled();
  });

  describe('MaterialTypeForm', () => {
    it('should be rendered', async () => {
      await waitFor(() => {
        renderMaterialTypesCreateEditRoute({ history });
      });
      expect(screen.getByText('MaterialTypeForm')).toBeVisible();
    });
  });

  describe('banner', () => {
    it('should be visible', async () => {
      const newMutatorMock = cloneDeep(mutatorMock);

      newMutatorMock.innReachItemTypes.GET = jest.fn(() => Promise.reject());
      renderMaterialTypesCreateEditRoute({
        history,
        mutator: newMutatorMock,
      });
      await act(async () => { await MaterialTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(MaterialTypeForm.mock.calls[6][0].innReachItemTypesFailed).toBeTruthy();
    });

    it('should be invisible', async () => {
      renderMaterialTypesCreateEditRoute({ history });
      await act(async () => { await MaterialTypeForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      expect(MaterialTypeForm.mock.calls[5][0].innReachItemTypesFailed).toBeFalsy();
    });
  });
});
