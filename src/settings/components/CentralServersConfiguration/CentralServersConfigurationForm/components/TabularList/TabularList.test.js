import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import StripesFinalFormWrapper from '@folio/stripes-final-form/lib/StripesFinalFormWrapper';
import userEvent from '@testing-library/user-event';

import { MultiSelection } from '@folio/stripes-components';
import TabularList from './TabularList';
import { translationsProperties } from '../../../../../../../test/jest/helpers';
import { validateLocalAgency } from '../../utils';
import { DEFAULT_VALUES } from '../../../../../routes/CentralServersConfigurationRoute/CentralServersConfigurationCreateEditContainer';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  MultiSelection: jest.fn(() => <div>MultiSelection</div>),
}));

const validate = (values) => ({
  ...validateLocalAgency(values.localAgencies),
});

const opts = {
  validate,
};

const librariesTypeOptions = [
  { label: 'Big Library', value: '0a9af79b-321b-43b7-908f-f26fb6096e89' },
  { label: 'Datalogisk Institut', value: '5d78803e-ca04-4b4a-aeae-2c63b924518b' },
  { label: 'Duane G. Meyer Library', value: 'ef261062-e582-43d0-a1fc-c32dfca1da22' },
  { label: 'libraryName', value: '70cf3473-77f2-4f5c-92c3-6489e65769e4' },
  { label: 'newLib', value: '0939ebc4-cf37-4968-841e-912c0c02eacf' },
  { label: 'Online', value: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe' },
  { label: 'test library', value: '9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56' },
];

describe('TabularList component', () => {
  beforeEach(() => {
    MultiSelection.mockClear();

    renderWithIntl(
      <MemoryRouter>
        <StripesFinalFormWrapper
          Form={TabularList}
          formOptions={opts}
          librariesTypeOptions={librariesTypeOptions}
          initialValues={DEFAULT_VALUES}
          onSubmit={jest.fn()}
        />
      </MemoryRouter>,
      translationsProperties,
    );
  });

  it('should display first and second fields of the row', () => {
    expect(document.querySelector('[id="localAgencies[0].localAgency-0"]')).toBeVisible();
    expect(screen.getByTestId('row').contains(screen.getByText('MultiSelection'))).toBeTruthy();
  });

  it('should display "add" button', () => {
    expect(screen.getByRole('button', { name: 'Add a new row' })).toBeVisible();
  });

  it('should display "remove" button', () => {
    expect(screen.getByRole('button', { name: 'Remove fields for row 1' })).toBeVisible();
  });

  it('should have focused on the first field on a new row after clicking the "add" button', () => {
    userEvent.click(screen.getByRole('button', { name: 'Add a new row' }));
    expect(document.querySelector('[id="localAgencies[1].localAgency-1"]')).toHaveFocus();
  });

  describe('field validation', () => {
    it('should appear "Required" message after defocused if field is empty', () => {
      const field = document.querySelector('[id="localAgencies[0].localAgency-0"]');

      field.focus();
      expect(field).toHaveFocus();
      field.blur();
      expect(field).not.toHaveFocus();
      expect(screen.getByText('Required')).toBeDefined();
    });

    it('should appear "Please enter a 5 character string in lower case"', () => {
      const field = document.querySelector('[id="localAgencies[0].localAgency-0"]');

      userEvent.type(field, 'abc');
      field.blur();
      expect(screen.getByText('Please enter a 5 character string in lower case')).toBeDefined();
    });

    it('should not appear a validation message', () => {
      const field = document.querySelector('[id="localAgencies[0].localAgency-0"]');

      userEvent.type(field, 'abcde');
      expect(document.querySelector('div[class^="feedbackError---"]')).toBeNull();
    });
  });

  describe('buttons', () => {
    it('should have disabled the "remove" button when there is only one field row', () => {
      expect(screen.getByRole('button', { name: 'Remove fields for row 1' })).toBeDisabled();
    });

    it('should have enabled the "remove" button when there are two or more field rows', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add a new row' }));
      expect(screen.getByRole('button', { name: 'Remove fields for row 1' })).toBeEnabled();
    });

    it('should add new field row by clicking on "add" button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add a new row' }));
      expect(screen.getAllByTestId('row')).toHaveLength(2);
    });

    it('should remove one field row by clicking on "remove" button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add a new row' }));
      userEvent.click(screen.getByRole('button', { name: 'Remove fields for row 1' }));
      expect(screen.getAllByTestId('row')).toHaveLength(1);
    });
  });
});
