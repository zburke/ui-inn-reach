import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  act,
  waitFor,
} from '@testing-library/react';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { translationsProperties } from '../../../../test/jest/helpers';
import CentralServersConfigurationCreateEditContainer from './CentralServersConfigurationCreateEditContainer';
import {
  downloadJsonFile,
  getCentralServerConfigurationViewUrl,
} from '../../../utils';
import CentralServersConfigurationEditRoute from './CentralServersConfigurationEditRoute';
import { CentralServersConfigurationContext } from '../../../contexts';

const data = {
  folioLibraries: [
    {
      code: 'PERK',
      id: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3',
      name: 'Bostock',
    },
  ],
};

const record = {
  id: '12345',
  name: 'Andromeda',
  localServerCode: 'tandr',
  loanTypeId: 'e17acc08-b8ca-469a-a984-d9249faad178',
  centralServerAddress: 'https://opentown-lib.edu/andromeda',
  centralServerKey: '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d',
  centralServerSecret: '6ed636c9-eeff-4473-86bd-618430075c25',
  localAgencies: [
    {
      id: '111',
      code: 'PERK',
      folioLibraryIds: ['c3c85d4c-e6fc-4905-bd12-abfa730584e3'],
    },
  ],
  localServerKey: '232c29b8-d94d-4511-9110-00d5b31b7ff1',
  localServerSecret: 'b48a846a-0722-4e28-babb-2c245114fc72',
  description: 'some description',
};

const values = {
  ...record,
  localAgencies: [
    {
      id: '111',
      localAgency: 'PERK',
      FOLIOLibraries: [
        {
          id: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3',
          label: 'Bostock',
          value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3',
        },
      ],
    },
  ],
};

jest.mock('./CentralServersConfigurationCreateEditContainer', () => {
  return jest.fn(() => 'CentralServersConfigurationCreateEditContainer');
});

jest.mock('@folio/stripes-components/lib/Loading/LoadingPane', () => {
  return jest.fn(() => 'LoadingPane');
});

jest.mock('../../components/common/EntityNotFound', () => {
  return jest.fn(() => 'EntityNotFound');
});

jest.mock('../../../utils', () => {
  const downloadJsonFileModule = jest.requireActual('../../../utils/downloadJsonFile');
  const routingModule = jest.requireActual('../../../utils/routing');

  jest.spyOn(downloadJsonFileModule, 'downloadJsonFile');
  jest.spyOn(routingModule, 'getCentralServerConfigurationViewUrl');

  return {
    ...downloadJsonFileModule,
    ...routingModule,
  };
});

const renderEditRoute = ({
  history = {
    action: 'PUSH',
    block: jest.fn(() => () => {}),
    createHref: jest.fn(),
    go: jest.fn(),
    listen: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    location: {
      hash: '',
      pathname: '',
      search: '',
    },
  },
  match = {
    params: { id: 12 },
    path: '',
    url: '',
  },
  resources = {
    centralServerRecord: {
      isPending: false,
      failed: false,
      records: [record],
    },
  },
  mutator = {},
} = {}) => (
  renderWithIntl(
    <MemoryRouter>
      <CentralServersConfigurationContext.Provider value={data}>
        <CentralServersConfigurationEditRoute
          match={match}
          resources={resources}
          mutator={mutator}
          history={history}
        />
      </CentralServersConfigurationContext.Provider>
    </MemoryRouter>,
    translationsProperties
  )
);

describe('CentralServersConfigurationEditRoute component', () => {
  beforeEach(() => {
    CentralServersConfigurationCreateEditContainer.mockClear();
  });

  it('should display CentralServersConfigurationCreateEditContainer', () => {
    const { getByText } = renderEditRoute();

    expect(getByText('CentralServersConfigurationCreateEditContainer')).toBeDefined();
  });

  it('should load central server record on first render', () => {
    renderEditRoute();

    expect(CentralServersConfigurationCreateEditContainer.mock.calls[1][0]).toHaveProperty('initialValues', values);
  });

  it('should render the LoadingPane component while loading central server record', () => {
    const { getByText } = renderEditRoute({
      resources: {
        centralServerRecord: {
          records: [],
          isPending: true,
        },
      },
    });

    expect(getByText('LoadingPane')).toBeDefined();
  });

  it('should render the EntityNotFound component when the central server record fails to load', () => {
    const { getByText } = renderEditRoute({
      resources: {
        centralServerRecord: {
          records: [],
          failed: true,
        },
      },
    });

    expect(getByText('EntityNotFound')).toBeDefined();
  });

  describe('handleUpdateRecord', () => {
    it('should be passed as onSubmit prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit).toBeDefined();
    });

    it('should make a successful PUT request', async () => {
      const putMock = jest.fn(() => Promise.resolve());

      renderEditRoute({
        mutator: {
          centralServerRecord: {
            PUT: putMock,
          },
        },
      });

      await CentralServersConfigurationCreateEditContainer.mock.calls[1][0].onSubmit(values);

      expect(putMock).toHaveBeenCalled();
      expect(downloadJsonFile).not.toHaveBeenCalled();
      expect(getCentralServerConfigurationViewUrl).toHaveBeenCalled();

      downloadJsonFile.mockRestore();
      getCentralServerConfigurationViewUrl.mockRestore();
    });

    it('should not call downloadJsonFile or nav if PUT fails', async () => {
      const error = new Error();
      const putMock = jest.fn(() => Promise.reject(error));

      error.status = 400;

      renderEditRoute({
        mutator: {
          centralServerRecord: {
            PUT: putMock,
          },
        },
      });

      await CentralServersConfigurationCreateEditContainer.mock.calls[1][0].onSubmit(values);

      expect(putMock).toHaveBeenCalled();
      expect(downloadJsonFile).not.toHaveBeenCalled();
      expect(getCentralServerConfigurationViewUrl).not.toHaveBeenCalled();

      downloadJsonFile.mockRestore();
      getCentralServerConfigurationViewUrl.mockRestore();
    });
  });

  describe('navigateToView', () => {
    it('should be passed as onFormCancel prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onFormCancel).toBeDefined();
    });

    it('should be called', () => {
      renderEditRoute();

      CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onFormCancel();
      expect(getCentralServerConfigurationViewUrl).toHaveBeenCalled();
      getCentralServerConfigurationViewUrl.mockRestore();
    });
  });

  describe('handleModalCancel', () => {
    it('should be passed as onModalCancel prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onModalCancel).toBeDefined();
    });

    describe('PUT request', () => {
      const putMock = jest.fn(() => Promise.resolve());
      const newLocalServerData = { localServerKey: 'key', localServerSecret: 'secret' };
      const valuesWithChangedLocalServerKeyPair = { ...values, ...newLocalServerData };
      const fileName = `${values.name}-local-server-keypair`;

      beforeEach(async () => {
        renderEditRoute({
          mutator: {
            centralServerRecord: {
              PUT: putMock,
            },
          },
        });

        await waitFor(() => {
          CentralServersConfigurationCreateEditContainer.mock.calls[0][0].saveLocalServerKeypair(newLocalServerData);
          CentralServersConfigurationCreateEditContainer.mock.calls[1][0].onSubmit(valuesWithChangedLocalServerKeyPair);
          CentralServersConfigurationCreateEditContainer.mock.calls[3][0].onModalConfirm();
        });
      });

      it('should be called', () => {
        expect(putMock).toHaveBeenCalled();
      });

      it('should call downloadJsonFile with correct props', () => {
        expect(downloadJsonFile).toHaveBeenCalledWith(newLocalServerData, fileName);
        downloadJsonFile.mockRestore();
      });

      it('should call getCentralServerConfigurationViewUrl', () => {
        expect(getCentralServerConfigurationViewUrl).toHaveBeenCalled();
        getCentralServerConfigurationViewUrl.mockRestore();
      });
    });
  });

  describe('handleModalConfirm', () => {
    it('should be passed as onModalConfirm prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onModalConfirm).toBeDefined();
    });
  });

  describe('handleModalCancel', () => {
    it('should be passed as onModalCancel prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onModalCancel).toBeDefined();
    });

    it('should close modal', async () => {
      renderEditRoute();

      await waitFor(() => CentralServersConfigurationCreateEditContainer.mock.calls[1][0].onModalCancel());
      expect(CentralServersConfigurationCreateEditContainer.mock.calls[2][0]).toHaveProperty('openModal', false);
    });
  });

  describe('changeIsLocalServerToPrevValue', () => {
    it('should be passed as changeIsLocalServerToPrevValue prop', () => {
      renderEditRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].changeIsLocalServerToPrevValue).toBeDefined();
    });

    it('should pass correct props to CentralServersConfigurationCreateEditContainer after call', () => {
      renderEditRoute();

      act(() => {
        CentralServersConfigurationCreateEditContainer.mock.calls[0][0].changeIsLocalServerToPrevValue(true);
      });

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[2][0]).toHaveProperty('isLocalServerToPrevValue', true);
    });
  });
});
