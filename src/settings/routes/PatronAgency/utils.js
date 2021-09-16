import React from 'react';
import {
  AGENCY_CODE_NO_VALUE_OPTION,
  PATRON_AGENCY_FIELDS,
} from '../../../constants';

const {
  CUSTOM_FIELD_VALUE,
} = PATRON_AGENCY_FIELDS;

export const getCustomFieldOptions = (customFields) => {
  return customFields.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
};

export const getAgencyCodeOptions = (selectedServer) => {
  if (!selectedServer.id) return [];

  return selectedServer?.localAgencies?.reduce((accum, { code }) => {
    const option = {
      label: code,
      value: code,
    };

    accum.push(option);

    return accum;
  }, [AGENCY_CODE_NO_VALUE_OPTION]);
};

export const getCustomFieldValueOptions = (customFields, selectedCustomField) => {
  const optedCustomField = customFields.find(customField => customField.id === selectedCustomField);

  return optedCustomField?.selectField?.options?.values.map(({ value }) => ({
    [CUSTOM_FIELD_VALUE]: value,
  }));
};
