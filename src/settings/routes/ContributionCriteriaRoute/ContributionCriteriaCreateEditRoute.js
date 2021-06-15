import React, {
  useEffect,
  useState,
} from 'react';
import {
  omit,
} from 'lodash';
import {
  FormattedMessage,
} from 'react-intl';
import {
  useParams,
} from 'react-router-dom';

import {
  ConfirmationModal,
  LoadingPane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CONTRIBUTION_CRITERIA,
  DEFAULT_PANE_WIDTH,
} from '../../../constants';
import ContributionCriteriaForm from '../../components/ContributionCriteria/ContributionCriteriaForm';
import { useCallout } from '../../../hooks';

const {
  CENTRAL_SERVER_ID,
  LOCATIONS_IDS,
} = CONTRIBUTION_CRITERIA;

export const DEFAULT_VALUES = {
  [LOCATIONS_IDS]: [],
};

const ContributionCriteriaCreateEditRoute = ({
  resources: {
    folioLocations: {
      records: locations,
      isPending: isLocationsPending,
    },
    statisticalCodeTypes: {
      records: statisticalCodeTypesData,
      isPending: isStatCodeTypesPending,
    },
    statisticalCodes: {
      records: statisticalCodesData,
      isPending: isStatCodesPending,
    },
    contributionCriteria: {
      failed: isCreation,
      records: contributionCriteria,
      isPending: isContributionCriteriaPending,
    },
  },
  history,
  isPristine,
  prevServerName,
  centralServersOptions,
  onChangePrevServerName,
  onChangePristineState,
  mutator,
  serverSelection,
  renderFooter,
}) => {
  const showCallout = useCallout();
  const { id: centralServerId } = useParams();

  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [openModal, setOpenModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [isResetForm, setIsResetForm] = useState(false);

  const folioLocations = locations[0]?.locations || [];
  const statisticalCodeTypes = statisticalCodeTypesData[0]?.statisticalCodeTypes || [];
  const statisticalCodes = statisticalCodesData[0]?.statisticalCodes || [];

  const changeFormResetState = (value) => {
    setIsResetForm(value);
  };

  const backPrevServer = () => {
    const index = centralServersOptions.findIndex(server => server.label === prevServerName);
    const prevOption = document.getElementById(`option-${CENTRAL_SERVER_ID}-${index}-${prevServerName}`);

    if (prevOption) prevOption.click();
  };

  const handleModalConfirm = () => {
    if (prevServerName) {
      backPrevServer();
    }
    onChangePristineState(false);
    onChangePrevServerName(prevServerName);
    setOpenModal(false);
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setIsResetForm(true);
    history.push(nextLocation.pathname);
  };

  const handleSubmit = (record) => {
    const { contributionCriteria: { POST, PUT } } = mutator;
    const saveMethod = isCreation ? POST : PUT;
    const FOLIOLocations = record[LOCATIONS_IDS];
    const finalRecord = {
      ...omit(record, LOCATIONS_IDS),
      centralServerId,
    };

    if (FOLIOLocations.length) {
      finalRecord[LOCATIONS_IDS] = FOLIOLocations.map(({ value }) => value);
    }

    saveMethod(finalRecord)
      .then(() => {
        const action = isCreation ? 'create' : 'update';

        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.${action}.success`} /> });
      })
      .catch(() => {
        const action = isCreation ? 'post' : 'put';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    const contributionCriteriaRecord = contributionCriteria[0];

    if (contributionCriteriaRecord) {
      const locationIds = contributionCriteriaRecord[LOCATIONS_IDS];
      const originalValues = {
        ...DEFAULT_VALUES,
        ...omit(contributionCriteriaRecord, LOCATIONS_IDS, CENTRAL_SERVER_ID),
      };

      if (locationIds) {
        const formattedLocations = locationIds.map(({ id }) => ({
          value: id,
          label: folioLocations.find(location => location.id === id)?.name,
        }));

        originalValues[LOCATIONS_IDS] = formattedLocations;
      }

      setInitialValues(originalValues);
    }
  }, [contributionCriteria]);

  useEffect(() => {
    const unblock = history.block(nextLocat => {
      if (!isPristine) {
        setOpenModal(true);
        onChangePristineState(true);
        setNextLocation(nextLocat);
      }

      return isPristine;
    });

    return () => unblock();
  }, [isPristine]);

  if (
    isLocationsPending ||
    isStatCodeTypesPending ||
    isStatCodesPending ||
    isContributionCriteriaPending
  ) {
    return <LoadingPane defaultWidth={DEFAULT_PANE_WIDTH} />;
  }

  return (
    <>
      <ContributionCriteriaForm
        initialValues={initialValues}
        folioLocations={folioLocations}
        statisticalCodes={statisticalCodes}
        statisticalCodeTypes={statisticalCodeTypes}
        isResetForm={isResetForm}
        serverSelection={serverSelection}
        renderFooter={renderFooter}
        onSubmit={handleSubmit}
        onChangePristineState={onChangePristineState}
        onChangeFormResetState={changeFormResetState}
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
  contributionCriteria: {
    type: 'okapi',
    path: 'inn-reach/central-servers/:{id}/contribution-criteria',
    throwErrors: false,
  },
});

export default stripesConnect(ContributionCriteriaCreateEditRoute);
