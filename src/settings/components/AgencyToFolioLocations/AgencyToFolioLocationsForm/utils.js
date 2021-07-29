import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NO_VALUE_OPTION_VALUE } from '../../../../constants';

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
};

export const NO_VALUE_LOCAL_SERVER_OPTION = {
  label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.local-server" />,
  value: NO_VALUE_OPTION_VALUE,
};

export const NO_VALUE_LOCATION_OPTION = {
  label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location" />,
  value: NO_VALUE_OPTION_VALUE,
};

export const getFolioLocationOptions = (folioLocationsMap, libraryId) => {
  const locationsBySelectedLib = folioLocationsMap.get(libraryId);

  return locationsBySelectedLib.reduce((accum, { id, name, code }) => {
    const option = {
      id,
      label: `${name} (${code})`,
      value: id,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCATION_OPTION]);
};

export const getLocalServerOptions = ({ localServerList }) => {
  if (!localServerList) return [];

  return localServerList.reduce((accum, { localCode, description }) => {
    const option = {
      label: `${localCode} (${description})`,
      value: localCode,
    };

    accum.push(option);

    return accum;
  }, [NO_VALUE_LOCAL_SERVER_OPTION]);
};

export const getSelectedOptionInfo = (selectedOptionValue) => {
  const isNoValueOption = selectedOptionValue === NO_VALUE_OPTION_VALUE;
  const selectedValue = isNoValueOption ? undefined : selectedOptionValue;

  return {
    isNoValueOption,
    selectedValue,
  };
};
