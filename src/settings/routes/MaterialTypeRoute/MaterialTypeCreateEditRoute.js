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
  MATERIAL_TYPE_MAPPING_LIST,
  CENTRAL_ITEM_TYPE,
  MATERIAL_TYPE_ID,
  MATERIAL_TYPE_LABEL,
} = MATERIAL_TYPE_FIELDS;

const getInnReachMaterialTypeMapingsMap = (mappings) => {
  const materialTypeMappingsMap = new Map();

  mappings.forEach(({
    id,
    centralItemType,
    materialTypeId,
  }) => {
    materialTypeMappingsMap.set(materialTypeId, { id, centralItemType });
  });

  return materialTypeMappingsMap;
};

const getFolioMappingTypesOptions = (folioMappingTypesOptions) => {
  return folioMappingTypesOptions.map(({ label, value }) => ({
    [MATERIAL_TYPE_ID]: value,
    [MATERIAL_TYPE_LABEL]: label,
  }));
};

const getMaterialTypesList = ({
  materialTypeMappingsMap,
  folioMaterialTypeOptions,
}) => {
  if (materialTypeMappingsMap) {
    return folioMaterialTypeOptions.map(({ value, label }) => {
      let centralItemType = '';
      let mappingId = '';
      const isMaterialTypeSelected = materialTypeMappingsMap.has(value);

      if (isMaterialTypeSelected) {
        centralItemType = materialTypeMappingsMap.get(value).centralItemType;
        mappingId = materialTypeMappingsMap.get(value).id;
      }

      const record = {
        [CENTRAL_ITEM_TYPE]: centralItemType,
        [MATERIAL_TYPE_ID]: value,
        [MATERIAL_TYPE_LABEL]: label,
      };

      if (mappingId) record.id = mappingId;

      return record;
    });
  }

  return false;
};

const formatPayload = ({
  record,
}) => {
  return record[MATERIAL_TYPE_MAPPING_LIST].reduce((accum, { materialTypeId, centralItemType, id }) => {
    if (centralItemType) {
      const mapping = {
        materialTypeId,
        centralItemType
      };

      if (id) mapping.id = id;

      accum.push(mapping);
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
  },
  history,
  mutator,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const materialTypes = materialTypesData[0]?.mtypes || [];

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
  const [innReachItemTypes, setInnReachItemTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [isMaterialTypeMappingsPending, setIsMaterialTypeMappingsPending] = useState(false);
  const [isInnReachItemTypesPending, setIsInnReachItemTypesPending] = useState(false);

  const getFormatedInnReachItemTypeOptions = useMemo(() => innReachItemTypes.map(type => ({
    label: type.description,
    value: type.centralItemType,
  })), [innReachItemTypes]);

  const getFormatedMaterialTypeOptions = useMemo(() => materialTypes.map(type => ({
    label: type.name,
    value: type.id,
  })), [materialTypes]);

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

    saveMethod({
      [MATERIAL_TYPE_MAPPING_LIST]: formatPayload({ record })
    })
      .then(() => {
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
        .catch(() => setInnReachItemTypes([]))
        .finally(() => setIsInnReachItemTypesPending(false));
    }
  }, [selectedServer.id]);

  if (isServersPending || isMaterialTypeMappingsPending) return <LoadingPane />;

  return (
    <>
      <ConfirmationModal
        id="cancel-editing-confirmation"
        open={openModal}
        heading={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.create-edit.modal-heading.areYouSure" />}
        message={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.create-edit.modal-message.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.create-edit.modal-confirmLabel.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-inn-reach.settings.material-type-mapping.create-edit.modal-cancelLabel.closeWithoutSaving" />}
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
