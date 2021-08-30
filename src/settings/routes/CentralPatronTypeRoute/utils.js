import React from 'react';
import {
  omit,
} from 'lodash';
import {
  CENTRAL_PATRON_TYPE_FIELDS,
  PATRON_TYPE_NO_VALUE_OPTION,
} from '../../../constants';

const {
  PATRON_TYPE_MAPPINGS,
  PATRON_GROUP_ID,
  PATRON_GROUP_LABEL,
  PATRON_TYPE,
  ID,
} = CENTRAL_PATRON_TYPE_FIELDS;

export const getFolioPatronGroupOptions = (patronGroups) => {
  return patronGroups.map(({ id, desc }) => ({
    [PATRON_GROUP_ID]: id,
    [PATRON_GROUP_LABEL]: desc,
  }));
};

export const getPatronTypeOptions = (patronTypes) => {
  return patronTypes.reduce((accum, { centralPatronType, description }) => {
    const option = {
      label: `${centralPatronType} (${description})`,
      value: `${centralPatronType}`,
    };

    accum.push(option);

    return accum;
  }, [PATRON_TYPE_NO_VALUE_OPTION]);
};

export const getPatronTypeMappingsMap = (patronTypeMappings) => {
  return patronTypeMappings.reduce((accum, { id, patronGroupId, patronType }) => {
    accum.set(patronGroupId, { id, patronType: `${patronType}` });

    return accum;
  }, new Map());
};

export const formatPatronTypeMappings = (patronGroups, patronTypeMappingsMap) => {
  return patronGroups.reduce((accum, { id, desc }) => {
    const isPatronTypeSelected = patronTypeMappingsMap.has(id);

    if (isPatronTypeSelected) {
      const mapping = {
        [PATRON_TYPE]: patronTypeMappingsMap.get(id).patronType,
        [PATRON_GROUP_ID]: id,
        [PATRON_GROUP_LABEL]: desc,
      };

      const mappingId = patronTypeMappingsMap.get(id).id;

      if (mappingId) mapping[ID] = mappingId;

      accum.push(mapping);
    }

    return accum;
  }, []);
};

export const formatPayload = (patronTypeMappings) => {
  const finalMappings = patronTypeMappings[PATRON_TYPE_MAPPINGS].map(mapping => ({
    ...omit(mapping, [PATRON_GROUP_LABEL]),
    [PATRON_TYPE]: parseInt(mapping[PATRON_TYPE], 10),
  }));

  return {
    [PATRON_TYPE_MAPPINGS]: finalMappings,
  };
};
