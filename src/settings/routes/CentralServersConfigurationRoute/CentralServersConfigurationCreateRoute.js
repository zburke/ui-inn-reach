import React, {
  useEffect,
  useState,
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
import { CALLOUT_ERROR_TYPE } from '../../../constants';
import {
  getConvertedLocalAgenciesToCreateEdit,
} from './utils';

const CentralServersConfigurationCreateRoute = ({
  history,
  mutator,
}) => {
  const showCallout = useCallout();
  const [localServerKeypair, setLocalServerKeypair] = useState({});
  const [isCentralServerDataInvalid, setIsCentralServerDataInvalid] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigateToList = () => history.push(getCentralServerConfigurationListUrl());

  const handleModalConfirm = () => {
    setIsCentralServerDataInvalid(true);
    setOpenModal(false);
  };

  const saveLocalServerKeypair = (exportData) => {
    setLocalServerKeypair(exportData);
  };

  const handleCreateRecord = (record) => {
    const updatedRecord = {
      ...record,
      localAgencies: getConvertedLocalAgenciesToCreateEdit(record.localAgencies),
    };

    mutator.centralServerRecords.POST(updatedRecord)
      .then(() => {
        const fileName = `${record.name}-local-server-keypair`;

        setIsCentralServerDataInvalid(false);
        downloadJsonFile(localServerKeypair, fileName);
        navigateToList();
        showCallout({ message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create.success" /> });
      })
      .catch(error => {
        let message;

        if (error.status === 400) {
          setIsCentralServerDataInvalid(true);
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

  useEffect(() => {
    const unblock = history.block(() => {
      if (isCentralServerDataInvalid) {
        setOpenModal(true);
        setIsCentralServerDataInvalid(false);
      }

      return !isCentralServerDataInvalid;
    });

    return () => unblock();
  }, [isCentralServerDataInvalid]);

  return (
    <CentralServersConfigurationCreateEditContainer
      isCentralServerDataInvalid={isCentralServerDataInvalid}
      openModal={openModal}
      saveLocalServerKeypair={saveLocalServerKeypair}
      onFormCancel={navigateToList}
      onSubmit={handleCreateRecord}
      onModalCancel={navigateToList}
      onModalConfirm={handleModalConfirm}
    />
  );
};

CentralServersConfigurationCreateRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
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
