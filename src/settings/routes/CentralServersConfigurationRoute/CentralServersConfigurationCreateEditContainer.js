import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ConfirmationModal,
  Layer,
  Paneset,
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
  history,
  initialValues,
  showPrevLocalServerValue,
  onFormCancel,
  onSubmit,
  openModal,
  isEditMode,
  modalContent,
  onShowPreviousLocalServerValue,
  onModalCancel,
  onModalConfirm,
  unblockRef,
  onChangeModalState,
}) => {
  const [isPristine, setIsPristine] = useState(true);
  const intl = useIntl();
  const fieldsInitialValues = {
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  const changePristineState = (value) => {
    setIsPristine(value);
  };

  useEffect(() => {
    unblockRef.current = history.block(() => {
      if (!isPristine) {
        onChangeModalState(true);
      }

      return isPristine;
    });

    return () => unblockRef.current();
  }, [isPristine, history]);

  return (
    <Paneset>
      <Layer
        isOpen
        inRootSet
        contentLabel={intl.formatMessage({ id: 'stripes-smart-components.sas.createEntry' })}
      >
        <CentralServersConfigurationForm
          initialValues={fieldsInitialValues}
          isEditMode={isEditMode}
          showPrevLocalServerValue={showPrevLocalServerValue}
          onShowPreviousLocalServerValue={onShowPreviousLocalServerValue}
          onCancel={onFormCancel}
          onSubmit={onSubmit}
          onChangePristineState={changePristineState}
        />
        <ConfirmationModal
          id="cancel-editing-confirmation"
          open={openModal}
          buttonStyle={modalContent?.confirmLabel ? 'default' : 'primary'}
          cancelButtonStyle={modalContent?.cancelLabel ? 'primary' : 'default'}
          heading={modalContent?.heading || <FormattedMessage id="ui-inn-reach.modal.heading.areYouSure" />}
          message={modalContent?.message || <FormattedMessage id="ui-inn-reach.modal.message.unsavedChanges" />}
          confirmLabel={modalContent?.confirmLabel || <FormattedMessage id="ui-inn-reach.modal.confirmLabel.keepEditing" />}
          cancelLabel={modalContent?.cancelLabel || <FormattedMessage id="ui-inn-reach.modal.cancelLabel.closeWithoutSaving" />}
          onCancel={onModalCancel}
          onConfirm={onModalConfirm}
        />
      </Layer>
    </Paneset>
  );
};

CentralServersConfigurationCreateEditContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  openModal: PropTypes.bool.isRequired,
  unblockRef: PropTypes.object.isRequired,
  onFormCancel: PropTypes.func.isRequired,
  onModalCancel: PropTypes.func.isRequired,
  onModalConfirm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  isEditMode: PropTypes.bool,
  modalContent: PropTypes.object,
  showPrevLocalServerValue: PropTypes.bool,
  onChangeModalState: PropTypes.func,
  onShowPreviousLocalServerValue: PropTypes.func,
};

CentralServersConfigurationCreateEditContainer.defaultProps = {
  initialValues: {},
  modalContent: {},
  isEditMode: false,
};

export default CentralServersConfigurationCreateEditContainer;
