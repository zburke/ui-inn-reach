import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import StripesFinalFormWrapper from '@folio/stripes-final-form/lib/StripesFinalFormWrapper';
import userEvent from '@testing-library/user-event';
import {
  MultiSelection,
  TextField,
} from '@folio/stripes-components';

import RepeatableField from './RepeatableField';
import { translationsProperties } from '../../../../../../../test/jest/helpers';
import { validateLocalAgency } from '../../utils/formValidation';
import { DEFAULT_VALUES } from '../../../../../routes/CentralServersConfigurationRoute/CentralServersConfigurationCreateEditContainer';

const newItemTemplate = {
  localAgency: '',
  FOLIOLibraries: [],
};

const props = {
  data: [],
  initialValues: DEFAULT_VALUES,
  isCentralServerDataInvalid: false,
  onSaveLocalServerKeypair: jest.fn(),
  onCancel: jest.fn(),
  onSubmit: jest.fn(),

  addDefaultItem: true,
  name: 'localAgencies',
  template: [
    {
      id: 'localAgency',
      name: 'localAgency',
      component: TextField,
      required: true,
      disabled: false,
      columnSize: { xs: 4 }
    },
    {
      id: 'FOLIOLibraries',
      name: 'FOLIOLibraries',
      component: MultiSelection,
      dataOptions: [],
      required: true,
      disabled: false,
      columnSize: { xs: 8 },
    }
  ],
  newItemTemplate,
  canAdd: true,
  canDelete: true,
  showAddNewField: false,
};

const validate = (values) => ({
  ...validateLocalAgency(values.localAgencies),
});

const opts = {
  validate,
};

const RenderRepeatableField = () => (
  <MemoryRouter>
    <StripesFinalFormWrapper
      {...props}
      Form={RepeatableField}
      formOptions={opts}
    />
  </MemoryRouter>
);

describe('RepeatableField component', () => {
  beforeEach(() => (
    renderWithIntl(
      <RenderRepeatableField />,
      translationsProperties,
    )
  ));

  it('should display FieldRow component', () => {
    expect(screen.getByTestId('field-row-container')).toBeDefined();
  });

  it('should display first and second fields of the row', () => {
    expect(document.querySelector('#localAgency')).toBeDefined();
    expect(document.querySelector('#FOLIOLibraries')).toBeDefined();
  });

  it('should display "add" button', () => {
    expect(screen.getByRole('button', { name: 'Add' })).toBeDefined();
  });

  it('should display "remove" button', () => {
    expect(screen.getByRole('button', { name: 'remove fields for 1' })).toBeDefined();
  });

  it('should have focused on the first field on a new row after clicking the "add" button', () => {
    userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(document.querySelector('#localAgency[data-key="1"]')).toHaveFocus();
  });

  describe('field validation', () => {
    it('should appear "Required" message after defocused if field is empty', () => {
      const field = document.querySelector('#localAgency[data-key="0"]');

      field.focus();
      expect(field).toHaveFocus();
      field.blur();
      expect(field).not.toHaveFocus();
      expect(screen.getByText('Required')).toBeDefined();
    });

    it('should appear "Please enter a 5 character string in lower case"', () => {
      const field = document.querySelector('#localAgency[data-key="0"]');

      userEvent.type(field, 'abc');
      field.blur();
      expect(screen.getByText('Please enter a 5 character string in lower case')).toBeDefined();
    });

    it('should not appear a validation message', () => {
      const field = document.querySelector('#localAgency[data-key="0"]');

      userEvent.type(field, 'abcde');
      expect(document.querySelector('div[class^="feedbackError---"]')).toBeNull();
    });
  });

  describe('buttons', () => {
    it('should have disabled the "remove" button when there is only one field row', () => {
      expect(screen.getByRole('button', { name: 'remove fields for 1' })).toBeDisabled();
    });

    it('should have enabled the "remove" button when there are two or more field rows', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add' }));
      expect(screen.getByRole('button', { name: 'remove fields for 1' })).toBeEnabled();
    });

    it('should add new field row by clicking on "add" button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add' }));
      expect(screen.getAllByTestId('repeatable-field-row')).toHaveLength(2);
    });

    it('should remove one field row by clicking on "remove" button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add' }));
      userEvent.click(screen.getByRole('button', { name: 'remove fields for 1' }));
      expect(screen.getAllByTestId('repeatable-field-row')).toHaveLength(1);
    });
  });
});
