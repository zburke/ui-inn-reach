import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
} from 'lodash';

// eslint-disable-next-line
export const validateLocalServerCode = (value) => {
  if (!value) {
    return <FormattedMessage id="ui-inn-reach.validate.required" />;
  } else {
    const isCodeValid = /^.{5}$/.test(value);

    if (!isCodeValid) {
      return <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.fiveCharacterStringLowerCase" />;
    }
  }
};

const getEmptyFieldError = (localAgenciesValues) => {
  const errorList = [];
  const isFieldsEmpty = localAgenciesValues.every(item => !item.localAgency && isEmpty(item.FOLIOLibraries));

  if (isFieldsEmpty) {
    const requiredTextMessage = <FormattedMessage id="ui-inn-reach.validate.required" />;

    errorList[0] = {
      localAgency: requiredTextMessage,
      FOLIOLibraries: requiredTextMessage,
    };
  } else {
    // if only the field 'FOLIO libraries' or 'Local Agency' is empty
    localAgenciesValues.forEach((item, index) => {
      if (item.localAgency && isEmpty(item.FOLIOLibraries)) {
        errorList[index] = { FOLIOLibraries: <FormattedMessage id="ui-inn-reach.validate.required" /> };
      } else if (!item.localAgency && !isEmpty(item.FOLIOLibraries)) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.validate.required" /> };
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
      const isValid = /^.{5}$/.test(item.localAgency);

      if (!isValid) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.fiveCharacterStringLowerCase" /> };
      }
    }
  });

  if (errorList.length) errors.localAgencies = errorList;

  return errors;
};
