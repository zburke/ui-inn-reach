import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import {
  omit,
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
  MATERIAL_TYPE_FIELDS,
} from '../../../constants';
import MaterialTypeForm from '../../components/MaterialType/MaterialTypeForm';
import {
  useCallout,
  useCentralServers,
} from '../../../hooks';

const {
  CENTRAL_SERVER_ID,
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_ID,
  MATERIAL_TYPE_LABEL,
} = MATERIAL_TYPE_FIELDS;

export const DEFAULT_VALUES = {
  [MATERIAL_TYPE_MAPPING_LIST]: [],
};

const getInnReachMaterialTypeMapingsMap = (mappings) => {
  const materialTypeMappingsMap = new Map();
  console.log('mappings', mappings);
  mappings.forEach(({ id, centralItemType, materialTypeId }) => {
    materialTypeMappingsMap.set(materialTypeId, { id, centralItemType });
  });

  return materialTypeMappingsMap;
};

const getInnReachMaterialTypesMap = (materialTypes) => {
  const materialTypesMap = new Map();

  materialTypes.forEach(({ value, label }) => {
    innReachMaterialTypesMap.set(value, label);
  });

  return innReachMaterialTypesMap;
};

export const getFolioMappingTypesOptions = (folioMappingTypesOptions) => {
  return folioMappingTypesOptions.map(({ label, value }) => ({
    [MATERIAL_TYPE_ID]: value,
    [MATERIAL_TYPE_LABEL]: label,
  }));
};

export const getMaterialTypesList = ({
  materialTypeMappingsMap,
  innReachItemTypeOptions,
  folioMaterialTypeOptions,
}) => {
  debugger;

  return folioMaterialTypeOptions.map(({ value, label }) => {
    let centralItemType = '';
    const isMaterialTypeSelected = materialTypeMappingsMap.has(value);

    if (isMaterialTypeSelected) {
      centralItemType = materialTypeMappingsMap.get(value).centralItemType;
    }

    return {
      [CENTRAL_ITEM_TYPE]: centralItemType,
      [MATERIAL_TYPE_ID]: value,
      [MATERIAL_TYPE_LABEL]: label,
    };
  });
};

const formatPayload = ({
  materialTypeMappingsMap,
  innReachItemTypes,
  materialTypes,
}) => {
  return materialTypes.reduce((accum, { value, label }) => {
    if (materialTypeMappingsMap.has(value)) {
      const centralItemType = materialTypeMappingsMap.get(value).centralItemType;

      if (centralItemType) { // if there is an Inn-Reach code in the right column

        const mapping = {
          materialTypeId: value,
          centralItemType
        };
        accum.push(mapping);

      }
    }
    return accum;
  }, []);
};


const MaterialTypeCreateEditRoute = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
      isPending: isServersPending,
    },
    materialTypes: {
      records: materialTypesData,
    },
    innReachItemTypes: {
      records: innReachItemTypesData,
    },
    materialTypeMappings: {
      records: materialTypeMappingsData,
    }
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const materialTypes = materialTypesData[0]?.mtypes || [];
  const innReachItemTypes = innReachItemTypesData[0]?.itemTypeList || [];

  const getFormatedInnReachItemTypeOptions = useMemo(() => innReachItemTypes.map(type => ({
    label: type.description,
    value: type.centralItemType,
  })), [innReachItemTypes]);

  const getFormatedMaterialTypeOptions = useMemo(() => materialTypes.map(type => ({
    label: type.name,
    value: type.id,
  })), [materialTypes]);

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
  const [materialTypeMappings, setMaterialTypeMappings] = useState([]);
  const [materialTypeMappingsMap, setMaterialTypeMappingsMap] = useState(null);

  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [isMaterialTypeMappingsPending, setIsMaterialTypeMappingsPending] = useState(false);

  useEffect(() => {
    if (!isMaterialTypeMappingsPending) {
      if (isEmpty(materialTypeMappings)) {
        setInitialValues({
          [MATERIAL_TYPE_MAPPING_LIST]: getFolioMappingTypesOptions(getFormatedMaterialTypeOptions),
        });
      } else {
        const mTypeMappingsMap = getInnReachMaterialTypeMapingsMap(materialTypeMappings);

        setMaterialTypeMappingsMap(mTypeMappingsMap);

        setInitialValues({
          [MATERIAL_TYPE_MAPPING_LIST]: getMaterialTypesList({
            materialTypeMappingsMap,
            innReachItemTypeOptions: getFormatedInnReachItemTypeOptions,
            folioMaterialTypeOptions: getFormatedMaterialTypeOptions,
          }),
        });
      }
    }
  }, [materialTypeMappings, isMaterialTypeMappingsPending]);



  const handleSubmit = (record) => {
    console.log('record', record);
    console.log('materialTypeMappings', materialTypeMappings);
    const { materialTypeMappings: { POST, PUT } } = mutator;
    const saveMethod = materialTypeMappings.length ? PUT : POST;
    debugger;
    record[MATERIAL_TYPE_MAPPING_LIST].forEach(mapping => delete mapping[MATERIAL_TYPE_LABEL]);
    debugger;
    saveMethod(record)
      .then(() => {
        const action = materialTypeMappings.length ? 'update' : 'create';

        showCallout({ message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.${action}.success`} /> });
      })
      .catch(() => {
        const action = materialTypeMappings ? 'put' : 'post';

        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id={`ui-inn-reach.settings.contribution-criteria.callout.connectionProblem.${action}`} />,
        });
      });
  };

  useEffect(() => {
    if (selectedServer.id) {
      mutator.selectedServerId.replace(selectedServer.id);
      setIsMaterialTypeMappingsPending(true);

      mutator.materialTypeMappings.GET()
        .then(response => setMaterialTypeMappings(response.materialTypeMappings || []))
        .catch(() => null)
        .finally(() => setIsMaterialTypeMappingsPending(false));
    }
  }, [selectedServer]);

  useEffect(() => {
    if (materialTypeMappings) {


      const originalValues = {
        ...DEFAULT_VALUES,
        ...omit(materialTypeMappings, CENTRAL_SERVER_ID),
      };

      setInitialValues(originalValues);
    }
  }, [materialTypeMappings]);

  if (isServersPending) return <LoadingPane />;

  return (
    <>
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
      <MaterialTypeForm
        selectedServer={selectedServer}
        isMaterialTypeMappingsPending={isMaterialTypeMappingsPending}
        isPristine={isPristine}
        serverOptions={serverOptions}
        initialValues={initialValues}
        isResetForm={isResetForm}
        materialTypeOptions={getFormatedMaterialTypeOptions}
        innReachItemTypeOptions={getFormatedInnReachItemTypeOptions}
        onSubmit={handleSubmit}
        onChangePristineState={changePristineState}
        onChangeFormResetState={changeFormResetState}
        onChangeServer={handleServerChange}
      />
    </>
  );
};

MaterialTypeCreateEditRoute.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: 'inn-reach/central-servers',
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
      POST: PropTypes.func,
      PUT: PropTypes.func,
    }).isRequired,
  }),
};

export default stripesConnect(MaterialTypeCreateEditRoute);
