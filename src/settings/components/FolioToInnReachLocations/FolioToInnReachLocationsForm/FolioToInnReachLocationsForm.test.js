import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import StripesFinalFormWrapper from '@folio/stripes-final-form/lib/StripesFinalFormWrapper';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { translationsProperties } from '../../../../../test/jest/helpers';
import FolioToInnReachLocationsForm from './FolioToInnReachLocationsForm';
import {
  FOLIO_TO_INN_REACH_LOCATION_FIELDS,
  NO_VALUE_LIBRARY_OPTION,
} from '../../../../constants';

const {
  FOLIO_LIBRARY,
  FOLIO_LOCATION,
} = FOLIO_TO_INN_REACH_LOCATION_FIELDS;

const serverOptions = [
  {
    id: 'f8723a94-25d5-4f19-9043-cc3c306d54a1',
    label: 'CSC',
    value: 'CSC'
  },
  {
    id: '6e2b3e23-8d58-4cd3-985d-b4eb2e9a2ec9',
    label: 'testName2',
    value: 'testName2',
    localAgencies: [
      {
        code: 'fl1g1',
        folioLibraryIds: ['5d78803e-ca04-4b4a-aeae-2c63b924518b', '05d23bb3-a1a2-40e6-ba85-c8fb9bd38d80'],
      },
      {
        code: 'fl1g2',
        folioLibraryIds: ['c2549bb4-19c7-4fcc-8b52-39e612fb7dbe'],
      },
    ],
  }
];

const serverLibraryOptions = [
  NO_VALUE_LIBRARY_OPTION,
  {
    code: 'd2i01',
    id: '05d23bb3-a1a2-40e6-ba85-c8fb9bd38d80',
    label: 'D2IR Local 1 (d2i01)',
    value: 'D2IR Local 1',
  },
  {
    code: 'DI',
    id: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
    label: 'Datalogisk Institut (DI)',
    value: 'Datalogisk Institut',
  },
  {
    code: 'E',
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    label: 'Online (E)',
    value: 'Online',
  },
];

const innReachLocations = [
  {
    id: 'c625c7e0-02c9-4264-a899-d329c2e032c9',
    code: 'smgen',
    value: 'c625c7e0-02c9-4264-a899-d329c2e032c9',
  },
  {
    id: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236',
    code: 'wpgen',
    value: 'a6742e42-a8a8-4e92-9cf8-885b77ec9236',
  },
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
  localAgencies: serverOptions[1].localAgencies,
};

const mappingTypesOptions = [
  {
    id: '1',
    label: 'Select type to map',
    value: 'Select type to map',
  },
  {
    id: '2',
    label: 'Libraries',
    value: 'Libraries',
  },
  {
    id: '3',
    label: 'Locations',
    value: 'Locations',
  }
];

const opts = {
  navigationCheck: true,
  subscription: {
    values: true,
    pristine: true,
    invalid: true,
  },
};

const renderFolioToInnReachLocationsForm = ({
  selectedServer = {},
  selectedLibraryId = '',
  pickedLocationsByAgencyCodeMap = new Map(),
  mappingType = '',
  initialValues = {},
  isResetForm = false,
  history = createMemoryHistory(),
  handleSubmit,
  values = {},
  onChangeServer,
  isMappingsPending = false,
  leftColumnName = FOLIO_LIBRARY,
  isShowTabularList = false,
  onChangeFormResetState,
  onChangeMappingType,
  onChangeLibrary,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <StripesFinalFormWrapper
        Form={FolioToInnReachLocationsForm}
        formOptions={opts}
        initialValues={initialValues}
        selectedServer={selectedServer}
        selectedLibraryId={selectedLibraryId}
        pickedLocationsByAgencyCodeMap={pickedLocationsByAgencyCodeMap}
        mappingType={mappingType}
        serverLibraryOptions={serverLibraryOptions}
        innReachLocations={innReachLocations}
        serverOptions={serverOptions}
        isMappingsPending={isMappingsPending}
        leftColumnName={leftColumnName}
        isShowTabularList={isShowTabularList}
        mappingTypesOptions={mappingTypesOptions}
        formatMessage={({ id }) => id}
        librariesMappingType="Libraries"
        locationsMappingType="Locations"
        isResetForm={isResetForm}
        values={values}
        onSubmit={handleSubmit}
        onChangeFormResetState={onChangeFormResetState}
        onChangeServer={onChangeServer}
        onChangeMappingType={onChangeMappingType}
        onChangeLibrary={onChangeLibrary}
      />
    </Router>,
    translationsProperties,
  );
};

describe('FolioToInnReachLocationsForm', () => {
  const onChangeFormResetState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeLibrary = jest.fn();
  const onChangeMappingType = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    handleSubmit,
    onChangeServer,
    onChangeLibrary,
    onChangeMappingType,
  };

  it('should be rendered', () => {
    const { container } = renderFolioToInnReachLocationsForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Select ', () => {
    it('should trigger onChangeMappingType callback', () => {
      const { getByRole } = renderFolioToInnReachLocationsForm({
        ...commonProps,
        selectedServer: selectedServerMock,
      });

      userEvent.selectOptions(getByRole('combobox', { name: 'Mapping type' }), mappingTypesOptions[1].value);
      expect(onChangeMappingType).toHaveBeenCalledWith(mappingTypesOptions[1].value);
    });
  });

  it('should cause onChangeFormResetState callback', () => {
    renderFolioToInnReachLocationsForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });

  describe('Save button', () => {
    it('should be active for the "libraries" mapping type', async () => {
      renderFolioToInnReachLocationsForm({
        ...commonProps,
        selectedServer: selectedServerMock,
        mappingType: mappingTypesOptions[1].value,
        isShowTabularList: true,
        initialValues: {
          librariesTabularList0: [
            {
              [FOLIO_LOCATION]: 'D2IR Local 1 (d2i01)',
            },
            {
              [FOLIO_LOCATION]: 'Datalogisk Institut (DI)',
            },
          ],
          librariesTabularList1: [
            {
              [FOLIO_LOCATION]: 'Online (E)',
            },
          ],
        },
      });
      document.getElementById('option-librariesTabularList0[0].innReachLocations-0-1-c625c7e0-02c9-4264-a899-d329c2e032c9').click();
      document.getElementById('option-librariesTabularList0[1].innReachLocations-1-1-c625c7e0-02c9-4264-a899-d329c2e032c9').click();
      document.getElementById('option-librariesTabularList1[0].innReachLocations-0-2-a6742e42-a8a8-4e92-9cf8-885b77ec9236').click();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });
    });

    it('should be active for the "locations" mapping type', async () => {
      renderFolioToInnReachLocationsForm({
        ...commonProps,
        leftColumnName: FOLIO_LOCATION,
        selectedServer: selectedServerMock,
        mappingType: mappingTypesOptions[2].value,
        selectedLibraryId: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
        isShowTabularList: true,
        initialValues: {
          locationsTabularList: [
            {
              [FOLIO_LOCATION]: 'D2IR Local 1 (d2i01)',
            },
            {
              [FOLIO_LOCATION]: 'Datalogisk Institut (DI)',
            },
          ],
        },
      });

      document.getElementById('option-locationsTabularList[0].innReachLocations-0-1-c625c7e0-02c9-4264-a899-d329c2e032c9').click();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });
    });
  });
});
