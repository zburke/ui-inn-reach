import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { translationsProperties } from '../../../../../test/jest/helpers';
import FolioCirculationUserForm from './FolioCirculationUserForm';

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

const defaultInitialValues = {
  centralPatronTypeMappings: [
    {
      id: '508657aa-927a-4515-91d8-a4e7a759b3db',
      centralPatronType: 200,
    },
    {
      id: '6a58f3d5-5933-4941-b3fa-ff6f7395557e',
      centralPatronType: 201,
    },
  ],
};

const existingBarcodesSet = new Set(['1630029773640558945', '111111']);

const renderFolioCirculationUserForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = defaultInitialValues,
  isCentralPatronTypeMappingsPending = false,
  isInnReachPatronTypesPending = false,
  innReachPatronTypesFailed = false,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <FolioCirculationUserForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        isCentralPatronTypeMappingsPending={isCentralPatronTypeMappingsPending}
        isInnReachPatronTypesPending={isInnReachPatronTypesPending}
        existingBarcodesSet={existingBarcodesSet}
        initialValues={initialValues}
        innReachPatronTypesFailed={innReachPatronTypesFailed}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('FolioCirculationUserForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderFolioCirculationUserForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', () => {
      renderFolioCirculationUserForm(commonProps);
      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  describe('save button condition', () => {
    let barcodeField1;
    let barcodeField2;

    beforeEach(() => {
      renderFolioCirculationUserForm(commonProps);
      barcodeField1 = document.getElementById('centralPatronTypeMappings[0].barcode-0');
      barcodeField2 = document.getElementById('centralPatronTypeMappings[1].barcode-1');
      userEvent.type(barcodeField1, '1630029773640558945');
    });

    it('should be enabled when all barcode fields are filled', () => {
      userEvent.type(barcodeField2, '111111');
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should not be enabled when not all required fields are filled in', () => {
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });
});
