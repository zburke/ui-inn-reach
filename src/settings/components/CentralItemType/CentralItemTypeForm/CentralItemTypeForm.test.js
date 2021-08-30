import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties } from '../../../../../test/jest/helpers';
import CentralItemTypeForm from './CentralItemTypeForm';
import { ITEM_TYPE_NO_VALUE_OPTION } from '../../../../constants';

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

const materialTypeOptions = [
  ITEM_TYPE_NO_VALUE_OPTION,
  {
    label: 'test mtype 1',
    value: 'ada9aecf-cebb-496a-a60b-a6bfbc695bf9',
  },
  {
    label: 'test mtype 2',
    value: '9d405941-7294-4e71-b5ed-9216bc5a739d',
  },
];

const defaultInitialValues = {
  itemTypeMappings: [
    {
      itemTypeLabel: '200 (Book)',
      itemType: 200
    },
    {
      itemTypeLabel: '201 (Av)',
      itemType: 201
    },
  ],
};

const renderCentralPatronTypeForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = defaultInitialValues,
  isItemTypeMappingsPending = false,
  isInnReachItemTypesPending = false,
  innReachItemTypesFailed = false,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <CentralItemTypeForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        folioMaterialTypeOptions={materialTypeOptions}
        initialValues={initialValues}
        isItemTypeMappingsPending={isItemTypeMappingsPending}
        isInnReachItemTypesPending={isInnReachItemTypesPending}
        innReachItemTypesFailed={innReachItemTypesFailed}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('CentralItemTypeForm', () => {
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
      document.getElementById('option-itemTypeMappings[0].materialTypeId-0-1-ada9aecf-cebb-496a-a60b-a6bfbc695bf9').click();
      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      document.getElementById('option-itemTypeMappings[1].materialTypeId-1-1-ada9aecf-cebb-496a-a60b-a6bfbc695bf9').click();
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });
});
