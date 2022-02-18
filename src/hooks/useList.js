import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { omit } from 'lodash';

import {
  SORT_PARAMETER,
  SORT_ORDER_PARAMETER,
} from '../constants';

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [SORT_PARAMETER, SORT_ORDER_PARAMETER],
);

const getFiltersCount = (filters) => {
  return filters && Object.keys(getFilterParams(filters)).filter(k => filters[k] !== undefined).length;
};

const useList = (isLoadingRightAway, queryLoadRecords, loadRecordsCB, resultCountIncrement) => {
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const recordsOffsetRef = useRef(0);

  const loadRecords = useCallback((offset, updateList) => {
    setIsLoading(true);
    const queryParams = queryString.parse(location.search);
    const filtersCount = getFiltersCount(queryParams);
    const hasToCallAPI = isLoadingRightAway || filtersCount > 0;

    const loadRecordsPromise = hasToCallAPI
      ? queryLoadRecords(offset, hasToCallAPI)
      : Promise.resolve();

    return loadRecordsPromise.then(recordsResponse => {
      if (!offset) setRecordsCount(recordsResponse?.totalRecords);
      if (updateList) return recordsResponse && setRecords(recordsResponse.transactions);

      return recordsResponse && loadRecordsCB(setRecords, recordsResponse);
    }).finally(() => setIsLoading(false));
  }, [isLoadingRightAway, loadRecordsCB, location.search, queryLoadRecords]);

  const onNeedMoreData = () => {
    recordsOffsetRef.current += resultCountIncrement;
    loadRecords(recordsOffsetRef.current);
  };

  const onUpdateList = () => {
    recordsOffsetRef.current = 0;
    loadRecords(0, true);
  };

  const refreshList = useCallback(() => {
    setRecords([]);
    recordsOffsetRef.current = 0;
    loadRecords(0);
  }, [loadRecords]);

  useEffect(
    () => {
      refreshList();
    },
    [location.search],
  );

  return {
    records,
    recordsCount,
    isLoading,
    onNeedMoreData,
    onUpdateList,
    refreshList,
  };
};

export default useList;
