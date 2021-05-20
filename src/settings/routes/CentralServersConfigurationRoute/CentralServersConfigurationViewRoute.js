import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
} from '@folio/stripes-core';
import {
  LoadingPane,
  ConfirmationModal,
} from '@folio/stripes/components';

import {
  CentralServersConfigurationView,
} from '../../components';
import {
  EntityNotFound,
} from '../../components/common';

import {
  getCentralServerConfigurationListUrl,
  getCentralServerConfigurationEditUrl,
} from '../../../utils';
import {
  useCallout,
} from '../../../hooks';
import {
  DEFAULT_PANE_WIDTH,
  CALLOUT_ERROR_TYPE,
  ENTITY_NOT_FOUND_STATUS_CODE,
  FILL_PANE_WIDTH,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../constants';

const CentralServersConfigurationViewRoute = ({
  history,
  location,
  mutator,
  match: {
    params: {
      id,
    },
  },
}) => {
  const [centralServer, setCentralServer] = useState({});
  const [isLoaded, setIsLoaded] = useState(true);
  const [isFailed, setIsFailed] = useState(true);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const showCallout = useCallout();

  useEffect(
    () => {
      setIsLoaded(false);
      setIsFailed(false);
      mutator.viewCentralServersConfiguration.GET()
        .then(response => setCentralServer(response))
        .then(() => setIsLoaded(true))
        .catch(() => {
          setIsLoaded(true);
          setIsFailed(true);
        });
    },
    [id],
  );

  const getTitle = () => (
    <FormattedMessage
      id="ui-inn-reach.settings.central-servers.view.title"
      values={{ name: centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME] }}
    />
  );

  const confirmationModal = () => setConfirmDeleteModalOpen(!isConfirmDeleteModalOpen);

  const onEdit = useCallback(() => {
    history.push(getCentralServerConfigurationEditUrl(id, location.search));
  }, [location.search, history, id]);

  const onDelete = () => {
    setConfirmDeleteModalOpen(false);
    mutator.viewCentralServersConfiguration.DELETE({ id })
      .then(() => {
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.deleted" />
        });
        history.replace({
          pathname: getCentralServerConfigurationListUrl(),
          search: location.search,
        });
      })
      .catch(({ status }) => {
        if (status === ENTITY_NOT_FOUND_STATUS_CODE) {
          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.failedToDelete.delete" />,
          });
        } else {
          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.callout.connectionProblem.delete" />,
          });
        }
      });
  };

  const onBackToList = useCallback(() => {
    history.push({
      pathname: getCentralServerConfigurationListUrl(),
      search: location.search,
    });
  }, [history, location.search]);

  if (!isLoaded) {
    return (
      <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />
    );
  }

  if (isFailed) {
    return (
      <EntityNotFound
        pageTitleTranslationKey="ui-inn-reach.settings.central-server-configuration.view.notFound.title"
        errorTextTranslationKey="ui-inn-reach.settings.central-server-configuration.view.notFound.text"
        paneWidth={FILL_PANE_WIDTH}
        onBack={onBackToList}
      />
    );
  }

  return (
    <>
      <CentralServersConfigurationView
        paneTitle={getTitle}
        centralServer={centralServer}
        onBack={onBackToList}
        onDelete={confirmationModal}
        onEdit={onEdit}
      />
      <ConfirmationModal
        id="confirm-delete-central-server-modal"
        open={isConfirmDeleteModalOpen}
        heading={<FormattedMessage id="ui-inn-reach.settings.confirmDeleteModal.central-server-configuration.heading" />}
        message={<FormattedMessage
          id="ui-inn-reach.settings.confirmDeleteModal.central-server-configuration.message"
          values={{ name: centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME] }}
        />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.settings.confirmDeleteModal.central-server-configuration.confirm" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.settings.confirmDeleteModal.central-server-configuration.cancel" />}
        onConfirm={onDelete}
        onCancel={confirmationModal}
      />
    </>
  );
};

CentralServersConfigurationViewRoute.manifest = Object.freeze({
  viewCentralServersConfiguration: {
    type: 'okapi',
    path: 'inn-reach/central-servers/:{id}',
    clientGeneratePk: false,
    throwErrors: false,
    accumulate: 'true',
    fetch: false,
    DELETE: {
      path: 'inn-reach/central-servers/:{id}',
    },
  },
});

CentralServersConfigurationViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    viewCentralServersConfiguration: PropTypes.shape({
      DELETE: PropTypes.func.isRequired,
      GET: PropTypes.func.isRequired,
    })
  }),
};

export default stripesConnect(CentralServersConfigurationViewRoute);
