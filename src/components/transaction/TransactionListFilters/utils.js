export const getTransactionStatusOptions = statuses => {
  return statuses.map(status => ({
    label: status,
    value: status,
  }));
};

export const getCentralServerOpts = (servers) => {
  return servers.map(({ id, name, centralServerCode }) => ({
    id,
    label: `${name} (${centralServerCode})`,
    value: centralServerCode,
  }));
};

export const getCentralServerAgencyOptions = (centralServerAgencies) => {
  return centralServerAgencies.map(({ centralServerCode, agencies }) => {
    return agencies.map(({ agencyCode, description }) => ({
      label: `${centralServerCode}: ${agencyCode} - ${description}`,
      value: agencyCode,
    }));
  }).flat();
};

export const getCentralServerPatronTypeOptions = (centralServerPatronTypes) => {
  return centralServerPatronTypes.map(({ centralServerCode, patronTypes }) => {
    return patronTypes.map(({ centralPatronType, description }) => ({
      label: `${centralServerCode}: ${centralPatronType} - ${description}`,
      value: `${centralPatronType}`,
    }));
  }).flat();
};

export const getCentralServerItemTypeOptions = (centralServerItemTypes) => {
  return centralServerItemTypes.map(({ centralServerCode, itemTypes }) => {
    return itemTypes.map(({ centralItemType, description }) => ({
      label: `${centralServerCode}: ${centralItemType} - ${description}`,
      value: `${centralItemType}`,
    }));
  }).flat();
};
