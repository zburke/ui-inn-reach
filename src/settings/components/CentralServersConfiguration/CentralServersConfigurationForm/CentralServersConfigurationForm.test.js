import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import CentralServersConfigurationForm from './CentralServersConfigurationForm';

import { translationsProperties } from '../../../../../test/jest/helpers';
import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../constants';

const data = {
  folioLibraries: [
    {
      name: 'Online',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    },
    {
      name: 'Welcome',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fpgfkj',
    },
  ],
  loanTypes: [
    {
      name: 'Reading room',
      id: '2e48e713-17f3-4c13-a9f8-23845bb210a4',
    },
  ],
};

const initValues = {
  localAgencies: [
    {
      localAgency: '',
      FOLIOLibraries: '',
    },
  ],
};

const RenderForm = ({ onCancel, initialValues }) => {
  return (
    <MemoryRouter>
      <CentralServersConfigurationForm
        data={data}
        initialValues={initialValues}
        isCentralServerDataInvalid={false}
        saveLocalServerKeypair={jest.fn()}
        onSubmit={jest.fn()}
        onCancel={onCancel}
      />
    </MemoryRouter>
  );
};

describe('CentralServerConfigurationForm component', () => {
  const handleCancel = jest.fn();

  beforeEach(() => (
    renderWithIntl(
      <RenderForm
        initialValues={initValues}
        onCancel={handleCancel}
      />,
      translationsProperties,
    )
  ));

  it('should display "edit" title', () => {
    const initialVal = {
      id: '777',
      localAgencies: [
        {
          localAgency: '',
          FOLIOLibraries: '',
        },
      ],
    };

    renderWithIntl(
      <RenderForm
        initialValues={initialVal}
        onCancel={handleCancel}
      />,
      translationsProperties,
    );
    expect(screen.getByText('Edit')).toBeDefined();
  });

  it('should display title', () => {
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });

  it('should display "Collapse all" button', () => {
    expect(screen.getByText('Collapse all')).toBeDefined();
  });

  it('should have sections collapsed after clicking "Collapse all" button', () => {
    userEvent.click(document.querySelector('[data-tast-expand-button]'));
    expect(document.querySelector('#accordion-toggle-button-section1').getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('#accordion-toggle-button-section2').getAttribute('aria-expanded')).toBe('false');
    userEvent.click(document.querySelector('[data-tast-expand-button]'));
    expect(document.querySelector('#accordion-toggle-button-section1').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#accordion-toggle-button-section2').getAttribute('aria-expanded')).toBe('true');
  });

  it('should display form', () => {
    expect(screen.getByTestId('central-server-configuration-form')).toBeInTheDocument();
  });

  it('should invoke onCancel callback', () => {
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleCancel).toBeCalled();
  });

  describe('accordion', () => {
    it('should be collapsed after click', () => {
      const accordion1 = document.querySelector('#accordion-toggle-button-section1');
      const accordion2 = document.querySelector('#accordion-toggle-button-section2');

      expect(accordion1.getAttribute('aria-expanded')).toBe('true');
      expect(accordion2.getAttribute('aria-expanded')).toBe('true');
      userEvent.click(accordion1);
      userEvent.click(accordion2);
      expect(accordion1.getAttribute('aria-expanded')).toBe('false');
      expect(accordion2.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('local server code field', () => {
    it('should be empty', () => {
      expect(screen.getByRole('textbox', { name: 'Local server code' })).not.toHaveValue();
    });

    it('should show "Required" error message', () => {
      const field = screen.getByRole('textbox', { name: 'Local server code' });

      field.focus();
      expect(field).toHaveFocus();
      field.blur();
      expect(screen.getByText('Required')).toBeDefined();
    });

    it('should show "Please enter a 5 character string in lower case"', () => {
      const field = screen.getByRole('textbox', { name: 'Local server code' });

      userEvent.type(field, 'abc');
      field.blur();
      expect(screen.getByText('Please enter a 5 character string in lower case')).toBeDefined();
    });
  });

  describe('local server fields', () => {
    let localServerKey;
    let localServerSecret;

    beforeEach(() => {
      localServerKey = screen.getByTestId(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_KEY);
      localServerSecret = screen.getByTestId(CENTRAL_SERVER_CONFIGURATION_FIELDS.LOCAL_SERVER_SECRET);
    });

    it('should be empty', () => {
      expect(localServerKey).toHaveValue('');
      expect(localServerSecret).toHaveValue('');
    });

    it('should be disabled', () => {
      expect(localServerKey).toBeDisabled();
      expect(localServerSecret).toBeDisabled();
    });

    it('should have an uuid after clicking on the "Generate keypair" button', () => {
      userEvent.click(screen.getByTestId('generate-keypair'));
      expect(localServerKey.value.length).toBe(36);
      expect(localServerSecret.value.length).toBe(36);
    });
  });

  describe('footer pane', () => {
    it('should display "save" and "cancel" buttons', () => {
      expect(screen.getByText('Save & close')).toBeDefined();
      expect(screen.getByText('Cancel')).toBeDefined();
    });

    it('should have disabled "Save & close" button by default', () => {
      expect(screen.getByTestId('save-button')).toBeDisabled();
    });

    it('should have the "Save & close" button disabled if not all required fields are filled', () => {
      userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Andromeda');
      userEvent.type(screen.getByRole('textbox', { name: 'Local server code' }), 'tandr');
      userEvent.type(screen.getByRole('textbox', { name: 'Local agency' }), 'tgala');
      userEvent.type(screen.getByRole('combobox', { name: 'Borrowed item loan type' }), 'r{enter}');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server address' }), 'https://opentown-lib.edu/andromeda');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server key' }), '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server secret' }), '6ed636c9-eeff-4473-86bd-618430075c25');
      expect(screen.getByTestId('save-button')).toBeDisabled();
    });
  });
});
