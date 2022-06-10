import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import PickupLocationsRoute from './PickupLocationsRoute';
import PickupLocationsForm from '../../components/PickupLocations/PickupLocationsForm';

jest.mock('../../components/PickupLocations/PickupLocationsForm', () => {
  return jest.fn(() => <div>PickupLocationsForm</div>);
});

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

const servers = [
  {
    id: '1',
    name: 'testServerName1',
    checkPickupLocation: true,
    metadata: {},
  },
  {
    id: '2',
    name: 'testServerName2',
    checkPickupLocation: false,
    metadata: {},
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
  centralServerRecords: {
    PUT: jest.fn(() => Promise.resolve()),
  },
};

const renderComponent = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history = createMemoryHistory(),
} = {}) => {
  return renderWithIntl(
    <PickupLocationsRoute
      resources={resources}
      mutator={mutator}
      history={history}
    />,
    translationsProperties,
  );
};

describe('PickupLocationsRoute component', () => {
  beforeEach(() => {
    PickupLocationsForm.mockClear();
  });

  it('should display loading', () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderComponent({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('changeServer function', () => {
    beforeEach(async () => {
      renderComponent();
      await act(async () => { PickupLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(PickupLocationsForm.mock.calls[2][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      expect(PickupLocationsForm.mock.calls[2][0].initialValues).toEqual({
        checkPickupLocation: true,
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a PUT request', async () => {
      const record = {
        checkPickupLocation: true,
      };
      const payload = {
        ...servers[0],
        ...record,
      };

      delete payload.metadata;

      renderComponent();
      await act(async () => { PickupLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { PickupLocationsForm.mock.calls[1][0].onSubmit(record); });
      expect(mutatorMock.centralServerRecords.PUT).toHaveBeenCalledWith(payload);
    });
  });
});
