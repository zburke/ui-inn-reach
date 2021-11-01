export const getTransactionStatusOptions = statuses => {
  return statuses.map(status => ({
    label: status,
    value: status,
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
