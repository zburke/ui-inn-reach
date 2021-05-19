import React from 'react';
import { FormattedMessage } from 'react-intl';

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.validation.required" />;
};

// eslint-disable-next-line
export const validateLocalServerCode = (value) => {
  if (!value) {
    return <FormattedMessage id="ui-inn-reach.validation.required" />;
  } else {
    const isCodeValid = /^[a-z]{5}$/.test(value);

    if (!isCodeValid) {
      return <FormattedMessage id="ui-inn-reach.validation.fiveCharacterStringLowerCase" />;
    }
  }
};

const getEmptyFieldError = (values) => {
  const errorList = [];
  const isFieldsEmpty = values.localAgencies.every(item => !item.localAgency && !item.FOLIOLibraries);

  if (isFieldsEmpty) {
    const requiredTextMessage = <FormattedMessage id="ui-inn-reach.validation.required" />;

    errorList[0] = {
      localAgency: requiredTextMessage,
      FOLIOLibraries: requiredTextMessage,
    };
  } else {
    // if only the field 'FOLIO libraries' or 'Local Agency' is empty
    values.localAgencies.forEach((item, index) => {
      if (item.localAgency && !item.FOLIOLibraries) {
        errorList[index] = { FOLIOLibraries: <FormattedMessage id="ui-inn-reach.validation.required" /> };
      } else if (!item.localAgency && item.FOLIOLibraries) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.validation.required" /> };
      }
    });
  }

  return errorList;
};

export const validateLocalAgency = (values) => {
  const errors = {};
  const errorList = [
    ...getEmptyFieldError(values),
  ];

  values.localAgencies.forEach((item, index) => {
    if (item.localAgency) {
      const isValid = /^[a-z]{5}$/.test(item.localAgency);

      if (!isValid) {
        errorList[index] = { localAgency: <FormattedMessage id="ui-inn-reach.validation.fiveCharacterStringLowerCase" /> };
      }
    }
  });

  if (errorList.length) errors.localAgencies = errorList;

  return errors;
};
