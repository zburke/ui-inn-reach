import React, {
  useEffect,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  omit,
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
  CONTRIBUTION_CRITERIA,
} from '../../../constants';
import ContributionCriteriaForm from '../../components/ContributionCriteria/ContributionCriteriaForm';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';

const {
  CENTRAL_SERVER_ID,
  LOCATIONS_IDS,
} = CONTRIBUTION_CRITERIA;

export const DEFAULT_VALUES = {
  [LOCATIONS_IDS]: [],
};

const ContributionCriteriaCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
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

  const handleSubmit = (record) => {
    const saveMethod = contributionCriteria
      ? mutator.contributionCriteria.PUT
      : mutator.contributionCriteriaCreate.POST;
    const FOLIOLocations = record[LOCATIONS_IDS];
    const finalRecord = {
      ...omit(record, LOCATIONS_IDS),
      centralServerId: selectedServer.id,
    };

    if (FOLIOLocations.length) {
      finalRecord[LOCATIONS_IDS] = FOLIOLocations.map(({ value }) => value);
    }

    saveMethod(finalRecord)
      .then(() => {
        const action = contributionCriteria ? 'update' : 'create';

        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.${action}.success`} /> });
      })
      .catch(() => {
        const action = contributionCriteria ? 'put' : 'post';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setIsContributionCriteriaPending(true);

      mutator.contributionCriteria.GET()
        .then(response => setContributionCriteria(response))
        .catch(() => null)
        .finally(() => setIsContributionCriteriaPending(false));
    }
  }, [selectedServer]);

  useEffect(() => {
    if (contributionCriteria) {
      const locationIds = contributionCriteria[LOCATIONS_IDS];
      const originalValues = {
        ...DEFAULT_VALUES,
        ...omit(contributionCriteria, LOCATIONS_IDS, CENTRAL_SERVER_ID),
      };

      if (locationIds) {
        const formattedLocations = locationIds.map(id => ({
          value: id,
          label: folioLocations.find(location => location.id === id)?.name,
        }));

        originalValues[LOCATIONS_IDS] = formattedLocations;
      }

      setInitialValues(originalValues);
    }
  }, [contributionCriteria]);

  if (isServersPending) return <LoadingPane />;

  return (
    <>
      <ContributionCriteriaForm
        selectedServer={selectedServer}
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
        heading={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.create-edit.modal-heading.areYouSure" />}
        message={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.create-edit.modal-message.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.create-edit.modal-confirmLabel.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.settings.contribution-criteria.create-edit.modal-cancelLabel.closeWithoutSaving" />}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

ContributionCriteriaCreateEditRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
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
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  contributionCriteriaCreate: {
    type: 'okapi',
    path: 'inn-reach/central-servers/contribution-criteria',
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
    contributionCriteriaCreate: PropTypes.shape({
      POST: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(ContributionCriteriaCreateEditRoute);
