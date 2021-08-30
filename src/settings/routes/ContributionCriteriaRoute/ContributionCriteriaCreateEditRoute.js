import React, {
  useEffect,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  isEmpty,
} from 'lodash';
import {
  FormattedMessage,
} from 'react-intl';

import {
  ConfirmationModal,
  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
} from '../../../constants';
import ContributionCriteriaForm from '../../components/ContributionCriteria/ContributionCriteriaForm';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';
import {
  getFinalRecord,
  getInitialValues,
  DEFAULT_VALUES,
} from './utils';

const ContributionCriteriaCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
      hasLoaded: hasLoadedServers,
    },
    folioLocations: {
      records: locations,
    },
    statisticalCodeTypes: {
      records: statisticalCodeTypesData,
    },
    statisticalCodes: {
      records: statisticalCodesData,
    },
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];

  const {
    selectedServer,
    openModal,
    isResetForm,
    isPristine,
    serverOptions,
    changePristineState,
    changeFormResetState,
    handleServerChange,
    handleModalConfirm,
    handleModalCancel,
  } = useCentralServers(history, servers);
  const showCallout = useCallout();
  const [contributionCriteria, setContributionCriteria] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [isContributionCriteriaPending, setIsContributionCriteriaPending] = useState(false);

  const folioLocations = locations[0]?.locations || [];
  const statisticalCodeTypes = statisticalCodeTypesData[0]?.statisticalCodeTypes || [];
  const statisticalCodes = statisticalCodesData[0]?.statisticalCodes || [];

  const fetchContributionCriteria = () => {
    mutator.contributionCriteria.GET()
      .then(response => setContributionCriteria(response))
      .catch(() => null)
      .finally(() => setIsContributionCriteriaPending(false));
  };

  const handleSubmit = (record) => {
    const { contributionCriteria: { POST, PUT } } = mutator;
    const saveMethod = isEmpty(contributionCriteria) ? POST : PUT;
    const finalRecord = getFinalRecord(record);

    saveMethod(finalRecord)
      .then(() => {
        const action = isEmpty(contributionCriteria) ? 'create' : 'update';

        setContributionCriteria(finalRecord);
        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.${action}.success`} /> });
      })
      .catch(() => {
        const action = isEmpty(contributionCriteria) ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setInitialValues(DEFAULT_VALUES);
      setContributionCriteria({});
      setIsContributionCriteriaPending(true);
      fetchContributionCriteria();
    }
  }, [selectedServer]);

  useEffect(() => {
    if (!isEmpty(contributionCriteria)) {
      const originalValues = getInitialValues(contributionCriteria, folioLocations);

      setInitialValues(originalValues);
    }
  }, [contributionCriteria]);

  if (isServersPending && !hasLoadedServers) return <LoadingPane />;

  return (
    <>
      <ContributionCriteriaForm
        selectedServer={selectedServer}
        contributionCriteria={contributionCriteria}
        isContributionCriteriaPending={isContributionCriteriaPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        initialValues={initialValues}
        folioLocations={folioLocations}
        statisticalCodes={statisticalCodes}
        statisticalCodeTypes={statisticalCodeTypes}
        isResetForm={isResetForm}
        onSubmit={handleSubmit}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={handleServerChange}
      />
      <ConfirmationModal
        id="cancel-editing-confirmation"
        open={openModal}
        heading={<FormattedMessage id="ui-inn-reach.modal.heading.areYouSure" />}
        message={<FormattedMessage id="ui-inn-reach.modal.message.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.modal.confirmLabel.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.modal.cancelLabel.closeWithoutSaving" />}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

ContributionCriteriaCreateEditRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  folioLocations: {
    type: 'okapi',
    path: 'locations?limit=1000&query=cql.allRecords%3D1%20sortby%20name',
    throwErrors: false,
  },
  statisticalCodes: {
    type: 'okapi',
    path: 'statistical-codes?query=cql.allRecords=1%20sortby%20code&limit=2000',
    throwErrors: false,
  },
  statisticalCodeTypes: {
    type: 'okapi',
    path: 'statistical-code-types?query=cql.allRecords=1%20&limit=500',
    throwErrors: false,
  },
  selectedServerId: { initialValue: '' },
  contributionCriteria: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/contribution-criteria',
    clientGeneratePk: false,
    pk: '',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

ContributionCriteriaCreateEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
      hasLoaded: PropTypes.bool.isRequired,
    }).isRequired,
    folioLocations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    statisticalCodes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    statisticalCodeTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    contributionCriteria: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(ContributionCriteriaCreateEditRoute);
