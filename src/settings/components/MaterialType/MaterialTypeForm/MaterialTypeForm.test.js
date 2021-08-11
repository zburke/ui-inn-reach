import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { translationsProperties } from '../../../../../test/jest/helpers';

import MaterialTypeForm from './MaterialTypeForm';
import { MATERIAL_TYPE_FIELDS } from '../../../../constants';

const centralItemTypes = [
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 202,
    label: 'test1'
  },
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 211,
    label: 'test2'
  }
];

const serverOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    label: 'testName2'
  }
];

const selectedServerMock = {
  id: serverOptions[1].id,
  name: serverOptions[1].label,
};

const renderMappingTypeForm = ({
  selectedServer = selectedServerMock,
  isMaterialTypeMappingsPending = false,
  isPristine = true,
  isPending = false,
  isServersPending = false,
  initialValues = {},
  invalid = false,
  isResetForm = false,
  onChangeFormResetState,
  onChangePristineState,
  history = createMemoryHistory(),
  handleSubmit,
  onChangeServer,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <MaterialTypeForm
        selectedServer={selectedServer}
        isMaterialTypeMappingsPending={isMaterialTypeMappingsPending}
        isPending={isPending}
        isPristine={isPristine}
        isServersPending={isServersPending}
        invalid={invalid}
        serverOptions={serverOptions}
        innReachItemTypeOptions={centralItemTypes}
        initialValues={initialValues}
        isResetForm={isResetForm}
        onChangeFormResetState={onChangeFormResetState}
        onChangePristineState={onChangePristineState}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
      />
    </Router>,
    translationsProperties,
  );
};

describe('MaterialTypeForm', () => {
  const onChangeFormResetState = jest.fn();
  const onChangePristineState = jest.fn();
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();

  const commonProps = {
    onChangeFormResetState,
    onChangePristineState,
    handleSubmit,
    onChangeServer,
  };

  it('should be rendered', () => {
    const { container } = renderMappingTypeForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('Selection', () => {
    it('should call onChangeServer', () => {
      renderMappingTypeForm(commonProps);

      document.getElementById(`option-${MATERIAL_TYPE_FIELDS.CENTRAL_SERVER_ID}-1-testName2`).click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  it('should call onChangeFormResetState when isReset prop is true', () => {
    renderMappingTypeForm({
      ...commonProps,
      isResetForm: true,
    });
    expect(onChangeFormResetState).toHaveBeenCalledWith(false);
  });
});
