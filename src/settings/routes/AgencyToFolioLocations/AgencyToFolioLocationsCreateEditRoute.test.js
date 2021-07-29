import React from 'react';
import {
  cloneDeep,
  omit,
} from 'lodash';
import { createMemoryHistory } from 'history';
import { screen, act } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { ConfirmationModal } from '@folio/stripes-components';

import { FormattedMessage } from 'react-intl';
import { translationsProperties } from '../../../../test/jest/helpers';
import AgencyToFolioLocationsCreateEditRoute from './AgencyToFolioLocationsCreateEditRoute';
import AgencyToFolioLocationsForm from '../../components/AgencyToFolioLocations/AgencyToFolioLocationsForm';
import { NO_VALUE_OPTION_VALUE } from '../../../constants';

jest.mock('../../components/AgencyToFolioLocations/AgencyToFolioLocationsForm', () => {
  return jest.fn(() => <div>AgencyToFolioLocationsForm</div>);
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

const locinsts = [
  {
    id: '368fd72a-287c-4fda-ae3e-b5fe905c9fe0',
    name: 'Ezra University',
    code: 'EZU',
  },
  {
    id: 'fa30e753-8e91-40a7-9e5e-e5c573fa9b86',
    name: 'Missouri State University',
    code: 'MSU',
  },
];

const campuses = [
  {
    'id': 'f58785ac-7858-4ee7-bd3b-7d23b122d9d1',
    'name': 'Main',
    'code': 'main',
    'institutionId': '368fd72a-287c-4fda-ae3e-b5fe905c9fe0',
  }, {
    'id': 'b223cb4a-8f32-4f5c-a9ef-1b6834f21fd2',
    'name': 'Mountain Grove',
    'code': 'MG',
    'institutionId': 'fa30e753-8e91-40a7-9e5e-e5c573fa9b86',
  }, {
    'id': '3856e128-a3f6-4d95-9253-a9921a55431d',
    'name': 'Springfield',
    'code': 'SGF',
    'institutionId': 'fa30e753-8e91-40a7-9e5e-e5c573fa9b86',
  }, {
    'id': '9c948f60-a93a-49a3-a9f7-ce8c00fe629f',
    'name': 'West Plains',
    'code': 'WP',
    'institutionId': 'fa30e753-8e91-40a7-9e5e-e5c573fa9b86',
  },
];

const locations = [
  {
    'id': 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
    'name': 'A copy of another location',
    'code': 'umdub',
    'institutionId': '368fd72a-287c-4fda-ae3e-b5fe905c9fe0',
    'campusId': 'f58785ac-7858-4ee7-bd3b-7d23b122d9d1',
    'libraryId': '0a9af79b-321b-43b7-908f-f26fb6096e89',
  }, {
    'id': 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
    'name': 'Big Circ',
    'code': 'EZBC',
    'institutionId': '368fd72a-287c-4fda-ae3e-b5fe905c9fe0',
    'campusId': 'f58785ac-7858-4ee7-bd3b-7d23b122d9d1',
    'libraryId': '0a9af79b-321b-43b7-908f-f26fb6096e89',
  }, {
    'id': 'aa58c309-4522-4b46-8d1e-0396ee493460',
    'name': 'Meyer General',
    'code': 'smgen',
    'institutionId': 'fa30e753-8e91-40a7-9e5e-e5c573fa9b86',
    'campusId': 'b223cb4a-8f32-4f5c-a9ef-1b6834f21fd2',
    'libraryId': 'ef261062-e582-43d0-a1fc-c32dfca1da22',
  }
];

const loclibs = [
  {
    'id': '0a9af79b-321b-43b7-908f-f26fb6096e89',
    'name': 'Big Library',
    'code': 'big',
    'campusId': 'f58785ac-7858-4ee7-bd3b-7d23b122d9d1',
  }, {
    'id': 'ef261062-e582-43d0-a1fc-c32dfca1da22',
    'name': 'Duane G. Meyer Library',
    'code': 'LIBR',
    'campusId': 'b223cb4a-8f32-4f5c-a9ef-1b6834f21fd2',
  }
];

const record = {
  libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
  locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
  localCode: '5publ',
  localServerLibraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
  localServerLocationId: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
  agencyCodeMappings: [
    {
      agency: '5east (Sierra Public East Library)',
      libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
      locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
    },
  ],
};

const finalRecord = {
  libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
  locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
  localServers: [
    {
      localCode: '5publ',
      libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
      locationId: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
      agencyCodeMappings: [
        {
          agencyCode: '5east',
          libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
          locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
        },
      ],
    },
  ],
};

const agencyMappings = {
  libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
  locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
  localServers: [
    {
      localCode: '5publ',
      libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
      locationId: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
      agencyCodeMappings: [
        {
          agencyCode: '5east',
          libraryId: '0a9af79b-321b-43b7-908f-f26fb6096e89',
          locationId: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
        },
      ],
    },
  ],
};

const localServers = {
  errors: [],
  localServerList: [
    {
      agencyList: [{ agencyCode: '5dlpl', description: 'Sierra Alpha' }],
      description: 'Sierra Alpha',
      localCode: '5dlpl'
    },
    {
      agencyList: [{ agencyCode: '5east', description: 'Sierra Public East Library' }],
      description: 'Sierra Cluster',
      localCode: '5publ'
    },
    {
      agencyList: [{ agencyCode: 'almg1', description: 'Alma ExLibris Group Agency 1' }],
      description: 'Alma ExLibris Group',
      localCode: 'alma1'
    },
    {
      agencyList: [{ agencyCode: 'alng1', description: 'Alma2 ExLibris Group Agency 1' }],
      description: 'Alma2 ExLibris Group',
      localCode: 'alma2'
    },
  ],
  reason: 'success',
  status: 'ok'
};

const libraryOptions = [
  {
    label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-library" />,
    value: '',
  },
  {
    id: loclibs[0].id,
    label: 'EZU > main > big',
    value: loclibs[0].id,
  },
  {
    id: loclibs[1].id,
    label: 'MSU > MG > LIBR',
    value: loclibs[1].id,
  }
];

const resourcesMock = {
  centralServerRecords: {
    records: [{ centralServers: servers }],
    isPending: false,
    hasLoaded: false,
  },
  institutions: {
    records: [{ locinsts }],
    isPending: false,
    hasLoaded: true,
  },
  campuses: {
    records: [{ loccamps: campuses }],
    isPending: false,
    hasLoaded: true,
  },
  folioLibraries: {
    records: [{ loclibs }],
    isPending: false,
  },
  folioLocations: {
    records: [{ locations }],
    isPending: false,
  },
};

const mutatorMock = {
  selectedServerId: {
    replace: jest.fn(),
  },
  agencyMappings: {
    GET: jest.fn(() => Promise.resolve(agencyMappings)),
    PUT: jest.fn(() => Promise.resolve()),
  },
  localServers: {
    GET: jest.fn(() => Promise.resolve(localServers)),
  },
};

const renderAgencyToFolioLocationsCreateEditRoute = ({
  resources = resourcesMock,
  history,
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <AgencyToFolioLocationsCreateEditRoute
      resources={resources}
      history={history}
      mutator={mutator}
    />,
    translationsProperties,
  );
};

describe('AgencyToFolioLocationsCreateEditRoute component', () => {
  let history;

  beforeEach(() => {
    ConfirmationModal.mockClear();
    AgencyToFolioLocationsForm.mockClear();
    history = createMemoryHistory();
  });

  it('should be rendered', () => {
    const component = renderAgencyToFolioLocationsCreateEditRoute({ history });

    expect(component).toBeDefined();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.centralServerRecords.isPending = true;
    renderAgencyToFolioLocationsCreateEditRoute({ history, resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('changeServer function', () => {
    beforeEach(async () => {
      renderAgencyToFolioLocationsCreateEditRoute({ history });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[1][0].onChangeServer(servers[0].name); });
    });

    it('should change the selected server in redux', () => {
      expect(mutatorMock.selectedServerId.replace).toHaveBeenCalledWith(servers[0].id);
    });

    it('should pass the selected server', () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].selectedServer).toEqual(servers[0]);
    });

    it('should pass the correct initialValues', () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].initialValues).toEqual({
        libraryId: agencyMappings.libraryId,
        locationId: agencyMappings.locationId,
      });
    });

    it('should pass the correct agencyMappings', () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].agencyMappings).toEqual(agencyMappings);
    });

    it('should reset the form values', () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].isResetForm).toBeTruthy();
    });

    it('should fetch the local servers', () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].localServers).toEqual(localServers);
    });

    it('should pass the library options', async () => {
      expect(AgencyToFolioLocationsForm.mock.calls[5][0].libraryOptions).toEqual(libraryOptions);
    });
  });

  describe('addLocalInitialValues function', () => {
    it('should add the server libraryId and locationId to the initialValues', () => {
      renderAgencyToFolioLocationsCreateEditRoute({ history });
      act(() => {
        AgencyToFolioLocationsForm.mock.calls[1][0].onChangeLocalServer(
          NO_VALUE_OPTION_VALUE,
          loclibs[0].id,
          locations[0].id,
          true,
        );
      });
      expect(AgencyToFolioLocationsForm.mock.calls[2][0].initialValues).toEqual({
        libraryId: loclibs[0].id,
        locationId: locations[0].id,
      });
    });

    it('should add to initialValues all data of the tabular list', async () => {
      renderAgencyToFolioLocationsCreateEditRoute({ history });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => {
        await AgencyToFolioLocationsForm.mock.calls[5][0].onChangeLocalServer(
          agencyMappings.localServers[0].localCode,
          agencyMappings.libraryId,
          agencyMappings.locationId
        );
      });

      expect(AgencyToFolioLocationsForm.mock.calls[6][0].initialValues).toEqual({
        libraryId: agencyMappings.libraryId,
        locationId: agencyMappings.locationId,
        localCode: agencyMappings.localServers[0].localCode,
        localServerLibraryId: agencyMappings.localServers[0].libraryId,
        localServerLocationId: agencyMappings.localServers[0].locationId,
        agencyCodeMappings: [
          {
            agency: '5east (Sierra Public East Library)',
            id: agencyMappings.localServers[0].agencyCodeMappings[0].id,
            libraryId: agencyMappings.localServers[0].agencyCodeMappings[0].libraryId,
            locationId: agencyMappings.localServers[0].agencyCodeMappings[0].locationId,
          }
        ]
      });
    });

    it('should add to initialValues only left column of the tabular list', async () => {
      const newMutator = cloneDeep(mutatorMock);

      newMutator.agencyMappings.GET = jest.fn(() => Promise.resolve({}));
      renderAgencyToFolioLocationsCreateEditRoute({ history, mutator: newMutator });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => {
        await AgencyToFolioLocationsForm.mock.calls[5][0].onChangeLocalServer(
          agencyMappings.localServers[0].localCode,
          agencyMappings.libraryId,
          agencyMappings.locationId
        );
      });

      expect(AgencyToFolioLocationsForm.mock.calls[6][0].initialValues).toEqual({
        libraryId: agencyMappings.libraryId,
        locationId: agencyMappings.locationId,
        localCode: agencyMappings.localServers[0].localCode,
        agencyCodeMappings: [{ agency: '5east (Sierra Public East Library)' }]
      });
    });
  });

  describe('handleSubmit', () => {
    it('should send the correct payload', async () => {
      renderAgencyToFolioLocationsCreateEditRoute({ history });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[1][0].onSubmit(record); });
      expect(mutatorMock.agencyMappings.PUT).toHaveBeenCalledWith(finalRecord);
    });

    it('should send the payload without the local servers', async () => {
      renderAgencyToFolioLocationsCreateEditRoute({ history });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[1][0].onChangeServer(servers[0].name); });
      await act(async () => { await AgencyToFolioLocationsForm.mock.calls[5][0].onSubmit(omit(record, 'localCode')); });
      expect(mutatorMock.agencyMappings.PUT).toHaveBeenCalledWith(finalRecord);
    });
  });
});
