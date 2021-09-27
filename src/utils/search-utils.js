import queryString from 'query-string';

import {
  SEARCH_PARAMETER,
  ASC_ORDER,
  SORT_PARAMETER,
  SORT_ORDER_PARAMETER,
} from '../constants';

export const buildSearch = (newQueryParams, searchString) => {
  return Object.keys(newQueryParams).reduce((acc, paramKey) => {
    const paramValue = newQueryParams[paramKey] || undefined;

    acc[paramKey] = paramValue;

    return acc;
  }, queryString.parse(searchString));
};

export const buildSearchString = (newQueryParams, searchString) => {
  return queryString.stringify(buildSearch(newQueryParams, searchString));
};

export const buildFiltersObj = (searchString) => {
  const queryParams = queryString.parse(searchString);

  return Object.keys(queryParams).reduce((acc, queryKey) => {
    const queryValue = queryParams[queryKey];
    const newAcc = { ...acc };

    if (!Array.isArray(queryValue) && ![SEARCH_PARAMETER].includes(queryKey)) {
      newAcc[queryKey] = [queryValue];
    } else {
      newAcc[queryKey] = queryValue;
    }

    return newAcc;
  }, {});
};

export const getParams = (searchString, defaultSortField) => {
  const queryParams = queryString.parse(searchString);

  return {
    [SEARCH_PARAMETER]: queryParams[SEARCH_PARAMETER],
    [SORT_PARAMETER]: queryParams[SORT_PARAMETER] || defaultSortField,
    [SORT_ORDER_PARAMETER]: queryParams[SORT_ORDER_PARAMETER] || ASC_ORDER,
  };
};
