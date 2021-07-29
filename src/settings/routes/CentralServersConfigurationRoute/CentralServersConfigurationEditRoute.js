import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import LoadingPane from '@folio/stripes-components/lib/Loading/LoadingPane';

import CentralServersConfigurationCreateEditContainer from './CentralServersConfigurationCreateEditContainer';
import { EntityNotFound } from '../../components/common';

import { useCallout } from '../../../hooks';
import {
  downloadJsonFile,
  getCentralServerConfigurationViewUrl,
} from '../../../utils';
import {
  getConvertedLocalAgencies,
  getConvertedLocalAgenciesToCreateEdit,
} from './utils';
import {
  CALLOUT_ERROR_TYPE,
  DEFAULT_PANE_WIDTH,
  FILL_PANE_WIDTH,
} from '../../../constants';
import { CentralServersConfigurationContext } from '../../../contexts';

const CentralServersConfigurationEditRoute = ({
  history,
  match: {
    params: {
      id,
    },
  },
  resources: {
    centralServerRecord: {
      records,
      isPending,
      failed,
    },
  },
  mutator,
}) => {
  const unblockRef = useRef();
  const showCallout = useCallout();
  const {
    folioLibraries,
  } = useContext(CentralServersConfigurationContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [formData, setFormData] = useState({});
  const [showPrevLocalServerValue, setShowPrevLocalServerValue] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const navigateToView = () => history.push(getCentralServerConfigurationViewUrl(id));

  const changeModalState = (value) => {
    setOpenModal(value);
  };

  const isLocalServerKeypairChanged = (record) => (
    initialValues.localServerKey !== record.localServerKey &&
    initialValues.localServerSecret !== record.localServerSecret
  );

  const navigate = () => {
    unblockRef.current();
    navigateToView();
  };

  const saveData = (actualFormData) => {
    const {
      name,
      localServerKey,
      localServerSecret,
    } = actualFormData;

    const finalData = {
      ...actualFormData,
      localAgencies: getConvertedLocalAgenciesToCreateEdit(actualFormData.localAgencies),
    };

    mutator.centralServerRecord.PUT(finalData)
      .then(() => {
        if (isLocalServerKeypairChanged(actualFormData)) {
          const fileName = `${name}-local-server-keypair`;
          const exportData = { localServerKey, localServerSecret };

          if (localServerKey && localServerSecret) {
            downloadJsonFile(exportData, fileName);
          }
        }

        navigate();
        showCallout({ message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.update.success" /> });
      })
      .catch(error => {
        const message = error.status === 400
          ? <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.invalidData" />
          : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.put" />;

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message,
        });
      });
  };

  const handleModalCancel = () => {
    if (isLocalServerKeypairChanged(formData)) {
      setOpenModal(false);
      saveData(formData);
    } else {
      navigate();
    }
  };

  const handleModalConfirm = () => {
    if (isLocalServerKeypairChanged(formData)) {
      setShowPrevLocalServerValue(true);
    }

    setOpenModal(false);
  };

  const showPreviousLocalServerValue = (value) => {
    setShowPrevLocalServerValue(value);
  };

  const handleUpdateRecord = (record) => {
    const actualFormData = {
      ...initialValues,
      ...record,
    };

    if (isLocalServerKeypairChanged(record)) {
      setModalContent({
        heading: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-heading.updateLocalServerKeyConfirmation" />,
        message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-message.updateLocalServerKeypair" />,
        cancelLabel: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-button.confirm" />,
        confirmLabel: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.edit.modal-button.keepEditing" />,
      });

      setFormData(actualFormData);
      setOpenModal(true);
    } else {
      saveData(actualFormData);
    }
  };

  useEffect(() => {
    if (records[0] && folioLibraries.length) {
      const originalValues = {
        ...records[0],
        localAgencies: getConvertedLocalAgencies(records[0].localAgencies, folioLibraries),
      };

      setInitialValues(originalValues);
      setFormData(originalValues);
    }
  }, [records, folioLibraries]);

  if (isPending) {
    return <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />;
  }

  if (failed) {
    return (
      <EntityNotFound
        pageTitleTranslationKey="ui-inn-reach.settings.central-server-configuration.edit.notFound.title"
        errorTextTranslationKey="ui-inn-reach.settings.central-server-configuration.edit.notFound.text"
        paneWidth={FILL_PANE_WIDTH}
        onBack={navigateToView}
      />
    );
  }

  return (
    <CentralServersConfigurationCreateEditContainer
      history={history}
      initialValues={initialValues}
      showPrevLocalServerValue={showPrevLocalServerValue}
      openModal={openModal}
      modalContent={modalContent}
      unblockRef={unblockRef}
      onShowPreviousLocalServerValue={showPreviousLocalServerValue}
      onFormCancel={navigateToView}
      onSubmit={handleUpdateRecord}
      onModalCancel={handleModalCancel}
      onModalConfirm={handleModalConfirm}
      onChangeModalState={changeModalState}
    />
  );
};

CentralServersConfigurationEditRoute.manifest = Object.freeze({
  centralServerRecord: {
    type: 'okapi',
    path: 'inn-reach/central-servers/:{id}',
    throwErrors: false,
  },
});

CentralServersConfigurationEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  resources: PropTypes.shape({
    centralServerRecord: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      isPending: PropTypes.bool,
      failed: PropTypes.bool,
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    centralServerRecord: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(CentralServersConfigurationEditRoute);
