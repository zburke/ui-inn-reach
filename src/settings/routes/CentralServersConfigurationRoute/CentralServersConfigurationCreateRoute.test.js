import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  act,
} from '@testing-library/react';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { translationsProperties } from '../../../../test/jest/helpers';
import CentralServersConfigurationCreateRoute from './CentralServersConfigurationCreateRoute';
import CentralServersConfigurationCreateEditContainer from './CentralServersConfigurationCreateEditContainer';
import {
  downloadJsonFile,
  getCentralServerConfigurationListUrl,
} from '../../../utils';
import { useCallout } from '../../../hooks';

const record = {
  id: '12345',
  name: 'Andromeda',
  localServerCode: 'tandr',
  loanTypeId: 'e17acc08-b8ca-469a-a984-d9249faad178',
  centralServerAddress: 'https://opentown-lib.edu/andromeda',
  centralServerKey: '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d',
  centralServerSecret: '6ed636c9-eeff-4473-86bd-618430075c25',
  localAgencies: [{ localAgency: 'tgala', FOLIOLibraries: [{ label: 'Bostock', value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3' }] }],
  localServerKey: '232c29b8-d94d-4511-9110-00d5b31b7ff1',
  localServerSecret: 'b48a846a-0722-4e28-babb-2c245114fc72',
  description: 'some description',
};

jest.mock('./CentralServersConfigurationCreateEditContainer', () => {
  return jest.fn(() => 'CentralServersConfigurationCreateEditContainer');
});

jest.mock('../../../hooks/useCallout', () => jest.fn(() => () => 'error'));

jest.mock('../../../utils', () => {
  const downloadJsonFileModule = jest.requireActual('../../../utils/downloadJsonFile');
  const routingModule = jest.requireActual('../../../utils/routing');

  jest.spyOn(downloadJsonFileModule, 'downloadJsonFile');
  jest.spyOn(routingModule, 'getCentralServerConfigurationListUrl');

  return {
    ...downloadJsonFileModule,
    ...routingModule,
  };
});

const renderCreateRoute = ({
  mutator = {},
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
} = {}) => (
  renderWithIntl(
    <MemoryRouter>
      <CentralServersConfigurationCreateRoute
        mutator={mutator}
        history={history}
      />
    </MemoryRouter>,
    translationsProperties,
  )
);

describe('CentralServersConfigurationCreateRoute component', () => {
  beforeEach(() => {
    CentralServersConfigurationCreateEditContainer.mockClear();
  });

  it('should display CentralServersConfigurationCreateEditContainer', () => {
    const { getByText } = renderCreateRoute();

    expect(getByText('CentralServersConfigurationCreateEditContainer')).toBeDefined();
  });

  describe('handleCreateRecord', () => {
    it('should be passed as submit prop', () => {
      renderCreateRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit).toBeDefined();
    });

    describe('successful POST request', () => {
      const postMock = jest.fn(() => Promise.resolve());

      beforeEach(() => {
        renderCreateRoute({
          mutator: {
            centralServerRecords: {
              POST: postMock,
            },
          },
        });
      });

      it('should be called', async () => {
        await CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit(record);
        expect(postMock).toHaveBeenCalled();
      });

      it('should download JSON file', async () => {
        await CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit(record);
        expect(downloadJsonFile).toHaveBeenCalled();
        downloadJsonFile.mockRestore();
      });

      it('should not download JSON file', async () => {
        const recordWithoutLocalServer = {
          ...record,
          localServerKey: '',
          localServerSecret: '',
        };

        await CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit(recordWithoutLocalServer);
        expect(downloadJsonFile).not.toHaveBeenCalled();
        downloadJsonFile.mockRestore();
      });
    });

    describe('POST with error number 400', () => {
      const error = new Error();
      const postMock = jest.fn(() => Promise.reject(error));

      error.status = 400;

      beforeEach(() => {
        renderCreateRoute({
          mutator: {
            centralServerRecords: {
              POST: postMock,
            },
          },
        });
      });
    });

    describe('POST with error number not 400', () => {
      it('should engender an error callout', () => {
        const error = new Error();
        const postMock = jest.fn(() => Promise.reject(error));

        error.status = 500;

        renderCreateRoute({
          mutator: {
            centralServerRecords: {
              POST: postMock,
            },
          },
        });

        act(() => CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onSubmit(record));
        expect(useCallout.mock.results[0].value()).toEqual('error');
      });
    });
  });

  describe('navigateToList', () => {
    it('should be passed as onFormCancel prop', () => {
      renderCreateRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onFormCancel).toBeDefined();
    });

    it('should be called', () => {
      renderCreateRoute();

      CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onFormCancel();
      expect(getCentralServerConfigurationListUrl).toHaveBeenCalled();
      getCentralServerConfigurationListUrl.mockRestore();
    });
  });

  describe('handleModalConfirm', () => {
    it('should be passed as onModalConfirm prop', () => {
      renderCreateRoute();

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onModalConfirm).toBeDefined();
    });

    it('should pass correct props to CentralServersConfigurationCreateEditContainer after call', () => {
      renderCreateRoute();

      act(() => {
        CentralServersConfigurationCreateEditContainer.mock.calls[0][0].onModalConfirm();
      });

      expect(CentralServersConfigurationCreateEditContainer.mock.calls[0][0]).toHaveProperty('openModal', false);
    });
  });
});
