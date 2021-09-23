import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { translationsProperties } from '../../../../test/jest/helpers';
import PatronAgencyCreateEditRoute from './PatronAgencyCreateEditRoute';
import PatronAgencyForm from '../../components/PatronAgency/PatronAgencyForm';
import { useCentralServers } from '../../../hooks';

jest.mock('../../components/PatronAgency/PatronAgencyForm', () => {
  return jest.fn(() => <div>PatronAgencyForm</div>);
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
    id: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
    name: 'Home Library',
    selectField: {
      options: {
        values: [
          {
            id: 'opt_0',
            value: 'Meyer',
          },
          {
            id: 'opt_1',
            value: 'Garnett',
          },
          {
            id: 'opt_2',
            value: 'Barbe',
          }
        ]
      }
    }
  },
  {
    id: 'ce1f650d-cf0a-44c0-b87e-0473eaf825fa',
    name: 'City Library',
    selectField: {
      options: {
        values: [
          {
            id: 'opt_0',
            value: 'Mustache',
          },
          {
            id: 'opt_1',
            value: 'Dostoevsky',
          },
        ]
      }
    }
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

const userCustomFieldMappings = {
  customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
  configuredOptions: {
    qwerty1: '1qwer',
    qwerty2: 'qwer1',
  },
};

const record = {
  customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
  configuredOptions: [
    {
      customFieldValue: 'qwerty1',
      agencyCode: '1qwer'
    },
    {
      customFieldValue: 'qwerty2',
      agencyCode: 'qwer1'
    },
    {
      customFieldValue: 'qwerty3',
      agencyCode: 'qwer3'
    },
  ],
};

const payload = {
  customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
  configuredOptions: {
    qwerty1: '1qwer',
    qwerty2: 'qwer1',
    qwerty3: 'qwer3',
  },
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
  userCustomFieldMappings: {
    GET: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const renderPatronAgencyCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <PatronAgencyCreateEditRoute
      resources={resources}
      mutator={mutator}
      history={createMemoryHistory()}
    />,
    translationsProperties,
  );
};

describe('renderPatronAgencyCreateEditRoute component', () => {
  beforeEach(() => {
    PatronAgencyForm.mockClear();
    useCentralServers.mockClear().mockReturnValue({
      selectedServer: servers[1],
      serverOptions,
      handleServerChange: jest.fn(),
    });
  });

  it('should be rendered', () => {
    const component = renderPatronAgencyCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderPatronAgencyCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('handleServerChange function', () => {
    beforeEach(async () => {
      renderPatronAgencyCreateEditRoute();
      await act(async () => { await PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(PatronAgencyForm.mock.calls[4][0].selectedServer).toEqual(servers[0]);
    });
  });

  describe('handleCustomFieldChange', () => {
    describe('tabular list', () => {
      it('should be without the agency codes', async () => {
        renderPatronAgencyCreateEditRoute();
        await act(async () => { await PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name); });
        await act(async () => { PatronAgencyForm.mock.calls[4][0].onChangeCustomField(customFields[0].id); });
        expect(PatronAgencyForm.mock.calls[5][0].initialValues).toEqual({
          customFieldId: customFields[0].id,
          configuredOptions: [
            { customFieldValue: 'Meyer' },
            { customFieldValue: 'Garnett' },
            { customFieldValue: 'Barbe' },
          ],
        });
      });

      it('should be with agency codes', async () => {
        const newMutator = cloneDeep(mutatorMock);

        newMutator.userCustomFieldMappings.GET = jest.fn(() => Promise.resolve(userCustomFieldMappings));
        renderPatronAgencyCreateEditRoute({ mutator: newMutator });
        await act(async () => { await PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name); });
        await act(async () => { PatronAgencyForm.mock.calls[5][0].onChangeCustomField(customFields[1].id); });
        await act(async () => { PatronAgencyForm.mock.calls[6][0].onChangeCustomField(customFields[0].id); });
        expect(PatronAgencyForm.mock.calls[7][0].initialValues).toEqual({
          customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
          configuredOptions: [
            { customFieldValue: 'Meyer' },
            { customFieldValue: 'Garnett' },
            { customFieldValue: 'Barbe' },
          ],
        });
      });

      it('should be with agency codes too', async () => {
        const newMutator = cloneDeep(mutatorMock);

        newMutator.userCustomFieldMappings.GET = jest.fn(() => Promise.resolve(userCustomFieldMappings));
        await renderPatronAgencyCreateEditRoute({ mutator: newMutator });
        await act(async () => { await PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name); });
        expect(PatronAgencyForm.mock.calls[5][0].initialValues).toEqual({
          customFieldId: 'f72a0b4b-21df-4985-8c9f-0d5c910296c3',
          configuredOptions: [
            { customFieldValue: 'Meyer' },
            { customFieldValue: 'Garnett' },
            { customFieldValue: 'Barbe' },
          ]
        });
      });
    });
  });

  describe('handleSubmit', () => {
    it('should make a POST request', async () => {
      await act(async () => { renderPatronAgencyCreateEditRoute(); });
      await act(async () => { PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { PatronAgencyForm.mock.calls[4][0].onChangeCustomField(customFields[0].id); });
      await act(async () => { PatronAgencyForm.mock.calls[5][0].onSubmit(record); });
      expect(mutatorMock.userCustomFieldMappings.POST).toHaveBeenCalledWith(payload);
    });

    it('should make a PUT request', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.userCustomFieldMappings.GET = jest.fn(() => Promise.resolve(userCustomFieldMappings));
      await renderPatronAgencyCreateEditRoute({ mutator: newMutator });
      await act(async () => {
        await PatronAgencyForm.mock.calls[0][0].onChangeServer(servers[0].name);
        await PatronAgencyForm.mock.calls[1][0].onChangeCustomField(customFields[0].id);
        PatronAgencyForm.mock.calls[3][0].onSubmit(record);
      });
      expect(mutatorMock.userCustomFieldMappings.PUT).toHaveBeenCalledWith(payload);
    });
  });
});
