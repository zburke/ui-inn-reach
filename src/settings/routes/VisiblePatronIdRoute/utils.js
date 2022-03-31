import {
  forEach,
  isEmpty,
} from 'lodash';

import {
  PAYLOAD_FIELDS_FOR_VISIBLE_PATRON_ID,
  VISIBLE_PATRON_ID_FIELDS,
} from '../../../constants';

const {
  CUSTOM,
  USER_CUSTOM_FIELDS,
} = VISIBLE_PATRON_ID_FIELDS;

const {
  FIELDS,
  USER_C_FIELDS,
} = PAYLOAD_FIELDS_FOR_VISIBLE_PATRON_ID;

export const getPayload = (record) => {
  const {
    [CUSTOM]: customFieldIdentifiers,
    ...restIdentifiers
  } = record;

  const payload = {};

  if (!isEmpty(customFieldIdentifiers)) {
    payload[FIELDS] = [USER_CUSTOM_FIELDS];

    customFieldIdentifiers.forEach(customField => {
      if (payload[USER_CUSTOM_FIELDS]) {
        payload[USER_C_FIELDS].push(customField.value);
      } else {
        payload[USER_C_FIELDS] = [customField.value];
      }
    });
  }

  forEach(restIdentifiers, (value, key) => {
    if (value) {
      if (payload[FIELDS]) {
        payload[FIELDS].push(key);
      } else {
        payload[FIELDS] = [key];
      }
    }
  });

  return payload;
};

export const getPrimaryValues = (response, customFieldPatronOptions) => {
  const primaryValues = {};

  if (response[USER_C_FIELDS]) {
    response[USER_C_FIELDS].forEach(refId => {
      const customField = customFieldPatronOptions.find(field => field.value === refId);

      if (customField) {
        if (primaryValues[CUSTOM]) {
          primaryValues[CUSTOM].push(customField);
        } else {
          primaryValues[CUSTOM] = [customField];
        }
      }
    });
  }

  if (response[FIELDS]) {
    response[FIELDS]
      .filter(field => field !== USER_CUSTOM_FIELDS)
      .forEach(field => {
        primaryValues[field] = true;
      });
  }

  return primaryValues;
};

export const getCustomFieldPatronIdentifiers = (customFields) => {
  return customFields
    .filter(cf => cf.entityType === 'user' && cf.type === 'TEXTBOX_SHORT')
    .map(({ refId, name }) => ({
      label: name,
      value: refId,
    }));
};
