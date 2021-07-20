import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  omit,
} from 'lodash';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  ConfirmationModal,
  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CONTRIBUTION_OPTIONS_FIELDS,
  STATUSES_LIST_OPTIONS,
} from '../../../constants';
import ContributionOptionsForm from '../../components/ContributionOptions/ContributionOptionsForm';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';

const {
  CENTRAL_SERVER_ID,
  STATUSES,
  LOAN_TYPE_IDS,
  LOCATION_IDS,
  MATERIAL_TYPE_IDS,
} = CONTRIBUTION_OPTIONS_FIELDS;

export const DEFAULT_VALUES = {
  [STATUSES]: [],
  [LOAN_TYPE_IDS]: [],
  [LOCATION_IDS]: [],
  [MATERIAL_TYPE_IDS]: [],
};

const ContributionOptionsCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
    },
    folioLocations: {
      records: locations,
    },
    loanTypes: {
      records: loanTypesData,
    },
    materialTypes: {
      records: materialTypesData,
    },
  },
  history,
  mutator,
}) => {
  const { formatMessage } = useIntl();

  const servers = centralServers[0]?.centralServers || [];
  const folioLocations = locations[0]?.locations || [];
  const materialTypes = materialTypesData[0]?.mtypes || [];
  const loanTypes = loanTypesData[0]?.loantypes || [];

  const [
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
  ] = useCentralServers(history, servers);
  const showCallout = useCallout();
  const [contributionOptions, setContributionOptions] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [isContributionOptionsPending, setIsContributionOptionsPending] = useState(false);

  const getFormatedStatusesOptions = useMemo(() => STATUSES_LIST_OPTIONS.map(status => ({
    label: formatMessage({ id: status.label }),
    value: status.value,
  })), [STATUSES_LIST_OPTIONS]);

  const handleSubmit = (record) => {
    const saveMethod = contributionOptions
      ? mutator.contributionOptions.PUT
      : mutator.contributionOptions.POST;
    const recordLocations = record[LOCATION_IDS];
    const recordStatuses = record[STATUSES];
    const recordLoanTypes = record[LOAN_TYPE_IDS];
    const recordMaterialTypes = record[MATERIAL_TYPE_IDS];
    const finalRecord = {
      ...omit(record, LOCATION_IDS, STATUSES, LOAN_TYPE_IDS, MATERIAL_TYPE_IDS),
      centralServerId: selectedServer.id,
    };

    if (recordLocations.length) {
      finalRecord[LOCATION_IDS] = recordLocations.map(({ value }) => value);
    }
    if (recordMaterialTypes.length) {
      finalRecord[MATERIAL_TYPE_IDS] = recordMaterialTypes.map(({ value }) => value);
    }
    if (recordLoanTypes.length) {
      finalRecord[LOAN_TYPE_IDS] = recordLoanTypes.map(({ value }) => value);
    }
    if (recordStatuses.length) {
      finalRecord[STATUSES] = recordStatuses.map(({ value }) => value);
    }

    saveMethod(finalRecord)
      .then(() => {
        const action = contributionOptions ? 'update' : 'create';

        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.contribution-options.${action}.success`} /> });
      })
      .catch(() => {
        const action = contributionOptions ? 'put' : 'post';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.contribution-options.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setIsContributionOptionsPending(true);

      mutator.contributionOptions.GET()
        .then(response => setContributionOptions(response))
        .catch(() => null)
        .finally(() => setIsContributionOptionsPending(false));
    }
  }, [selectedServer]);

  useEffect(() => {
    if (contributionOptions) {
      const locationIds = contributionOptions[LOCATION_IDS];
      const materialTypeIds = contributionOptions[MATERIAL_TYPE_IDS];
      const loanTypeIds = contributionOptions[LOAN_TYPE_IDS];
      const statuses = contributionOptions[STATUSES];

      const originalValues = {
        ...DEFAULT_VALUES,
        ...omit(contributionOptions, LOCATION_IDS, MATERIAL_TYPE_IDS, LOAN_TYPE_IDS, CENTRAL_SERVER_ID),
      };

      if (locationIds) {
        const formattedLocations = locationIds.map(id => ({
          value: id,
          label: folioLocations.find(location => location.id === id)?.name,
        }));

        originalValues[LOCATION_IDS] = formattedLocations;
      }

      if (materialTypeIds) {
        const formattedMaterialTypes = materialTypeIds.map(id => ({
          value: id,
          label: materialTypes.find(materialType => materialType.id === id)?.name,
        }));

        originalValues[MATERIAL_TYPE_IDS] = formattedMaterialTypes;
      }

      if (loanTypeIds) {
        const formattedLoanTypes = loanTypeIds.map(id => ({
          value: id,
          label: loanTypes.find(loanType => loanType.id === id)?.name,
        }));

        originalValues[LOAN_TYPE_IDS] = formattedLoanTypes;
      }

      if (statuses) {
        const formattedStatuses = statuses.map(value => ({
          value,
          label: formatMessage({ id: STATUSES_LIST_OPTIONS.find(statusOption => statusOption.value === value).label }),
        }));

        originalValues[STATUSES] = formattedStatuses;
      }

      setInitialValues(originalValues);
    }
  }, [contributionOptions]);

  if (isServersPending) return <LoadingPane />;

  return (
    <>
      <ConfirmationModal
        id="cancel-editing-confirmation"
        open={openModal}
        heading={<FormattedMessage id="ui-inn-reach.settings.contribution-options.create-edit.modal-heading.areYouSure" />}
        message={<FormattedMessage id="ui-inn-reach.settings.contribution-options.create-edit.modal-message.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.settings.contribution-options.create-edit.modal-confirmLabel.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.settings.contribution-options.create-edit.modal-cancelLabel.closeWithoutSaving" />}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
      <ContributionOptionsForm
        selectedServer={selectedServer}
        isContributionOptionsPending={isContributionOptionsPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        statusesOptions={getFormatedStatusesOptions}
        initialValues={initialValues}
        folioLocations={folioLocations}
        loanTypes={loanTypes}
        isResetForm={isResetForm}
        materialTypes={materialTypes}
        onSubmit={handleSubmit}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={handleServerChange}
      />
    </>
  );
};

ContributionOptionsCreateEditRoute.manifest = Object.freeze({
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
  loanTypes: {
    type: 'okapi',
    path: 'loan-types?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  selectedServerId: { initialValue: '' },
  contributionOptions: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/contribution-options',
    accumulate: true,
    clientGeneratePk: false,
    pk: '',
    fetch: false,
    throwErrors: false,
  },
});

ContributionOptionsCreateEditRoute.propTypes = {
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
    loanTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    contributionOptions: PropTypes.shape({
      GET: PropTypes.func,
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(ContributionOptionsCreateEditRoute);