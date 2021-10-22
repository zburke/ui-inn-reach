export const getTransactionStatusOptions = statuses => {
  return statuses.map(status => ({
    label: status,
    value: status,
  }));
};
