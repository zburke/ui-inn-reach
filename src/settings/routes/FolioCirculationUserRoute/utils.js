import React from 'react';
import {
  omit,
} from 'lodash';
import {
  FOLIO_CIRCULATION_USER_FIELDS,
} from '../../../constants';

const {
  ID,
  CENTRAL_PATRON_TYPE_MAPPINGS,
  CENTRAL_PATRON_TYPE,
  CENTRAL_PATRON_TYPE_LABEL,
  BARCODE,
} = FOLIO_CIRCULATION_USER_FIELDS;

export const getExistingBarcodesSet = (users) => {
  return users.reduce((accum, { barcode }) => {
    if (barcode) accum.add(barcode);

    return accum;
  }, new Set());
};

export const getInnReachPatronTypeOptions = (innReachPatronTypes) => {
  return innReachPatronTypes.map(({ centralPatronType, description }) => ({
    [CENTRAL_PATRON_TYPE]: centralPatronType,
    [CENTRAL_PATRON_TYPE_LABEL]: `${centralPatronType} (${description})`,
  }));
};

export const getBarcodeMappingsMap = (centralPatronTypeMappings) => {
  return centralPatronTypeMappings.reduce((accum, {
    [ID]: id,
    [CENTRAL_PATRON_TYPE]: centralPatronType,
    [BARCODE]: barcode,
  }) => {
    accum.set(centralPatronType, { id, barcode });

    return accum;
  }, new Map());
};

export const formatBarcodeMappings = (innReachPatronTypes, barcodeMappingsMap) => {
  return innReachPatronTypes.reduce((accum, { centralPatronType, description }) => {
    const isBarcodeEntered = barcodeMappingsMap.has(centralPatronType);

    if (isBarcodeEntered) {
      const mapping = {
        [CENTRAL_PATRON_TYPE]: centralPatronType,
        [CENTRAL_PATRON_TYPE_LABEL]: `${centralPatronType} (${description})`,
        [BARCODE]: barcodeMappingsMap.get(centralPatronType)[BARCODE],
      };

      const mappingId = barcodeMappingsMap.get(centralPatronType)[ID];

      if (mappingId) mapping[ID] = mappingId;

      accum.push(mapping);
    }

    return accum;
  }, []);
};

export const formatPayload = (record) => {
  const finalMappings = record[CENTRAL_PATRON_TYPE_MAPPINGS].map(mapping => (
    omit(mapping, [CENTRAL_PATRON_TYPE_LABEL])
  ));

  return {
    [CENTRAL_PATRON_TYPE_MAPPINGS]: finalMappings,
  };
};
