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
      label: 'Reading room',
      value: '2e48e713-17f3-4c13-a9f8-23845bb210a4',
    },
  ],
};

const initialValues = {
  localAgencies: [
    {
      localAgency: '',
      FOLIOLibraries: '',
    },
  ],
};

const RenderForm = () => {
  return (
    <MemoryRouter>
      <CentralServersConfigurationForm
        data={data}
        initialValues={initialValues}
        isCentralServerDataInvalid={false}
        saveLocalServerKeypair={jest.fn}
        pristine={false}
        submitting={false}
        onSubmit={jest.fn}
        onCancel={jest.fn}
      />
    </MemoryRouter>
  );
};

describe('CentralServerConfigurationForm component', () => {
  beforeEach(() => (
    renderWithIntl(
      <RenderForm />,
      translationsProperties,
    )
  ));

  it('should display title', () => {
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });

  it('should display form', () => {
    expect(screen.getByTestId('central-server-configuration-form')).toBeInTheDocument();
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
      userEvent.type(screen.getByRole('textbox', { name: 'Local server code' }), '6andr');
      userEvent.type(screen.getByRole('textbox', { name: 'Local agency' }), '6gala');
      userEvent.type(screen.getByRole('combobox', { name: 'Borrowed item loan type' }), 'r{enter}');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server address' }), 'https://opentown-lib.edu/andromeda');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server key' }), '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d');
      userEvent.type(screen.getByRole('textbox', { name: 'Central server secret' }), '6ed636c9-eeff-4473-86bd-618430075c25');
      userEvent.type(screen.getByRole('textbox', { name: 'Local server key' }), 'a6b20a47-9dc6-4d0d-8d4d-af485869ffb7');
      userEvent.type(screen.getByRole('textbox', { name: 'Local server secret' }), '0a583b28-4006-48d1-a3d1-ec81ea33184b');
      expect(screen.getByTestId('save-button')).toBeDisabled();
    });
  });
});
