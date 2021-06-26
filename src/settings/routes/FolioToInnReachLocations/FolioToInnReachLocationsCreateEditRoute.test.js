import React from 'react';
import {
  cloneDeep,
} from 'lodash';
import { createMemoryHistory } from 'history';
import { waitFor, screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { translationsProperties } from '../../../../test/jest/helpers';
import { useCentralServers } from '../../../hooks';
import FolioToInnReachLocationsCreateEditRoute from './FolioToInnReachLocationsCreateEditRoute';
import FolioToInnReachLocationsForm from '../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm';

jest.mock('../../components/FolioToInnReachLocations/FolioToInnReachLocationsForm', () => {
  return jest.fn(() => <div>FolioToInnReachLocationsForm</div>);
});

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCentralServers: jest.fn().mockReturnValue([]),
}));

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
        folioLibraryIds: ['0939ebc4-cf37-4968-841e-912c0c02eacf', '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56'],
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
  tabularList: [
    {
      folioLocation: 'FOLIOname1 (7sdfe)',
      innReachLocations: 'test',
    },
    {
      folioLocation: 'folioName5 (code5)',
    },
  ],
};

const recordForLibrariesMappings = {
  tabularList: [
    {
      folioLibrary: 'newLib (QWER)',
      innReachLocations: 'test'
    },
    {
      folioLibrary: 'test library (l)',
      innReachLocations: '111'
    },
  ],
};

const locationMappings = [
  {
    locationMappings: [
      {
        id: '1',
        locationId: '81012b3d-c686-42bc-8fd8-89274bdc2e64',
        innReachLocationId: 'feafa30d-0b0c-43e3-a283-5344bd0ae5ab',
      },
      {
        id: '2',
        locationId: 'ff357dab-1446-4e34-a78c-cf0478a10c75',
        innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0',
      },
    ],
  },
];

const libraryMappings = [
  {
    libraryMappings: [
      {
        id: '1',
        libraryId: '70cf3473-77f2-4f5c-92c3-6489e65769e4',
        innReachLocationId: 'feafa30d-0b0c-43e3-a283-5344bd0ae5ab',
      },
      {
        id: '2',
        libraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
        innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0',
      },
    ],
  },
];

const resourcesMock = {
  // selectedLibraryId: servers[1].id,
  selectedLibraryId: '',
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    failed: false,
  },
  innReachLocations: {
    records: [{ locations: innReachLocations }],
    isPending: false,
    failed: false,
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
  // locationMappings: {
  //   records: [],
  //   isPending: false,
  //   failed: false,
  // },
  // libraryMappings: {
  //   records: [],
  //   isPending: false,
  //   failed: false,
  // },
};

const getLibraryMappings = jest.fn(() => Promise.resolve(libraryMappings));
const getLocationMappings = jest.fn(() => Promise.resolve(locationMappings));
const putLibraryMappings = jest.fn(() => Promise.resolve());
const putLocationMappings = jest.fn(() => Promise.resolve());
const replaceSelectedServerIdMock = jest.fn();
const replaceSelectedLibraryIdMock = jest.fn();

const mutatorMock = {
  selectedServerId: {
    replace: replaceSelectedServerIdMock,
  },
  selectedLibraryId: {
    replace: replaceSelectedLibraryIdMock,
  },
  libraryMappings: {
    GET: getLibraryMappings,
    PUT: putLibraryMappings,
  },
  locationMappings: {
    GET: getLocationMappings,
    PUT: putLocationMappings,
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
  const changeSelectedServer = jest.fn();
  const changeModalState = jest.fn();
  const changeNextServer = jest.fn();
  const changePrevServerName = jest.fn();
  const handleModalConfirm = jest.fn();
  const handleModalCancel = jest.fn();
  const hookMock = {
    selectedServer: servers[1],
    openModal: false,
    isResetForm: false,
    isPristine: true,
    serverOptions,
    changePristineState: jest.fn(),
    changeFormResetState: jest.fn(),
    handleModalConfirm,
    handleModalCancel,
    changeModalState,
    changeNextServer,
    changeSelectedServer,
    changePrevServerName,
  };

  beforeEach(() => {
    ConfirmationModal.mockClear();
    FolioToInnReachLocationsForm.mockClear();
    history = createMemoryHistory();

    useCentralServers.mockClear().mockReturnValue(hookMock);
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

  describe('changeServer function', () => {
    it('should change selected server', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name);
      expect(changeSelectedServer).toHaveBeenCalledWith(servers[0]);
    });

    it('should change the previous server name', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      FolioToInnReachLocationsForm.mock.calls[0][0].onChangeServer(servers[0].name);
      expect(changePrevServerName).toHaveBeenCalledWith(servers[1].name);
    });

    it('should also change the previous server name', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => {
        FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      });
      FolioToInnReachLocationsForm.mock.calls[2][0].onChangeServer(servers[0].name);
      expect(changePrevServerName).toHaveBeenCalledWith(servers[1].name);
    });

    it('should open modal', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => {
        FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      });
      FolioToInnReachLocationsForm.mock.calls[2][0].onChangeServer(servers[0].name);
      expect(changeModalState).toHaveBeenCalledWith(true);
    });

    it('should change the next server state', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => {
        FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      });
      FolioToInnReachLocationsForm.mock.calls[2][0].onChangeServer(servers[0].name);
      expect(changeNextServer).toHaveBeenCalledWith(servers[1]);
    });
  });

  describe('changeMappingType function', () => {
    it('should change mapping type', () => {
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => {
        FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      });
      expect(FolioToInnReachLocationsForm.mock.calls[2][0].mappingType).toEqual('Locations');
    });

    it('should open modal', () => {
      useCentralServers.mockClear().mockReturnValue({
        ...hookMock,
        isPristine: false,
      });
      renderFolioToInnReachLocationsCreateEditRoute({ history });
      act(() => {
        FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      });
      expect(changeModalState).toHaveBeenCalledWith(true);
    });

    describe('handleChangeLibrary', () => {
      it('should save the selected library id to redux', () => {
        renderFolioToInnReachLocationsCreateEditRoute({ history });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
        });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[2][0].onChangeLibrary(loclibs[1].name);
        });
        expect(replaceSelectedLibraryIdMock).toHaveBeenCalledWith(loclibs[1].id);
      });

      // it('should open modal', () => {
      //   // useCentralServers.mockClear().mockReturnValue({
      //   //   ...hookMock,
      //   //   isPristine: false,
      //   //   // changeModalState,
      //   // });
      //   renderFolioToInnReachLocationsCreateEditRoute({ history });
      //   act(() => {
      //     FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
      //   });
      //
      //   useCentralServers.mockClear().mockReturnValue({
      //     ...hookMock,
      //     isPristine: false,
      //     // changeModalState,
      //   });
      //
      //   console.log('FolioToInnReachLocationsForm.mock.calls2', FolioToInnReachLocationsForm.mock.calls)
      //   act(() => {
      //     FolioToInnReachLocationsForm.mock.calls[2][0].onChangeLibrary(loclibs[1].name);
      //   });
      //   expect(changeModalState).toHaveBeenCalledWith(true);
      // })
    });

    describe('processModalConfirm', () => {
      it('should call handleModalConfirm function', () => {
        renderFolioToInnReachLocationsCreateEditRoute({ history });
        act(() => {
          ConfirmationModal.mock.calls[0][0].onConfirm();
        });

        expect(handleModalConfirm).toHaveBeenCalled();
      });

      it('should make prevLibrarySelection state empty', () => {
        const prevLibrarySelection = '';

        renderFolioToInnReachLocationsCreateEditRoute({ history });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeLibrary(loclibs[1].name);
        });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[1][0].onChangeLibrary(loclibs[0].name);
        });
        act(() => {
          ConfirmationModal.mock.calls[2][0].onConfirm();
        });
        act(() => {
          ConfirmationModal.mock.calls[3][0].onCancel();
        });
        expect(handleModalCancel).toHaveBeenCalledWith({ isStopServerReset: prevLibrarySelection });
      });
    });

    describe('processModalCancel', () => {
      it('should change mapping type', async () => {
        renderFolioToInnReachLocationsCreateEditRoute({ history });
        await waitFor(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
        });
        await waitFor(() => {
          FolioToInnReachLocationsForm.mock.calls[2][0].onChangeMappingType('Libraries');
        });
        await waitFor(() => {
          ConfirmationModal.mock.calls[4][0].onCancel();
        });
        expect(FolioToInnReachLocationsForm.mock.calls[4][0].mappingType).toEqual('Libraries');
      });

      it('should add selectedLibraryId to redux', () => {
        renderFolioToInnReachLocationsCreateEditRoute({ history });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeLibrary(loclibs[0].name);
        });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[1][0].onChangeLibrary(loclibs[1].name);
        });
        act(() => {
          ConfirmationModal.mock.calls[2][0].onCancel();
        });
        expect(replaceSelectedLibraryIdMock).toHaveBeenCalled();
      });
    });

    describe('handleSubmit', () => {
      it('should make PUT for locationMappings', async () => {
        await waitFor(() => {
          renderFolioToInnReachLocationsCreateEditRoute({
            history,
            resources: {
              ...resourcesMock,
              selectedLibraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
            },
          });
        });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Locations');
        });
        act(() => {
          FolioToInnReachLocationsForm.mock.calls[5][0].onSubmit(recordForLocationMappings);
        });
        expect(putLocationMappings).toHaveBeenCalledWith({
          locationMappings: [
            {
              locationId: '0ac0ffe6-c3ee-4610-b15c-019bbaea5dbd',
              innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0'
            }
          ]
        });
      });

      it('should make PUT for libraryMappings', async () => {
        await waitFor(() => {
          renderFolioToInnReachLocationsCreateEditRoute({ history });
        });
        await waitFor(() => {
          FolioToInnReachLocationsForm.mock.calls[0][0].onChangeMappingType('Libraries');
        });

        // console.log('45', FolioToInnReachLocationsForm.mock.calls)

        await waitFor(() => {
          FolioToInnReachLocationsForm.mock.calls[2][0].onSubmit(recordForLibrariesMappings);
        });

        expect(putLibraryMappings).toHaveBeenCalledWith({
          libraryMappings: [
            {
              libraryId: '0939ebc4-cf37-4968-841e-912c0c02eacf',
              innReachLocationId: '7fab623d-1947-4413-b315-eae9ba9bb0c0'
            }
          ]
        });
      });
    });
  });
});
