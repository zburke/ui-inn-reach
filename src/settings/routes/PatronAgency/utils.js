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
  CUSTOM_FIELD_VALUE_ID,
  CUSTOM_FIELD_VALUE,
  CONFIGURED_OPTIONS,
  AGENCY_CODE,
} = PATRON_AGENCY_FIELDS;

export const getCustomFieldOptions = (customFields) => {
  return customFields.map(({ refId, name }) => ({
    label: name,
    value: refId,
  }));
};

export const getSelectedCustomField = (customFields, selectedCustomFieldId) => {
  return customFields.find(customField => customField.refId === selectedCustomFieldId);
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
  return selectedCustomField?.selectField?.options?.values.map(({ id, value }) => ({
    [CUSTOM_FIELD_VALUE]: value,
    [CUSTOM_FIELD_VALUE_ID]: id,
  }));
};

export const formatPayload = (record) => {
  const payload = omit(record, CONFIGURED_OPTIONS, METADATA);

  payload[CONFIGURED_OPTIONS] = record[CONFIGURED_OPTIONS]
    .filter(({ agencyCode }) => agencyCode)
    .reduce((accum, { customFieldValueId, agencyCode }) => {
      accum[customFieldValueId] = agencyCode;

      return accum;
    }, {});

  return payload;
};

const getFormattedConfiguredOptions = (selectedCustomField, configuredOptions) => {
  const formattedConfiguredOptions = [];
  const customFieldValues = selectedCustomField?.selectField?.options?.values || [];

  customFieldValues.forEach(({ id, value }) => {
    const isCustomFieldValueMapped = !!configuredOptions[id];
    const option = {
      [CUSTOM_FIELD_VALUE]: value,
      [CUSTOM_FIELD_VALUE_ID]: id,
    };

    if (isCustomFieldValueMapped) {
      option[AGENCY_CODE] = configuredOptions[id];
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
