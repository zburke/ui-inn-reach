import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ConfirmationModal,
  Layer,
} from '@folio/stripes-components';

import CentralServersConfigurationForm
  from '../../components/CentralServersConfiguration/CentralServersConfigurationForm';

export const DEFAULT_VALUES = {
  localAgencies: [
    {
      localAgency: '',
      FOLIOLibraries: [],
    }
  ],
};

const CentralServersConfigurationCreateEditContainer = ({
  initialValues,
  showPrevLocalServerValue,
  isCentralServerDataInvalid,
  onFormCancel,
  onSubmit,
  openModal,
  modalContent,
  onShowPreviousLocalServerValue,
  onMakeValidCentralServerData,
  onModalCancel,
  onModalConfirm,
}) => {
  const intl = useIntl();
  const fieldsInitialValues = {
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  return (
    <Layer
      isOpen
      inRootSet
      contentLabel={intl.formatMessage({ id: 'stripes-smart-components.sas.createEntry' })}
    >
      <CentralServersConfigurationForm
        initialValues={fieldsInitialValues}
        isCentralServerDataInvalid={isCentralServerDataInvalid}
        showPrevLocalServerValue={showPrevLocalServerValue}
        onShowPreviousLocalServerValue={onShowPreviousLocalServerValue}
        onMakeValidCentralServerData={onMakeValidCentralServerData}
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
  );
};

CentralServersConfigurationCreateEditContainer.propTypes = {
  openModal: PropTypes.bool.isRequired,
  onFormCancel: PropTypes.func.isRequired,
  onModalCancel: PropTypes.func.isRequired,
  onModalConfirm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isCentralServerDataInvalid: PropTypes.bool,
  modalContent: PropTypes.object,
  showPrevLocalServerValue: PropTypes.bool,
  onShowPreviousLocalServerValue: PropTypes.func,
};

CentralServersConfigurationCreateEditContainer.defaultProps = {
  initialValues: {},
  isCentralServerDataInvalid: false,
  modalContent: {},
};

export default CentralServersConfigurationCreateEditContainer;
