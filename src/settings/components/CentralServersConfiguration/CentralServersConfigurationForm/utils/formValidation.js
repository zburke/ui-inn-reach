import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
} from 'lodash';

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
};

// eslint-disable-next-line
export const validateLocalServerCode = (value) => {
  if (!value) {
    return <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
  } else {
    const isCodeValid = /^[a-z0-9]{5}$/.test(value);

    if (!isCodeValid) {
      return <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.fiveCharacterStringLowerCase" />;
    }
  }
};

const getEmptyFieldError = (localAgenciesValues) => {
  const errorList = [];
  const isFieldsEmpty = localAgenciesValues.every(item => !item.localAgency && isEmpty(item.FOLIOLibraries));

  if (isFieldsEmpty) {
    const requiredTextMessage = <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;

    errorList[0] = {
      localAgency: requiredTextMessage,
      FOLIOLibraries: requiredTextMessage,
    };
  } else {
    // if only the field 'FOLIO libraries' or 'Local Agency' is empty
    localAgenciesValues.forEach((item, index) => {
      if (item.localAgency && isEmpty(item.FOLIOLibraries)) {
        errorList[index] = { FOLIOLibraries: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" /> };
      } else if (!item.localAgency && !isEmpty(item.FOLIOLibraries)) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" /> };
      }
    });
  }

  return errorList;
};

export const validateLocalAgency = (localAgenciesValues) => {
  const errors = {};
  const errorList = [
    ...getEmptyFieldError(localAgenciesValues),
  ];

  localAgenciesValues.forEach((item, index) => {
    if (item.localAgency) {
      const isValid = /^[a-z0-9]{5}$/.test(item.localAgency);

      if (!isValid) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.fiveCharacterStringLowerCase" /> };
      }
    }
  });

  if (errorList.length) errors.localAgencies = errorList;

  return errors;
};
