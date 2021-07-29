export const getCentralServerOptions = (servers) => {
  return servers.map(({ id, name }) => ({
    id,
    label: name,
    value: name,
  }));
};
