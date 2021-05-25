import React, { memo } from 'react';
import {
  isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ConfirmationModal,
  Layer,
  Paneset,
} from '@folio/stripes-components';

import CentralServersConfigurationForm
  from '../../components/CentralServersConfiguration/CentralServersConfigurationForm';

const CentralServersConfigurationCreateEditContainer = ({
  initialValues,
  isLocalServerToPrevValue,
  isCentralServerDataInvalid,
  saveLocalServerKeypair,
  onFormCancel,
  onSubmit,
  openModal,
  modalContent,
  changeIsLocalServerToPrevValue,
  onModalCancel,
  onModalConfirm,
}) => {
  const intl = useIntl();

  return (
    <Paneset>
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'stripes-smart-components.sas.createEntry' })}
      >
        <CentralServersConfigurationForm
          initialValues={initialValues}
          isCentralServerDataInvalid={isCentralServerDataInvalid}
          isLocalServerToPrevValue={isLocalServerToPrevValue}
          saveLocalServerKeypair={saveLocalServerKeypair}
          changeIsLocalServerToPrevValue={changeIsLocalServerToPrevValue}
          onCancel={onFormCancel}
          onSubmit={onSubmit}
        />
        <ConfirmationModal
          id="cancel-editing-confirmation"
          open={openModal}
          heading={modalContent?.heading || <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.modal-heading.areYouSure" />}
          message={modalContent?.message || <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.modal-message.unsavedChanges" />}
          confirmLabel={modalContent?.confirmLabel || <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.modal-confirmLabel.keepEditing" />}
          cancelLabel={modalContent?.cancelLabel || <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.modal-cancelLabel.closeWithoutSaving" />}
          onCancel={onModalCancel}
          onConfirm={onModalConfirm}
        />
      </Layer>
    </Paneset>
  );
};

CentralServersConfigurationCreateEditContainer.propTypes = {
  changeIsLocalServerToPrevValue: PropTypes.func,
  initialValues: PropTypes.object,
  isCentralServerDataInvalid: PropTypes.bool,
  isLocalServerToPrevValue: PropTypes.bool,
  modalContent: PropTypes.object,
  openModal: PropTypes.bool,
  saveLocalServerKeypair: PropTypes.func,
  onFormCancel: PropTypes.func,
  onModalCancel: PropTypes.func,
  onModalConfirm: PropTypes.func,
  onSubmit: PropTypes.func,
};

CentralServersConfigurationCreateEditContainer.defaultProps = {
  isCentralServerDataInvalid: false,
  modalContent: {},
  openModal: false,
};

export default memo(CentralServersConfigurationCreateEditContainer, (prevProps, nextProps) => (
  isEqual(prevProps.initialValues, nextProps.initialValues) &&
  prevProps.isLocalServerToPrevValue === nextProps.isLocalServerToPrevValue &&
  prevProps.isCentralServerDataInvalid === nextProps.isCentralServerDataInvalid &&
  prevProps.openModal === nextProps.openModal &&
  isEqual(prevProps.modalContent, nextProps.modalContent)
));
