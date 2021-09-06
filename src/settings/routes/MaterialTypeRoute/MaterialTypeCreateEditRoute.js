import React, {
  useEffect,
  useState,
  useMemo,
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
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  MATERIAL_TYPE_FIELDS,
  NO_VALUE_OPTION_VALUE,
} from '../../../constants';
import MaterialTypeForm from '../../components/MaterialType/MaterialTypeForm';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';
import {
  getInnReachMaterialTypeMapingsMap,
  getFolioMappingTypesOptions,
  getMaterialTypesList,
  formatPayload,
} from './utils';

const {
  MATERIAL_TYPE_MAPPING_LIST,
} = MATERIAL_TYPE_FIELDS;

const MaterialTypeCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
    },
    materialTypes: {
      records: materialTypesData,
    },
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const materialTypes = materialTypesData[0]?.mtypes || [];

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
  const [materialTypeMappings, setMaterialTypeMappings] = useState([]);
  const [innReachItemTypes, setInnReachItemTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [isMaterialTypeMappingsPending, setIsMaterialTypeMappingsPending] = useState(false);
  const [isInnReachItemTypesPending, setIsInnReachItemTypesPending] = useState(false);
  const [innReachItemTypesFailed, setInnReachItemTypesFailed] = useState(false);

  const getFormatedInnReachItemTypeOptions = useMemo(() => {
    let options = [];
    const noValueOption = {
      label: <FormattedMessage id="ui-inn-reach.no-selection" />,
      value: NO_VALUE_OPTION_VALUE,
    };
    const innReachOptions = innReachItemTypes.map(({ centralItemType, description }) => ({
      label: `${centralItemType} (${description})`,
      value: `${centralItemType}`,
    }));

    if (innReachItemTypes.length) {
      options = [noValueOption, ...innReachOptions];
    }

    return options;
  }, [innReachItemTypes]);

  const getFormatedMaterialTypeOptions = useMemo(() => materialTypes.map(type => ({
    label: type.name,
    value: type.id,
  })), [materialTypes]);

  const changeServer = (serverName) => {
    setInnReachItemTypesFailed(false);
    handleServerChange(serverName);
  };

  useEffect(() => {
    if (!isMaterialTypeMappingsPending && !isInnReachItemTypesPending) {
      if (isEmpty(materialTypeMappings)) {
        setInitialValues({
          [MATERIAL_TYPE_MAPPING_LIST]: getFolioMappingTypesOptions(getFormatedMaterialTypeOptions),
        });
      } else {
        const mTypeMappingsMap = getInnReachMaterialTypeMapingsMap(materialTypeMappings);

        const list = getMaterialTypesList({
          materialTypeMappingsMap: mTypeMappingsMap,
          innReachItemTypeOptions: getFormatedInnReachItemTypeOptions,
          folioMaterialTypeOptions: getFormatedMaterialTypeOptions,
        });

        setInitialValues({
          [MATERIAL_TYPE_MAPPING_LIST]: [
            ...list
          ],
        });
      }
    }
  }, [materialTypeMappings, isMaterialTypeMappingsPending, isInnReachItemTypesPending]);

  const handleSubmit = (record) => {
    const { materialTypeMappings: { PUT } } = mutator;
    const saveMethod = PUT;
    const payload = formatPayload({ record });

    saveMethod({
      [MATERIAL_TYPE_MAPPING_LIST]: payload,
    })
      .then(() => {
        setMaterialTypeMappings([...payload]);
        showCallout({ message: <FormattedMessage id='ui-inn-reach.settings.material-type-mapping.update.success' /> });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id='ui-inn-reach.settings.material-type-mapping.callout.connectionProblem.put' />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setIsMaterialTypeMappingsPending(true);
      setIsInnReachItemTypesPending(true);

      mutator.materialTypeMappings.GET()
        .then(response => setMaterialTypeMappings(response.materialTypeMappings || []))
        .catch(() => null)
        .finally(() => setIsMaterialTypeMappingsPending(false));

      mutator.innReachItemTypes.GET()
        .then(response => setInnReachItemTypes(response.itemTypeList))
        .catch(() => {
          setInnReachItemTypesFailed(true);
          setInnReachItemTypes([]);
        })
        .finally(() => setIsInnReachItemTypesPending(false));
    }
  }, [selectedServer.id]);

  return (
    <>
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
      <MaterialTypeForm
        selectedServer={selectedServer}
        isServersPending={isServersPending}
        isPending={isMaterialTypeMappingsPending || isInnReachItemTypesPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        initialValues={initialValues}
        isResetForm={isResetForm}
        innReachItemTypeOptions={getFormatedInnReachItemTypeOptions}
        innReachItemTypesFailed={innReachItemTypesFailed}
        onSubmit={handleSubmit}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={changeServer}
      />
    </>
  );
};

MaterialTypeCreateEditRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
  materialTypes: {
    type: 'okapi',
    path: 'material-types?query=cql.allRecords=1%20sortby%20name&limit=2000',
    throwErrors: false,
  },
  innReachItemTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/%{selectedServerId}/d2r/contribution/itemtypes',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
  selectedServerId: { initialValue: '' },
  materialTypeMappings: {
    type: 'okapi',
    clientGeneratePk: false,
    path: 'inn-reach/central-servers/%{selectedServerId}/material-type-mappings',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

MaterialTypeCreateEditRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.shape({
    selectedServerId: PropTypes.string,
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    materialTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    selectedServerId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    materialTypeMappings: PropTypes.shape({
      GET: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
    innReachItemTypes: PropTypes.shape({
      GET: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(MaterialTypeCreateEditRoute);
