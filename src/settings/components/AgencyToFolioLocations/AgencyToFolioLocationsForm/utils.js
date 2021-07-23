import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NO_VALUE_OPTION_VALUE } from '../../../../constants';

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
};

export const getFolioLocationOptions = (folioLocationsMap, libraryId) => {
  const locationsBySelectedLib = folioLocationsMap.get(libraryId);
  const noValueOption = {
    label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location" />,
    value: NO_VALUE_OPTION_VALUE,
  };

  return locationsBySelectedLib.reduce((accum, { id, name, code }) => {
    const option = {
      id,
      label: `${name} (${code})`,
      value: id,
    };

    if (!accum.length) {
      accum.push(noValueOption);
    }

    accum.push(option);

    return accum;
  }, []);
};

export const getLocalServerOptions = ({ localServerList }) => {
  if (!localServerList) return [];

  const noValueOption = {
    label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.local-server" />,
    value: NO_VALUE_OPTION_VALUE,
  };

  return localServerList.reduce((accum, { localCode, description }) => {
    const option = {
      label: `${localCode} (${description})`,
      value: localCode,
    };

    if (!accum.length) {
      accum.push(noValueOption);
    }

    accum.push(option);

    return accum;
  }, []);
};

export const getSelectedOptionInfo = (selectedOptionValue) => {
  const isNoValueOption = selectedOptionValue === NO_VALUE_OPTION_VALUE;
  const selectedValue = isNoValueOption ? undefined : selectedOptionValue;

  return {
    isNoValueOption,
    selectedValue,
  };
};
