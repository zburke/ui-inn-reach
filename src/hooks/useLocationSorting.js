import {
  useEffect,
  useCallback,
} from 'react';

import useSorting from './useSorting';
import {
  getParams,
  buildSearchString,
} from '../utils';

const useLocationSorting = (location, history, resetData, sortableFields) => {
  const [
    sortField,
    sortOrder,
    changeSorting,
    setSortField,
    setSortOrder,
  ] = useSorting(resetData, sortableFields);

  useEffect(
    () => {
      const initialSorting = getParams(location.search);

      setSortField(initialSorting.sortField);
      setSortOrder(initialSorting.sortOrder);
    },
    [],
  );

  const changeLocationSorting = useCallback(
    (e, meta) => {
      const newSorting = changeSorting(e, meta);

      history.push({
        pathname: '',
        search: `${buildSearchString(newSorting, location.search)}`,
      });
    },
    [changeSorting, location, history],
  );

  return [
    sortField,
    sortOrder,
    changeLocationSorting,
  ];
};

export default useLocationSorting;
