import {
  MATERIAL_TYPE_FIELDS,
} from '../../../constants';

const {
  MATERIAL_TYPE_MAPPING_LIST,
  MATERIAL_TYPE_ID,
  MATERIAL_TYPE_LABEL,
  ID,
  CENTRAL_ITEM_TYPE,
} = MATERIAL_TYPE_FIELDS;

export const getInnReachMaterialTypeMapingsMap = (mappings) => {
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

export const getFolioMappingTypesOptions = (folioMappingTypesOptions) => {
  return folioMappingTypesOptions.map(({ label, value }) => ({
    [MATERIAL_TYPE_ID]: value,
    [MATERIAL_TYPE_LABEL]: label,
  }));
};

export const getMaterialTypesList = ({
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
        [MATERIAL_TYPE_ID]: value,
        [MATERIAL_TYPE_LABEL]: label,
      };

      if (centralItemType) record[CENTRAL_ITEM_TYPE] = centralItemType;
      if (mappingId) record[ID] = mappingId;

      return record;
    });
  }

  return false;
};

export const formatPayload = ({
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
