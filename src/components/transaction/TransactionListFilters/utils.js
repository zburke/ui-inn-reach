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
