import React from 'react';
import {
  omit,
} from 'lodash';
import {
  AGENCY_CODE_NO_VALUE_OPTION,
  METADATA,
  PATRON_AGENCY_FIELDS,
} from '../../../constants';

const {
  CUSTOM_FIELD_VALUE,
  CONFIGURED_OPTIONS,
  AGENCY_CODE,
} = PATRON_AGENCY_FIELDS;

export const getCustomFieldOptions = (customFields) => {
  return customFields.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
};

export const getSelectedCustomField = (customFields, selectedCustomField) => {
  return customFields.find(customField => customField.id === selectedCustomField);
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

export const getOnlyCustomFieldValues = (selectedCustomField) => {
  return selectedCustomField?.selectField?.options?.values.map(({ value }) => ({
    [CUSTOM_FIELD_VALUE]: value,
  }));
};

export const formatPayload = (record) => {
  const payload = omit(record, CONFIGURED_OPTIONS, METADATA);

  payload[CONFIGURED_OPTIONS] = record[CONFIGURED_OPTIONS]
    .filter(({ agencyCode }) => agencyCode)
    .reduce((accum, { customFieldValue, agencyCode }) => {
      accum[customFieldValue] = agencyCode;

      return accum;
    }, {});

  return payload;
};

const getFormattedConfiguredOptions = (selectedCustomField, configuredOptions) => {
  const formattedConfiguredOptions = [];
  const customFieldValues = selectedCustomField?.selectField?.options?.values || [];

  customFieldValues.forEach(({ value }) => {
    const isCustomFieldValueMapped = !!configuredOptions[value];
    const option = {
      [CUSTOM_FIELD_VALUE]: value,
    };

    if (isCustomFieldValueMapped) {
      option[AGENCY_CODE] = configuredOptions[value];
    }

    formattedConfiguredOptions.push(option);
  });

  return formattedConfiguredOptions;
};

export const formatUserCustomFieldMappings = (selectedCustomField, userCustomFieldMappings) => {
  const formattedMappings = omit(userCustomFieldMappings, CONFIGURED_OPTIONS);

  formattedMappings[CONFIGURED_OPTIONS] = getFormattedConfiguredOptions(selectedCustomField, userCustomFieldMappings[CONFIGURED_OPTIONS]);

  return formattedMappings;
};
