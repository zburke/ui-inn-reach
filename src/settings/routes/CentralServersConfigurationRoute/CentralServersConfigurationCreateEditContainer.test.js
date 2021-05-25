import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import userEvent from '@testing-library/user-event';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { translationsProperties } from '../../../../test/jest/helpers';
import CentralServersConfigurationCreateEditContainer from './CentralServersConfigurationCreateEditContainer';
import CentralServersConfigurationForm
  from '../../components/CentralServersConfiguration/CentralServersConfigurationForm';

const records = {
  id: '12345',
  name: 'Andromeda',
  localServerCode: 'tandr',
  loanTypeId: 'e17acc08-b8ca-469a-a984-d9249faad178',
  centralServerAddress: 'https://opentown-lib.edu/andromeda',
  centralServerKey: '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d',
  centralServerSecret: '6ed636c9-eeff-4473-86bd-618430075c25',
  localAgencies: [
    {
      id: '111',
      code: 'PERK',
      folioLibraryIds: ['c3c85d4c-e6fc-4905-bd12-abfa730584e3'],
    },
  ],
  localServerKey: '232c29b8-d94d-4511-9110-00d5b31b7ff1',
  localServerSecret: 'b48a846a-0722-4e28-babb-2c245114fc72',
  description: 'some description',
};

jest.mock('../../components/CentralServersConfiguration/CentralServersConfigurationForm', () => {
  return jest.fn(() => 'CentralServersConfigurationForm');
});

const renderContainer = ({
  initialValues = undefined,
  isCentralServerDataInvalid = false,
  isLocalServerToPrevValue = false,
  saveLocalServerKeypair = jest.fn(),
  changeIsLocalServerToPrevValue = jest.fn(),
  onFormCancel = jest.fn(),
  onSubmit = jest.fn(),
  openModal = false,
  modalContent,
  onModalCancel = jest.fn(),
  onModalConfirm = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <MemoryRouter>
      <CentralServersConfigurationCreateEditContainer
        initialValues={initialValues}
        isCentralServerDataInvalid={isCentralServerDataInvalid}
        isLocalServerToPrevValue={isLocalServerToPrevValue}
        openModal={openModal}
        modalContent={modalContent}
        saveLocalServerKeypair={saveLocalServerKeypair}
        changeIsLocalServerToPrevValue={changeIsLocalServerToPrevValue}
        onFormCancel={onFormCancel}
        onSubmit={onSubmit}
        onModalCancel={onModalCancel}
        onModalConfirm={onModalConfirm}
      />
    </MemoryRouter>,
    translationsProperties
  );
};

describe('CentralServersConfigurationCreateEditContainer', () => {
  beforeEach(() => {
    CentralServersConfigurationForm.mockClear();
  });

  it('should display CentralServersConfigurationForm', () => {
    const { getByText } = renderContainer();

    expect(getByText('CentralServersConfigurationForm')).toBeDefined();
  });

  it('should pass required props to CentralServersConfigurationForm', () => {
    const props = {
      initialValues: records,
      isCentralServerDataInvalid: false,
      isLocalServerToPrevValue: false,
      saveLocalServerKeypair: jest.fn(),
      changeIsLocalServerToPrevValue: jest.fn(),
      onFormCancel: jest.fn(),
      onSubmit: jest.fn(),
    };

    renderContainer(props);

    expect(CentralServersConfigurationForm.mock.calls[0][0].initialValues).toEqual(props.initialValues);
    expect(CentralServersConfigurationForm.mock.calls[0][0].isCentralServerDataInvalid).toEqual(props.isCentralServerDataInvalid);
    expect(CentralServersConfigurationForm.mock.calls[0][0].isLocalServerToPrevValue).toEqual(props.isLocalServerToPrevValue);
    expect(CentralServersConfigurationForm.mock.calls[0][0].saveLocalServerKeypair).toEqual(props.saveLocalServerKeypair);
    expect(CentralServersConfigurationForm.mock.calls[0][0].changeIsLocalServerToPrevValue).toEqual(props.changeIsLocalServerToPrevValue);
    expect(CentralServersConfigurationForm.mock.calls[0][0].onCancel).toEqual(props.onFormCancel);
    expect(CentralServersConfigurationForm.mock.calls[0][0].onSubmit).toEqual(props.onSubmit);
  });

  describe('ConfirmationModal', () => {
    it('should be open when openModal prop is true', () => {
      renderContainer({ openModal: true });
      const modal = document.querySelector('#cancel-editing-confirmation');

      expect(modal).toBeDefined();
    });

    describe('content', () => {
      it('should display default content', () => {
        const { getByText } = renderContainer({ openModal: true });

        expect(getByText('Are you sure?')).toBeDefined();
        expect(getByText('There are unsaved changes')).toBeDefined();
        expect(getByText('Close without saving')).toBeDefined();
        expect(getByText('Keep editing')).toBeDefined();
      });

      it('should display custom content', () => {
        const { getByText } = renderContainer({
          openModal: true,
          modalContent: {
            heading: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-heading.updateLocalServerKeyConfirmation" />,
            message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-message.updateLocalServerKeypair" />,
            cancelLabel: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.modal-confirmLabel.keepEditing" />,
            confirmLabel: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-button.confirm" />,
          }
        });

        expect(getByText('Update Local Server Key Confirmation')).toBeDefined();
        expect(getByText('You have updated the Local Server Key/Secret pair. INN-Reach circulation functions will be interrupted until this information is updated by the Central Server administrator. Click “Confirm” to save your changes and download a JSON file with the new key and secret values.')).toBeDefined();
        expect(getByText('Keep editing')).toBeDefined();
        expect(getByText('Confirm')).toBeDefined();
      });
    });

    it('should call onModalConfirm prop', () => {
      const onModalConfirm = jest.fn();

      renderContainer({
        openModal: true,
        onModalConfirm,
      });

      const confirmButton = document.querySelector('[data-test-confirmation-modal-confirm-button]');

      userEvent.click(confirmButton);
      expect(onModalConfirm).toHaveBeenCalled();
    });

    it('should call onModalCancel prop', () => {
      const onModalCancel = jest.fn();

      renderContainer({
        openModal: true,
        onModalCancel,
      });

      const cancelButton = document.querySelector('[data-test-confirmation-modal-cancel-button]');

      userEvent.click(cancelButton);
      expect(onModalCancel).toHaveBeenCalled();
    });
  });
});
