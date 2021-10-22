export const getLibOptions = (folioLibraries) => {
  return folioLibraries.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
};

export const getSelectedLibsSet = (localAgencies) => {
  return localAgencies.reduce((accum, { FOLIOLibraries: selectedLibraries }) => {
    selectedLibraries.forEach(selectedLibrary => {
      const libId = selectedLibrary.value;

      accum.add(libId);
    });

    return accum;
  }, new Set());
};

export const getLoanTypeOptions = (loanTypes) => {
  return loanTypes.map(({ id, name }) => ({
    label: name,
    value: id,
    id,
  }));
};
