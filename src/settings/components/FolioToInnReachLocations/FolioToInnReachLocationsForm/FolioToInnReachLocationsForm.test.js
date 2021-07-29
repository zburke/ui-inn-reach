import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
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
    value: 'testName2'
  }
];

const serverLibraryOptions = [
  NO_VALUE_LIBRARY_OPTION,
  {
    id: '0939ebc4-cf37-4968-841e-912c0c02eacf',
    label: 'newLib (QWER)',
    value: 'newLib',
  },
  {
    id: '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56',
    label: 'test library (l)',
    value: 'test library',
  },
];

const innReachLocations = [
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

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
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

const renderFolioToInnReachLocationsForm = ({
  selectedServer = {},
  mappingType = '',
  isPristine = true,
  initialValues = {},
  isResetForm = false,
  history = createMemoryHistory(),
  handleSubmit,
  values = {},
  onChangeServer,
  isMappingsPending = false,
  leftColumnName = FOLIO_LIBRARY,
  isShowTabularList = false,
  onChangePristineState,
  onChangeFormResetState,
  onChangeMappingType,
  onChangeLibrary,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <FolioToInnReachLocationsForm
        selectedServer={selectedServer}
        mappingType={mappingType}
        serverLibraryOptions={serverLibraryOptions}
        innReachLocations={innReachLocations}
        isPristine={isPristine}
        serverOptions={serverOptions}
        isMappingsPending={isMappingsPending}
        leftColumnName={leftColumnName}
        isShowTabularList={isShowTabularList}
        mappingTypesOptions={mappingTypesOptions}
        formatMessage={({ id }) => id}
        librariesMappingType="Libraries"
        locationsMappingType="Locations"
        initialValues={initialValues}
        isResetForm={isResetForm}
        values={values}
        onSubmit={handleSubmit}
        onChangePristineState={onChangePristineState}
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
  const onChangePristineState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeLibrary = jest.fn();
  const onChangeMappingType = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    onChangePristineState,
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
        isPristine: false,
        selectedServer: selectedServerMock,
        mappingType: mappingTypesOptions[1].value,
        isShowTabularList: true,
        initialValues: {
          tabularList: [
            {
              [FOLIO_LOCATION]: 'newLib (QWER)',
            },
            {
              [FOLIO_LOCATION]: 'test library (l)',
            },
          ],
        },
      });
      document.getElementById('option-tabularList[0].innReachLocations-0-2-bbb').click();
      document.getElementById('option-tabularList[1].innReachLocations-1-3-test').click();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });
    });

    it('should be active for the "locations" mapping type', async () => {
      renderFolioToInnReachLocationsForm({
        ...commonProps,
        leftColumnName: FOLIO_LOCATION,
        isPristine: false,
        selectedServer: selectedServerMock,
        mappingType: mappingTypesOptions[2].value,
        isShowTabularList: true,
        initialValues: {
          tabularList: [
            {
              [FOLIO_LOCATION]: 'newLib (QWER)',
            },
            {
              [FOLIO_LOCATION]: 'test library (l)',
            },
          ],
        },
      });

      document.getElementById('option-tabularList[0].innReachLocations-0-2-bbb').click();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      });
    });
  });
});
