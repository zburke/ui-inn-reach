import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { FormattedMessage } from 'react-intl';
import { translationsProperties } from '../../../../../test/jest/helpers';
import AgencyToFolioLocationsForm from './AgencyToFolioLocationsForm';
import { AGENCY_TO_FOLIO_LOCATIONS_FIELDS } from '../../../../constants';
import {
  NO_VALUE_LOCAL_SERVER_OPTION,
  NO_VALUE_LOCATION_OPTION,
} from './utils';

const {
  AGENCY_CODE_MAPPINGS,
} = AGENCY_TO_FOLIO_LOCATIONS_FIELDS;

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'CSC',
    value: 'f8723a94-25d5-4f19-9043-cc3c306d54a1'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'testName2',
    value: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

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

const serverLocationOptions = [
  NO_VALUE_LOCATION_OPTION,
  {
    id: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
    label: 'A copy of another location (umdub)',
    value: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
  },
  {
    id: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
    label: 'Big Circ (EZBC)',
    value: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
  },
];

const localServerLocationOptions = [
  NO_VALUE_LOCAL_SERVER_OPTION,
  {
    id: 'aa58c309-4522-4b46-8d1e-0396ee493460',
    label: 'Meyer General (smgen)',
    value: 'aa58c309-4522-4b46-8d1e-0396ee493460',
  },
];

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

const folioLocationsMap = new Map();

folioLocationsMap.set('0a9af79b-321b-43b7-908f-f26fb6096e89', [
  {
    id: 'd428ca1d-f33b-4d4c-a160-d9f41c657bb7',
    name: 'A copy of another location',
    code: 'umdub'
  },
  {
    id: 'ae5032a1-fe55-41d1-ab29-b7696b3312a4',
    name: 'Big Circ',
    code: 'EZBC'
  }
]);

folioLocationsMap.set('ef261062-e582-43d0-a1fc-c32dfca1da22', [
  {
    id: 'aa58c309-4522-4b46-8d1e-0396ee493460',
    name: 'Meyer General',
    code: 'smgen'
  }
]);

const renderAgencyToFolioLocationsForm = ({
  selectedServer = selectedServerMock,
  initialValues = {},
  isResetForm = false,
  history = createMemoryHistory(),
  handleSubmit,
  values = {},
  form,
  agencyMappings = {},
  bannerMessage = '',
  onChangeServer,
  onChangeLocalServer,
  isLocalServersPending = false,
  onChangePristineState,
  onChangeFormResetState,
  onChangeLocalServerLocationOptions,
  onChangeServerLocationOptions,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <AgencyToFolioLocationsForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        isLocalServersPending={isLocalServersPending}
        libraryOptions={libraryOptions}
        localServers={localServers}
        folioLocationsMap={folioLocationsMap}
        agencyMappings={agencyMappings}
        formatMessage={({ id }) => id}
        initialValues={initialValues}
        isResetForm={isResetForm}
        values={values}
        form={form}
        serverLocationOptions={serverLocationOptions}
        localServerLocationOptions={localServerLocationOptions}
        bannerMessage={bannerMessage}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
        onChangeLocalServer={onChangeLocalServer}
        onChangePristineState={onChangePristineState}
        onChangeFormResetState={onChangeFormResetState}
        onChangeLocalServerLocationOptions={onChangeLocalServerLocationOptions}
        onChangeServerLocationOptions={onChangeServerLocationOptions}
      />
    </Router>,
    translationsProperties,
  );
};

describe('AgencyToFolioLocationsForm', () => {
  const onChangeFormResetState = jest.fn();
  const onChangePristineState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeLocalServer = jest.fn();
  const onChangeLocalServerLocationOptions = jest.fn();
  const onChangeServerLocationOptions = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    onChangePristineState,
    handleSubmit,
    onChangeServer,
    onChangeLocalServer,
    onChangeLocalServerLocationOptions,
    onChangeServerLocationOptions,
  };

  it('should be rendered', () => {
    const { container } = renderAgencyToFolioLocationsForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', () => {
      renderAgencyToFolioLocationsForm(commonProps);
      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  describe('handleChangeServerLibrary', () => {
    it('should call the getFolioLocationOptions function', () => {
      const utils = jest.requireActual('./utils');
      const getFolioLocationOptionsSpy = jest.spyOn(utils, 'getFolioLocationOptions');

      renderAgencyToFolioLocationsForm(commonProps);
      document.getElementById(`option-libraryId-1-${loclibs[0].id}`).click();
      expect(getFolioLocationOptionsSpy.mock.calls[0]).toBeDefined();
    });

    it('should enable the location field', () => {
      const { getByRole } = renderAgencyToFolioLocationsForm(commonProps);
      const name = 'FOLIO location (default) Select location required';

      expect(getByRole('button', { name })).toBeDisabled();
      document.getElementById(`option-libraryId-1-${loclibs[0].id}`).click();
      expect(getByRole('button', { name })).toBeEnabled();
    });
  });

  describe('handleChangeServerLocation', () => {
    beforeEach(() => {
      renderAgencyToFolioLocationsForm(commonProps);
      document.getElementById(`option-libraryId-1-${loclibs[0].id}`).click();
      document.getElementById('locationId').click();
      document.getElementById('option-locationId-1-d428ca1d-f33b-4d4c-a160-d9f41c657bb7').click();
    });

    it('should add the Local server field', () => {
      expect(screen.getByRole('button', { name: 'Local server Select local server' })).toBeVisible();
    });

    it('should enable Save button', () => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    describe('handleChangeLocalServer', () => {
      beforeEach(() => {
        document.getElementById('option-localCode-1-5dlpl').click();
      });

      it('should add the library field for local server', () => {
        expect(screen.getByRole('button', { name: 'FOLIO library (default) Select Institution > Campus > Library' })).toBeVisible();
      });

      it('should add the location field for local server', () => {
        const name = 'FOLIO location (default) A copy of another location (umdub) required';

        expect(screen.getByRole('button', { name })).toBeVisible();
      });

      it('should add the tabular list', () => {
        expect(screen.getByTestId(AGENCY_CODE_MAPPINGS)).toBeVisible();
      });

      describe('handleChangeLocalServerLibrary', () => {
        const utils1 = jest.requireActual('./utils');
        const utils2 = jest.requireActual('../../../routes/AgencyToFolioLocations/utils');
        const getFolioLocationOptionsSpy = jest.spyOn(utils1, 'getFolioLocationOptions');
        const getLocalServerDataSpy = jest.spyOn(utils2, 'getLocalServerData');

        beforeEach(() => {
          document.getElementById(`option-localServerLibraryId-1-${loclibs[0].id}`).click();
        });

        it('should call the getFolioLocationOptions function', () => {
          expect(getFolioLocationOptionsSpy.mock.calls[0]).toBeDefined();
        });

        it('should call the getLocalServerData function', () => {
          expect(getLocalServerDataSpy.mock.calls[0]).toBeDefined();
        });
      });
    });
  });

  describe('handleLibraryChange in the tabular list', () => {
    it('should make the location field enabled', () => {
      const name = 'FOLIO library & location Select location';
      const initialValuesMock = {
        localCode: '5dlpl',
        agencyCodeMappings: [{ agency: '5dlpl (Sierra Alpha)' }],
      };

      renderAgencyToFolioLocationsForm({ ...commonProps, initialValues: initialValuesMock });
      document.getElementById(`option-libraryId-1-${loclibs[0].id}`).click();
      document.getElementById('locationId').click();
      document.getElementById('option-locationId-1-d428ca1d-f33b-4d4c-a160-d9f41c657bb7').click();
      document.getElementById('option-localCode-1-5dlpl').click();
      document.getElementById(`option-localServerLibraryId-1-${loclibs[0].id}`).click();
      expect(screen.getByRole('button', { name })).toBeDisabled();
      document.getElementById('agencyCodeMappings[0].libraryId-0').click();
      document.getElementById(`option-agencyCodeMappings[0].libraryId-0-1-${loclibs[0].id}`).click();
      expect(screen.getByRole('button', { name })).toBeEnabled();
    });
  });

  describe('banner', () => {
    it('should be visible', () => {
      const bannerMessage = 'some kind of error message';
      const { getByText } = renderAgencyToFolioLocationsForm({
        ...commonProps,
        bannerMessage,
      });

      expect(getByText(bannerMessage)).toBeVisible();
    });

    it('should be invisible', () => {
      renderAgencyToFolioLocationsForm({
        ...commonProps,
        bannerMessage: '',
      });
      const banner = document.querySelector('[data-test-message-banner]');

      expect(banner).toBeFalsy();
    });
  });
});
