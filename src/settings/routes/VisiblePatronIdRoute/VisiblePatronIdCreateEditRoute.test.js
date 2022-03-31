import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import VisiblePatronIdCreateEditRoute from './VisiblePatronIdCreateEditRoute';
import VisiblePatronIdForm from '../../components/VisiblePatronId/VisiblePatronIdForm';
import { useCentralServers } from '../../../hooks';

jest.mock('../../components/VisiblePatronId/VisiblePatronIdForm', () => {
  return jest.fn(() => <div>VisiblePatronIdForm</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue({}),
}));

const customFields = [
  {
    entityType: 'user',
    refId: 'textArea',
    name: 'Text Area',
    type: 'TEXTBOX_LONG',
  },
  {
    entityType: 'user',
    refId: 'visiblePatronId',
    name: 'Visible patron ID',
    type: 'TEXTBOX_SHORT',
  }
];

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  useCustomFields: jest.fn().mockReturnValue([customFields]),
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
  BARCODE: true,
  EXTERNAL_SYSTEM_ID: true,
  FOLIO_RECORD_NUMBER: true,
  USERNAME: true,
  custom: [{
    'label': 'Visible patron ID',
    'value': 'visiblePatronId',
  }],
};

const payload = {
  fields: ['USER_CUSTOM_FIELDS', 'BARCODE', 'EXTERNAL_SYSTEM_ID', 'FOLIO_RECORD_NUMBER', 'USERNAME'],
  userCustomFields: ['visiblePatronId'],
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
  visiblePatronIdConfiguration: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const renderVisiblePatronIdCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <VisiblePatronIdCreateEditRoute
      resources={resources}
      mutator={mutator}
      history={createMemoryHistory()}
    />,
    translationsProperties,
  );
};

describe('renderVisiblePatronIdCreateEditRoute component', () => {
  beforeEach(() => {
    VisiblePatronIdForm.mockClear();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer: servers[1],
      serverOptions,
      handleServerChange: jest.fn(),
    });
  });

  it('should be rendered', () => {
    const component = renderVisiblePatronIdCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderVisiblePatronIdCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    const newMutator = cloneDeep(mutatorMock);

    newMutator.visiblePatronIdConfiguration.GET = jest.fn(() => Promise.resolve(payload));

    beforeEach(async () => {
      renderVisiblePatronIdCreateEditRoute({ mutator: newMutator });
      await act(async () => { await VisiblePatronIdForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(VisiblePatronIdForm.mock.calls[4][0].selectedServer).toEqual(servers[0]);
    });

    it('should produce correct initial values', () => {
      expect(VisiblePatronIdForm.mock.calls[5][0].initialValues).toEqual(record);
    });
  });

  describe('handleSubmit', () => {
    it('should make a POST request', async () => {
      await act(async () => { renderVisiblePatronIdCreateEditRoute(); });
      await act(async () => { VisiblePatronIdForm.mock.calls[0][0].onSubmit(record); });
      expect(mutatorMock.visiblePatronIdConfiguration.POST).toHaveBeenCalledWith(payload);
    });

    it('should make a PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.visiblePatronIdConfiguration.GET = jest.fn(() => Promise.resolve(payload));
      await act(async () => { renderVisiblePatronIdCreateEditRoute({ mutator: newMutator }); });
      await act(async () => { VisiblePatronIdForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { VisiblePatronIdForm.mock.calls[5][0].onSubmit(record); });
      expect(mutatorMock.visiblePatronIdConfiguration.PUT).toHaveBeenCalledWith(payload);
    });
  });
});
