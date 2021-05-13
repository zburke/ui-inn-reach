import React from 'react';
import {
  isEmpty,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.validation.required" />;
};

export const validateLocalServerCode = (value) => {
  if (!value) {
    return <FormattedMessage id="ui-inn-reach.validation.required" />;
  } else {
    const isCodeValid = /^[a-z]{5}$/.test(value);

    return !isCodeValid
      ? <FormattedMessage id="ui-inn-reach.validation.fiveCharacterStringLowerCase" />
      : '';
  }
};

export const validateLocalAgency = (values) => {
  const errors = {};
  const errorList = [];
  const isFieldsEmpty = values.localAgencies.every(item => !item.localAgency && !item.FOLIOLibraries);

  if (isFieldsEmpty) {
    const requiredTextMessage = <FormattedMessage id="ui-inn-reach.validation.required" />;

    errorList[0] = {
      localAgency: requiredTextMessage,
      FOLIOLibraries: requiredTextMessage,
    };
  } else {
    // if only the field 'FOLIO libraries' of 'Local Agency' is empty
    values.localAgencies.forEach((item, index) => {
      if (item.localAgency && !item.FOLIOLibraries) {
        errorList[index] = { FOLIOLibraries: <FormattedMessage id="ui-inn-reach.validation.required" /> };
      } else if (!item.localAgency && item.FOLIOLibraries) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.validation.required" /> };
      }
    });
  }

  values.localAgencies.forEach((item, index) => {
    const error = {};

    if (item.localAgency) {
      const isValid = /^[a-z]{5}$/.test(item.localAgency);

      if (!isValid) {
        error.localAgency = <FormattedMessage id="ui-inn-reach.validation.fiveCharacterStringLowerCase" />;
      }
    }

    if (!isEmpty(error)) {
      errorList[index] = error;
    }
  });

  if (errorList.length) errors.localAgencies = errorList;

  return errors;
};
