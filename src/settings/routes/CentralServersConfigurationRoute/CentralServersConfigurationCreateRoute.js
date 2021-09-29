import React, {
  useState,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes/core';

import CentralServersConfigurationCreateEditContainer from './CentralServersConfigurationCreateEditContainer';
import {
  useCallout,
} from '../../../hooks';
import {
  downloadJsonFile,
  getCentralServerConfigurationListUrl,
} from '../../../utils';
import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import {
  getConvertedLocalAgenciesToCreateEdit,
} from './utils';
import {
  SettingsContext,
} from '../../../contexts';

const CentralServersConfigurationCreateRoute = ({
  history,
  mutator,
}) => {
  const unblockRef = useRef();
  const showCallout = useCallout();
  const [openModal, setOpenModal] = useState(false);
  const {
    onShowAllSections,
  } = useContext(SettingsContext);

  const navigateToList = () => history.push(getCentralServerConfigurationListUrl());

  const changeModalState = (value) => {
    setOpenModal(value);
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
  };

  const navigate = () => {
    if (unblockRef.current) unblockRef.current();
    navigateToList();
  };

  const handleModalCancel = () => {
    navigate();
  };

  const handleCreateRecord = (record) => {
    const {
      name,
      localServerKey,
      localServerSecret,
    } = record;

    const updatedRecord = {
      ...record,
      localAgencies: getConvertedLocalAgenciesToCreateEdit(record.localAgencies),
    };

    mutator.centralServerRecords.POST(updatedRecord)
      .then(() => {
        const fileName = `${name}-local-server-keypair`;
        const exportData = { localServerKey, localServerSecret };

        onShowAllSections();

        if (localServerKey && localServerSecret) {
          downloadJsonFile(exportData, fileName);
        }
        navigate();
        showCallout({ message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create.success" /> });
      })
      .catch(error => {
        let message;

        if (error.status === 400) {
          message = <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.invalidData" />;
        } else {
          message = <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.post" />;
        }

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message,
        });
      });
  };

  return (
    <CentralServersConfigurationCreateEditContainer
      openModal={openModal}
      history={history}
      unblockRef={unblockRef}
      onFormCancel={navigateToList}
      onSubmit={handleCreateRecord}
      onModalCancel={handleModalCancel}
      onModalConfirm={handleModalConfirm}
      onChangeModalState={changeModalState}
    />
  );
};

CentralServersConfigurationCreateRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    GET: {
      path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    },
    fetch: false,
    throwErrors: false,
  },
});

CentralServersConfigurationCreateRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(CentralServersConfigurationCreateRoute);
