import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { createMemoryHistory } from 'history';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { translationsProperties } from '../../../../test/jest/helpers';
import FolioToInnReachLocationsCreateEditRoute from './FolioToInnReachLocationsCreateEditRoute';
import FolioToInnReachLocationsForm from '../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm';
import { NO_VALUE_LIBRARY_OPTION } from '../../../constants';

jest.mock('../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm', () => {
  return jest.fn(() => <div>FolioToInnReachLocationsForm</div>);
});

jest.mock('@folio/stripes-components', () => ({
  ConfirmationModal: jest.fn(() => 'ConfirmationModal'),
  LoadingPane: jest.fn(() => 'LoadingPane'),
}));

const servers = [
  {
    id: '1',
    name: 'testServerName1',
    localAgencies: [
      {
        code: 'er3rr',
        folioLibraryIds: ['0939ebc4-cf37-4968-841e-912c0c02eacf', '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56'],
        id: 'effea123-e807-43b4-9e93-47f3132734e7',
      },
      {
        code: '4ffeg',
        folioLibraryIds: ['c2549bb4-19c7-4fcc-8b52-39e612fb7dbe'],
        id: '5ffa6f06-8f09-4f32-991d-ed78b70f3e1e',
      }
    ],
  },
  {
    id: '2',
    name: 'testServerName2',
    localAgencies: [
      {
        code: 'er3rr',
        folioLibraryIds: ['0939ebc4-cf37-4968-841e-912c0c02eacf', '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56'],
        id: 'effea123-e807-43b4-9e93-47f3132734e7',
      },
      {
        code: '4ffeg',
        folioLibraryIds: ['0939ebc4-cf37-4968-841e-912c0c02eacf', '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56'],
        id: '5ffa6f06-8f09-4f32-991d-ed78b70f3e1e',
      }
    ],
  },
];

const locations = [
  {
    id: 'ff357dab-1446-4e34-a78c-cf0478a10c75',
    campusId: '1a7d928b-4a04-4466-a2e4-3c5cf564cf3f',
    code: 'code5',
    libraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
    name: 'folioName5',
  },
  {
    id: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
    campusId: '1a7d928b-4a04-4466-a2e4-3c5cf564cf3f',
    code: '7sdfe',
    libraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
    name: 'FOLIOname1'
  },
];

const loclibs = [
  {
    id: '70cf3473-77f2-4f5c-92c3-6489e65769e4',
    campusId: '1b37f3c3-cefa-4ff9-9608-85d6bb944578',
    code: 'libraryCode',
    name: 'libraryName',
  },
  {
    id: '0939ebc4-cf37-4968-841e-912c0c02eacf',
    campusId: '1a7d928b-4a04-4466-a2e4-3c5cf564cf3f',
    code: 'QWER',
    name: 'newLib',
  },
  {
    id: '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56',
    campusId: '1a7d928b-4a04-4466-a2e4-3c5cf564cf3f',
    code: 'l',
    name: 'test library',
  },
  {
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    campusId: '470ff1dd-937a-4195-bf9e-06bcfcd135df',
    code: 'E',
    name: 'Online',
  },
];

const innReachLocations = [
  {
    id: '028c3da2-9608-4918-9d8f-483b555a1494',
    code: 'asdfg',
  },
  {
    id: '7ab09535-7ba8-40e7-8b14-4c7f6c171820',
    code: 'assa',
  },
  {
    id: 'feafa30d-0b0c-43e3-a283-5344bd0ae5ab',
    code: 'bbb',
  },
  {
    id: '7fab623d-1947-4413-b315-eae9ba9bb0c0',
    code: 'test',
  }
];

const recordForLocationMappings = {
  locationsTabularList: [
    {
      folioLocation: 'folioName5 (code5)',
      innReachLocations: '7fab623d-1947-4413-b315-eae9ba9bb0c0',
      code: 'code5',
    },
    {
      folioLocation: 'FOLIOname1 (7sdfe)',
      code: '7sdfe',
    },
  ],
};

const recordForLibrariesMappings = {
  librariesTabularList0: [
    {
      folioLibrary: 'newLib (QWER)',
      code: 'QWER',
    },
    {
      folioLibrary: 'test library (l)',
      code: 'l',
    },
  ],
  librariesTabularList1: [
    {
      folioLibrary: 'Online (E)',
      code: 'E',
      innReachLocations: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236',
    },
  ],
};

const resourcesMock = {
  selectedLibraryId: '',
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    failed: false,
    hasLoaded: false,
  },
  innReachLocations: {
    records: [{ locations: innReachLocations }],
    isPending: false,
    failed: false,
    hasLoaded: false,
  },
  folioLibraries: {
    records: [{ loclibs }],
    isPending: false,
    failed: false,
  },
  folioLocations: {
    records: [{ locations }],
    isPending: false,
    failed: false,
  },
};

const locationMappingsResponseMock = {
  locationMappings: [
    {
      id: '95fd9c8b-ed1b-4661-9079-c467c289463c',
      innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0',
      locationId: 'ff357dab-1446-4e34-a78c-cf0478a10c75',
    },
  ],
  totalRecords: 1,
};

const libraryMappingsResponseMock = {
  libraryMappings: [
    {
      id: 'b3bba7f9-256f-4068-bcdc-371811d6b0ce',
      innReachLocationId: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236',
    },
    {
      id: 'c474923e-4218-44f4-9613-72a70eb52b7b',
      innReachLocationId: 'c625c7e0-02c9-4264-a899-d329c2e032c9',
    },
  ],
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  selectedLibraryId: {
    replace: jest.fn(),
  },
  libraryMappings: {
    GET: jest.fn(() => Promise.resolve(libraryMappingsResponseMock)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  locationMappings: {
    GET: jest.fn(() => Promise.resolve(locationMappingsResponseMock)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  locationMappingsForAllLibraries: {
    GET: jest.fn(() => Promise.resolve([])),
  },
};

const renderFolioToInnReachLocationsCreateEditRoute = ({
  resources = resourcesMock,
  history,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <FolioToInnReachLocationsCreateEditRoute
      resources={resources}
      history={history}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('FolioToInnReachLocationsCreateEditRoute component', () => {
  let history;

  beforeEach(() => {
    ConfirmationModal.mockClear();
    FolioToInnReachLocationsForm.mockClear();
    history = createMemoryHistory();
    mutatorMock.locationMappings.GET.mockClear();
  });

  it('should be rendered', () => {
    const component = renderFolioToInnReachLocationsCreateEditRoute({ history });

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderFolioToInnReachLocationsCreateEditRoute({ history, resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  it('should change the isResetForm state', () => {
    renderFolioToInnReachLocationsCreateEditRoute({ history });
    act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeFormResetState(true); });
    expect(FolioToInnReachLocationsForm.mock.calls[1][0].isResetForm).toBeTruthy();
  });

  describe('changeServer function', () => {
    it('should change selected server', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should create server library options', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      expect(FolioToInnReachLocationsForm.mock.calls[1][0].serverLibraryOptions).toEqual([
        NO_VALUE_LIBRARY_OPTION,
        {
          id: '0939ebc4-cf37-4968-841e-912c0c02eacf',
          label: 'newLib (QWER)',
          value: 'newLib',
          code: 'QWER',
        },
        {
          id: '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56',
          label: 'test library (l)',
          value: 'test library',
          code: 'l',
        },
        {
          id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
          label: 'Online (E)',
          value: 'Online',
          code: 'E',
        },
      ]);
    });
  });

  describe('Initial values', () => {
    it('should be with the folio libraries only', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Libraries'); });
      expect(FolioToInnReachLocationsForm.mock.calls[6][0].initialValues).toEqual({
        librariesTabularList0: [
          {
            'code': 'QWER',
            'folioLibrary': 'newLib (QWER)',
          },
          {
            'code': 'l',
            'folioLibrary': 'test library (l)',
          },
        ],
        librariesTabularList1: [
          {
            'code': 'E',
            'folioLibrary': 'Online (E)',
          },
        ],
      });
    });

    it('should be with the folio libraries and the inn reach locations', async () => {
      const getLibraryMappings = jest.fn(() => Promise.resolve({
        libraryMappings: [
          {
            id: 'b3bba7f9-256f-4068-bcdc-371811d6b0ce',
            innReachLocationId: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236',
            libraryId: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
          },
          {
            id: 'c474923e-4218-44f4-9613-72a70eb52b7b',
            innReachLocationId: 'c625c7e0-02c9-4264-a899-d329c2e032c9',
            libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          },
        ],
      }));
      const newMutator = cloneDeep(mutatorMock);

      newMutator.libraryMappings.GET = getLibraryMappings;
      renderFolioToInnReachLocationsCreateEditRoute({
        history,
        mutator: newMutator,
      });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Libraries'); });
      expect(FolioToInnReachLocationsForm.mock.calls[6][0].initialValues).toEqual(recordForLibrariesMappings);
    });

    it('should be with the folio locations only', async () => {
      const getLocationMappings = jest.fn(() => Promise.resolve({
        locationMappings: [
          {
            id: '95fd9c8b-ed1b-4661-9079-c467c289463c',
            locationId: 'ff357dab-1446-4e34-a78c-cf0478a10c75',
          },
        ],
        totalRecords: 1,
      }));
      const newMutator = cloneDeep(mutatorMock);

      newMutator.locationMappings.GET = getLocationMappings;

      renderFolioToInnReachLocationsCreateEditRoute({
        history,
        resources: {
          ...resourcesMock,
          selectedLibraryId: loclibs[1].id,
        },
        mutator: newMutator,
      });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Locations'); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[2][0].onChangeLibrary(loclibs[3].name); });
      expect(FolioToInnReachLocationsForm.mock.calls[8][0].initialValues).toEqual({
        locationsTabularList: [
          {
            folioLocation: 'folioName5 (code5)',
            code: 'code5',
          },
          {
            folioLocation: 'FOLIOname1 (7sdfe)',
            code: '7sdfe',
          }
        ]
      });
    });

    it('should be with the folio locations and the inn reach locations', async () => {
      const getLocationMappings = jest.fn(() => Promise.resolve(locationMappingsResponseMock));
      const newMutator = cloneDeep(mutatorMock);

      newMutator.locationMappings.GET = getLocationMappings;
      renderFolioToInnReachLocationsCreateEditRoute({
        history,
        resources: {
          ...resourcesMock,
          selectedLibraryId: loclibs[1].id,
        },
        mutator: newMutator,
      });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Locations'); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[2][0].onChangeLibrary(loclibs[3].name); });
      expect(FolioToInnReachLocationsForm.mock.calls[8][0].initialValues).toEqual(recordForLocationMappings);
    });
  });

  describe('changeMappingType function', () => {
    it('should change mapping type', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations'); });
      expect(FolioToInnReachLocationsForm.mock.calls[1][0].mappingType).toEqual('Locations');
    });

    it('should make GET request for library mappings', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Libraries'); });
      expect(mutatorMock.libraryMappings.GET).toHaveBeenCalled();
    });
  });

  describe('handleChangeLibrary', () => {
    it('should save the selected library id to redux', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeLibrary(loclibs[1].name); });
      expect(mutatorMock.selectedLibraryId.replace).toHaveBeenCalledWith(loclibs[1].id);
    });

    it('should make GET request for location mappings', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeLibrary(loclibs[1].name); });
      expect(mutatorMock.locationMappings.GET).toHaveBeenCalled();
    });

    it('should make GET request of location mappings for all libraries', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({
        history,
        resources: {
          ...resourcesMock,
          selectedLibraryId: loclibs[1].id,
        },
      });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Locations'); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[2][0].onChangeLibrary(loclibs[3].name); });
      expect(mutatorMock.locationMappingsForAllLibraries.GET).toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    it('should make PUT for the location mappings', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({
        history,
        resources: {
          ...resourcesMock,
          selectedLibraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
        },
      });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations'); });
      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[1][0].onSubmit(recordForLocationMappings); });
      expect(mutatorMock.locationMappings.PUT).toHaveBeenCalledWith({
        locationMappings: [
          {
            locationId: 'ff357dab-1446-4e34-a78c-cf0478a10c75',
            innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0'
          }
        ]
      });
    });

    it('should make PUT for libraryMappings', async () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => { FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name); });
      act(() => { FolioToInnReachLocationsForm.mock.calls[1][0].onChangeMappingType('Libraries'); });

      await act(async () => { await FolioToInnReachLocationsForm.mock.calls[2][0].onSubmit(recordForLibrariesMappings); });
      expect(mutatorMock.libraryMappings.PUT).toHaveBeenCalledWith({
        libraryMappings: [
          {
            libraryId: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
            innReachLocationId: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236'
          }
        ]
      });
    });
  });
});
