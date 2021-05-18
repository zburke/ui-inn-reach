import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  Paneset,
  Layer,
  ConfirmationModal,
} from '@folio/stripes-components';

import CentralServersConfigurationForm from './CentralServersConfigurationForm';
import {
  CALLOUT_ERROR_TYPE,
  LOCAL_AGENCIES_FIELDS,
} from '../../../../constants';
import {
  downloadJsonFile,
  getCentralServerConfigurationListUrl,
} from '../../../../utils';
import {
  useCallout,
} from '../../../../hooks';

const initialValues = {
  localAgencies: [
    {
      localAgency: '',
      FOLIOLibraries: '',
    }
  ],
};

const CentralServersConfigurationFormContainer = ({
  history,
  location,
  mutator,
  children,
  data,
}) => {
  const showCallout = useCallout();
  const intl = useIntl();
  const [localServerKeypair, setLocalServerKeypair] = useState({});
  const [isCentralServerDataInvalid, setIsCentralServerDataInvalid] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigateToList = () => history.push({
    pathname: getCentralServerConfigurationListUrl(),
    search: location.search
  });

  const handleKeepEditing = () => {
    setIsCentralServerDataInvalid(true);
    setOpenModal(false);
  };

  const saveLocalServerKeypair = (exportData) => {
    setLocalServerKeypair(exportData);
  };

  const handleCreateRecord = (record) => {
    const localAgencies = record.localAgencies.reduce((accum, { localAgency, FOLIOLibraries }) => {
      if (localAgency && FOLIOLibraries) {
        accum.push({
          [LOCAL_AGENCIES_FIELDS.CODE]: localAgency,
          [LOCAL_AGENCIES_FIELDS.FOLIO_LIBRARY_IDs]: FOLIOLibraries.map(library => library.value),
        });
      }

      return accum;
    }, []);

    const instance = {
      ...record,
      localAgencies,
    };

    mutator.centralServerRecords.POST(instance)
      .then(() => {
        const fileName = `${instance.name}-local-server-keypair`;

        setIsCentralServerDataInvalid(false);
        downloadJsonFile(localServerKeypair, fileName);
        navigateToList();
        showCallout({ message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create.success" /> });
      })
      .catch(error => {
        let message;

        if (error.status === 400) {
          setIsCentralServerDataInvalid(true);
          message = <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create.invalidData" />;
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
    <Paneset>
      <Layer
        isOpen
        contentLabel={intl.formatMessage({ id: 'stripes-smart-components.sas.createEntry' })}
      >
        <>
          <CentralServersConfigurationForm
            data={data}
            initialValues={initialValues}
            isCentralServerDataInvalid={isCentralServerDataInvalid}
            saveLocalServerKeypair={saveLocalServerKeypair}
            onCancel={navigateToList}
            onSubmit={record => handleCreateRecord(record)}
          >
            {children}
          </CentralServersConfigurationForm>
          <ConfirmationModal
            id="cancel-editing-confirmation"
            open={openModal}
            message={<FormattedMessage id="stripes-form.unsavedChanges" />}
            heading={<FormattedMessage id="stripes-form.areYouSure" />}
            confirmLabel={<FormattedMessage id="stripes-form.keepEditing" />}
            cancelLabel={<FormattedMessage id="stripes-form.closeWithoutSaving" />}
            onCancel={navigateToList}
            onConfirm={handleKeepEditing}
          />
        </>
      </Layer>
    </Paneset>
  );
};

CentralServersConfigurationFormContainer.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
    fetch: false,
    throwErrors: false,
  },
});

CentralServersConfigurationFormContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node,
  mutator: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(CentralServersConfigurationFormContainer);
