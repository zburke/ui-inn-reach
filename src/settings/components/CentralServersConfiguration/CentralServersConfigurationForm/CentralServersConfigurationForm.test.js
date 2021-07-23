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
import { CentralServersConfigurationContext } from '../../../../contexts';

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
      id: 'ac19815e-1d8e-473f-bd5a-3193cb301b8b',
    },
    {
      name: 'mics',
      id: 'e17acc08-b8ca-469a-a984-d9249faad178',
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

const renderForm = ({
  onCancel,
  initialValues,
  onSubmit,
  showPrevLocalServerValue,
  onShowPreviousLocalServerValue,
  onChangePristineState,
}) => {
  return renderWithIntl(
    <MemoryRouter>
      <CentralServersConfigurationContext.Provider value={data}>
        <CentralServersConfigurationForm
          initialValues={initialValues}
          showPrevLocalServerValue={showPrevLocalServerValue}
          onSaveLocalServerKeypair={jest.fn()}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onShowPreviousLocalServerValue={onShowPreviousLocalServerValue}
          onChangePristineState={onChangePristineState}
        />
      </CentralServersConfigurationContext.Provider>
    </MemoryRouter>,
    translationsProperties,
  );
};

describe('CentralServerConfigurationForm component', () => {
  const handleCancel = jest.fn();
  const handleSubmit = jest.fn();
  const onShowPreviousLocalServerValue = jest.fn();
  const onChangePristineState = jest.fn();
  const commonProps = {
    initialValues: initValues,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onChangePristineState,
  };

  it('should display "edit" title', () => {
    renderForm({
      ...commonProps,
      initialValues: { ...initValues, id: '777' },
    });
    expect(screen.getByText('Edit')).toBeDefined();
  });

  it('should display title', () => {
    renderForm(commonProps);
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });

  it('should display "Collapse all" button', () => {
    renderForm(commonProps);
    expect(screen.getByText('Collapse all')).toBeDefined();
  });

  it('should have sections collapsed after clicking "Collapse all" button', () => {
    renderForm(commonProps);
    userEvent.click(document.querySelector('[data-tast-expand-button]'));
    expect(document.querySelector('#accordion-toggle-button-section1').getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('#accordion-toggle-button-section2').getAttribute('aria-expanded')).toBe('false');
    userEvent.click(document.querySelector('[data-tast-expand-button]'));
    expect(document.querySelector('#accordion-toggle-button-section1').getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#accordion-toggle-button-section2').getAttribute('aria-expanded')).toBe('true');
  });

  it('should display form', () => {
    renderForm(commonProps);
    expect(screen.getByTestId('central-server-configuration-form')).toBeInTheDocument();
  });

  it('should invoke onCancel callback', () => {
    renderForm(commonProps);
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleCancel).toBeCalled();
  });

  it('should show the original data of the local server', () => {
    const originalValues = {
      ...initValues,
      localServerKey: 'testKey',
      localServerSecret: 'testSecret',
    };

    renderForm({
      ...commonProps,
      initialValues: originalValues,
      showPrevLocalServerValue: true,
      onShowPreviousLocalServerValue,
    });

    expect(onShowPreviousLocalServerValue).toHaveBeenCalledWith(false);
  });

  it('should render disabled save button', () => {
    const { getByTestId } = renderForm({
      ...commonProps,
      isCentralServerDataInvalid: true,
    });

    expect(getByTestId('save-button')).toBeDisabled();
  });

  describe('accordion', () => {
    it('should be collapsed after click', () => {
      renderForm(commonProps);
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
      renderForm(commonProps);
      expect(screen.getByRole('textbox', { name: 'Local server code' })).not.toHaveValue();
    });

    it('should show "Required" error message', () => {
      renderForm(commonProps);
      const field = screen.getByRole('textbox', { name: 'Local server code' });

      field.focus();
      expect(field).toHaveFocus();
      field.blur();
      expect(screen.getByText('Required')).toBeDefined();
    });

    it('should show "Please enter a 5 character string in lower case"', () => {
      renderForm(commonProps);
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
      renderForm(commonProps);
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
      renderForm(commonProps);
      expect(screen.getByText('Save & close')).toBeDefined();
      expect(screen.getByText('Cancel')).toBeDefined();
    });

    it('should have disabled "Save & close" button by default', () => {
      renderForm(commonProps);
      expect(screen.getByTestId('save-button')).toBeDisabled();
    });
  });
});
