import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../../test/jest/helpers';
import BibTransformationOptionsForm from './BibTransformationOptionsForm';
import { BIB_TRANSFORMATION_FIELDS, DEFAULT_INITIAL_VALUES } from '../../../../constants';

const {
  MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS,
  RESOURCE_IDENTIFIER_TYPE_ID,
  CONFIG_IS_ACTIVE,
} = BIB_TRANSFORMATION_FIELDS;

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

const identifierTypes = [
  {
    id: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
    name: 'ASIN',
    source: 'local',
  },
  {
    id: 'e7bb3f98-5229-44dc-9da2-08bcfc67020a',
    name: 'LCCN',
    source: 'local',
  },
];

const renderBibTransformationOptionsForm = ({
  selectedServer = selectedServerMock,
  handleSubmit,
  initialValues = DEFAULT_INITIAL_VALUES,
  isMarcTransformationOptionsPending = false,
  isConfigActive = false,
  onChangeServer,
  onChangeConfigState,
} = {}) => {
  return renderWithIntl(
    <Router history={createMemoryHistory()}>
      <BibTransformationOptionsForm
        selectedServer={selectedServer}
        serverOptions={serverOptions}
        identifierTypes={identifierTypes}
        formatMessage={({ id }) => id}
        initialValues={initialValues}
        isMarcTransformationOptionsPending={isMarcTransformationOptionsPending}
        isConfigActive={isConfigActive}
        onSubmit={handleSubmit}
        onChangeServer={onChangeServer}
        onChangeConfigState={onChangeConfigState}
      />
    </Router>,
    translationsProperties,
  );
};

describe('BibTransformationOptionsForm', () => {
  const handleSubmit = jest.fn();
  const onChangeServer = jest.fn();
  const onChangeConfigState = jest.fn();

  const commonProps = {
    handleSubmit,
    onChangeServer,
    onChangeConfigState,
  };

  it('should be rendered', () => {
    const { container } = renderBibTransformationOptionsForm(commonProps);

    expect(container).toBeVisible();
  });

  describe('handleChangeServer', () => {
    it('should cause onChangeServer callback', () => {
      renderBibTransformationOptionsForm(commonProps);
      document.getElementById('option-centralServerId-0-f8723a94-25d5-4f19-9043-cc3c306d54a1').click();
      expect(onChangeServer).toHaveBeenCalled();
    });
  });

  describe('save button condition', () => {
    it('should be enabled when at least one "Identifier type" is selected', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: true,
      });

      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
      userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'd09901a7-1407-42d5-a680-e4d83fe93c5d');
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be enabled when modifying an existing config', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: true,
        initialValues: {
          [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
            {
              [RESOURCE_IDENTIFIER_TYPE_ID]: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
            },
          ],
        },
      });

      userEvent.click(getByRole('checkbox', { name: 'Strip prefix' }));
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be enabled when adding a value to the "Ignore prefixes field"', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: true,
        initialValues: {
          [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
            {
              [RESOURCE_IDENTIFIER_TYPE_ID]: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
            },
          ],
        },
      });

      userEvent.type(getByRole('textbox', { name: 'Ignore prefixes' }), '123');
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be enabled when the config exists and is closed', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: false,
        initialValues: {
          [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
            {
              [RESOURCE_IDENTIFIER_TYPE_ID]: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
            },
          ],
        },
      });

      userEvent.type(getByRole('textbox', { name: 'Strip fields and subfields' }), '123');
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('should be disabled when fields are pristine', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: true,
        initialValues: {
          [CONFIG_IS_ACTIVE]: true,
          [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
            {
              [RESOURCE_IDENTIFIER_TYPE_ID]: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
            },
          ],
        },
      });

      userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'e7bb3f98-5229-44dc-9da2-08bcfc67020a');
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
      userEvent.selectOptions(getByRole('combobox', { name: 'Identifier type' }), 'd09901a7-1407-42d5-a680-e4d83fe93c5d');
      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('should be disabled when there is no change', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: false,
        initialValues: {
          [CONFIG_IS_ACTIVE]: true,
          [MODIFIED_FIELDS_FOR_CONTRIBUTED_RECORDS]: [
            {
              [RESOURCE_IDENTIFIER_TYPE_ID]: 'd09901a7-1407-42d5-a680-e4d83fe93c5d',
            },
          ],
        },
      });

      expect(getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('should be enabled when the config does not exist and is closed, but "Strip fields and subfields" field have changes', () => {
      const { getByRole } = renderBibTransformationOptionsForm({
        ...commonProps,
        isConfigActive: false,
        initialValues: DEFAULT_INITIAL_VALUES,
      });

      userEvent.type(getByRole('textbox', { name: 'Strip fields and subfields' }), '123');
      expect(getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });
});
