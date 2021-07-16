import React from "react";
import {FormattedMessage} from "react-intl";

export const validateRequired = (value) => {
  return value
    ? undefined
    : <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.create-edit.validation.required" />;
};

export const getFolioLocationOptions = (folioLocationsMap, libraryId) => {
  if (!libraryId) return [];

  const locationsBySelectedLib = folioLocationsMap.get(libraryId);
  const noValueOption = {
    label: <FormattedMessage id="ui-inn-reach.settings.agency-to-folio-locations.placeholder.folio-location" />,
    value: '',
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
    value: '',
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
