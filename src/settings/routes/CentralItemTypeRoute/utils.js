import React from 'react';
import {
  omit,
} from 'lodash';
import {
  CENTRAL_ITEM_TYPE_FIELDS,
  ITEM_TYPE_NO_VALUE_OPTION,
} from '../../../constants';

const {
  ID,
  ITEM_TYPE_MAPPINGS,
  ITEM_TYPE,
  ITEM_TYPE_LABEL,
  MATERIAL_TYPE_ID,
} = CENTRAL_ITEM_TYPE_FIELDS;

export const getInnReachItemTypeOptions = (innReachItemTypes) => {
  return innReachItemTypes.map(({ centralItemType, description }) => ({
    [ITEM_TYPE]: centralItemType,
    [ITEM_TYPE_LABEL]: `${centralItemType} (${description})`,
  }));
};

export const getFolioMaterialTypeOptions = (materialTypes) => {
  return materialTypes.reduce((accum, { id, name }) => {
    const option = {
      label: name,
      value: id,
    };

    accum.push(option);

    return accum;
  }, [ITEM_TYPE_NO_VALUE_OPTION]);
};

export const getItemTypeMappingsMap = (itemTypeMappings) => {
  return itemTypeMappings.reduce((accum, { id, itemType, materialTypeId }) => {
    accum.set(itemType, { id, materialTypeId });

    return accum;
  }, new Map());
};

export const formatItemTypeMappings = (innReachItemTypes, itemTypeMappingsMap) => {
  return innReachItemTypes.reduce((accum, { centralItemType, description }) => {
    const isItemTypeSelected = itemTypeMappingsMap.has(centralItemType);

    if (isItemTypeSelected) {
      const mapping = {
        [MATERIAL_TYPE_ID]: itemTypeMappingsMap.get(centralItemType).materialTypeId,
        [ITEM_TYPE]: centralItemType,
        [ITEM_TYPE_LABEL]: `${centralItemType} (${description})`,
      };

      const mappingId = itemTypeMappingsMap.get(centralItemType).id;

      if (mappingId) mapping[ID] = mappingId;

      accum.push(mapping);
    }

    return accum;
  }, []);
};

export const formatPayload = (itemTypeMappings) => {
  const finalMappings = itemTypeMappings[ITEM_TYPE_MAPPINGS].map(mapping => (
    omit(mapping, [ITEM_TYPE_LABEL])
  ));

  return {
    [ITEM_TYPE_MAPPINGS]: finalMappings,
  };
};
