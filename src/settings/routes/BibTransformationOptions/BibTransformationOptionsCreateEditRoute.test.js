import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import BibTransformationOptionsCreateEditRoute from './BibTransformationOptionsCreateEditRoute';
import BibTransformationOptionsForm from '../../components/BibTransformationOptions/BibTransformationOptionsForm';

jest.mock('../../components/BibTransformationOptions/BibTransformationOptionsForm', () => {
  return jest.fn(() => <div>BibTransformationOptionsForm</div>);
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

const identifierTypes = [
  {
    id: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
    name: 'ASIN',
    source: 'local',
  },
  {
    id: 'e7bb3f98-5229-44dc-9da2-08bcfc67020a',
    name: 'LCCN',
    source: 'local',
  },
];

const record = {
  modifiedFieldsForContributedRecords: [
    {
      resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
      stripPrefix: true,
      ignorePrefixes: ', FOO, fod,LC,,is',
    },
    {
      resourceIdentifierTypeId: 'e7bb3f98-5229-44dc-9da2-08bcfc67020a',
      stripPrefix: false,
      ignorePrefixes: 'LC,is',
    }
  ],
  excludedMARCFields: ', 856$z,945',
};

const finalRecord = {
  configIsActive: true,
  modifiedFieldsForContributedRecords: [
    {
      resourceIdentifierTypeId: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
      stripPrefix: true,
      ignorePrefixes: ['FOO', 'fod', 'LC', 'is'],
    },
    {
      resourceIdentifierTypeId: 'e7bb3f98-5229-44dc-9da2-08bcfc67020a',
      stripPrefix: false,
      ignorePrefixes: ['LC', 'is'],
    }
  ],
  excludedMARCFields: ['856$z', '945'],
};

const marcTransformationOptions = {
  id: 'fd272329-3956-4890-bdc2-3aae220689f1',
  ...finalRecord,
};

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
  identifierTypes: {
    records: [{ identifierTypes }],
    isPending: false,
    hasLoaded: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  marcTransformationOptions: {
    GET: jest.fn(() => Promise.resolve(marcTransformationOptions)),
    POST: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
  },
};

const renderBibTransformationOptionsCreateEditRoute = ({
  resources = resourcesMock,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <BibTransformationOptionsCreateEditRoute
      resources={resources}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('BibTransformationOptionsCreateEditRoute component', () => {
  beforeEach(() => {
    BibTransformationOptionsForm.mockClear();
  });

  it('should be rendered', () => {
    const component = renderBibTransformationOptionsCreateEditRoute();

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderBibTransformationOptionsCreateEditRoute({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('changeServer function', () => {
    beforeEach(async () => {
      renderBibTransformationOptionsCreateEditRoute();
      await act(async () => { await BibTransformationOptionsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(BibTransformationOptionsForm.mock.calls[4][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      const initialValues = cloneDeep(finalRecord);

      initialValues.id = marcTransformationOptions.id;
      initialValues.modifiedFieldsForContributedRecords = initialValues.modifiedFieldsForContributedRecords.map(item => ({
        ...item,
        ignorePrefixes: item.ignorePrefixes.join(', '),
      }));
      initialValues.excludedMARCFields = initialValues.excludedMARCFields.join(', ');
      expect(BibTransformationOptionsForm.mock.calls[4][0].initialValues).toEqual(initialValues);
    });
  });

  describe('handleSubmit', () => {
    it('should make a POST request', async () => {
      renderBibTransformationOptionsCreateEditRoute();
      await act(async () => { await BibTransformationOptionsForm.mock.calls[0][0].onSubmit(record); });
      expect(mutatorMock.marcTransformationOptions.POST).toHaveBeenCalledWith(finalRecord);
    });

    it('should make a PUT request', async () => {
      renderBibTransformationOptionsCreateEditRoute();
      await act(async () => { await BibTransformationOptionsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await BibTransformationOptionsForm.mock.calls[4][0].onSubmit(record); });
      expect(mutatorMock.marcTransformationOptions.PUT).toHaveBeenCalledWith(finalRecord);
    });
  });

  describe('handleChangeConfigState', () => {
    const form = { change: jest.fn() };

    it('should display the tabular list', () => {
      renderBibTransformationOptionsCreateEditRoute();
      act(() => { BibTransformationOptionsForm.mock.calls[0][0].onChangeConfigState(form)({ target: { checked: true } }); });
      expect(BibTransformationOptionsForm.mock.calls[1][0].isConfigActive).toBeTruthy();
    });

    it('should make initial state for tabular list', () => {
      renderBibTransformationOptionsCreateEditRoute();
      act(() => { BibTransformationOptionsForm.mock.calls[0][0].onChangeConfigState(form)({ target: { checked: false } }); });
      expect(form.change).toHaveBeenLastCalledWith(
        'modifiedFieldsForContributedRecords',
        [{
          resourceIdentifierTypeId: undefined,
          stripPrefix: false,
          ignorePrefixes: '',
        }],
      );
    });
  });
});
