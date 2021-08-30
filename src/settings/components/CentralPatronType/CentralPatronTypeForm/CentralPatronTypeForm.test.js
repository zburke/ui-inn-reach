import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties } from '../../../../../test/jest/helpers';
import CentralPatronTypeForm from './CentralPatronTypeForm';
import { PATRON_TYPE_NO_VALUE_OPTION } from '../../../../constants';

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

const patronTypeOptions = [
  PATRON_TYPE_NO_VALUE_OPTION,
  {
    label: '200 (Patron)',
    value: '200',
  },
  {
    label: '201 (Staff)',
    value: '201',
  },
];

const defaultInitialValues = {
  patronTypeMappings: [
    {
      patronGroupId: '55ca980e-2535-4945-a4f3-d8bd88f9a386',
      patronGroupLabel: 'Staff Member',
    },
    {
      patronGroupId: '21a7f3ce-d40d-4fc3-bf25-f1b0bbcb236f',
      patronGroupLabel: 'test desc',
    }
  ],
};

const renderCentralPatronTypeForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = defaultInitialValues,
  isPatronTypeMappingsPending = false,
  isPatronTypesPending = false,
  patronTypesFailed = false,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <CentralPatronTypeForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        patronTypeOptions={patronTypeOptions}
        initialValues={initialValues}
        isPatronTypeMappingsPending={isPatronTypeMappingsPending}
        isPatronTypesPending={isPatronTypesPending}
        patronTypesFailed={patronTypesFailed}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('CentralPatronTypeForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderCentralPatronTypeForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', () => {
      renderCentralPatronTypeForm(commonProps);
      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  describe('save button condition', () => {
    it('should only be enabled with all fields filled in', () => {
      const { getByRole } = renderCentralPatronTypeForm(commonProps);

      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      document.getElementById('option-patronTypeMappings[0].patronType-0-1-200').click();
      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      document.getElementById('option-patronTypeMappings[1].patronType-1-1-200').click();
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });
});
