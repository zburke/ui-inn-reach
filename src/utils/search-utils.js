import queryString from 'query-string';

import {
  SEARCH_PARAMETER,
  DESC_ORDER,
  SORT_PARAMETER,
  SORT_ORDER_PARAMETER,
  TRANSACTION_FIELDS,
  HOLD_FIELDS,
} from '../constants';

const {
  TYPE,
  STATUS,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  PATRON_AGENCY_CODE,
  ITEM_AGENCY_CODE,
  CENTRAL_PATRON_TYPE,
  CENTRAL_ITEM_TYPE,
} = HOLD_FIELDS;

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
    [SORT_ORDER_PARAMETER]: queryParams[SORT_ORDER_PARAMETER] || DESC_ORDER,
    [TYPE]: queryParams[TYPE],
    [STATUS]: queryParams[STATUS],
    [CENTRAL_SERVER_CODE]: queryParams[CENTRAL_SERVER_CODE],
    [PATRON_AGENCY_CODE]: queryParams[PATRON_AGENCY_CODE],
    [ITEM_AGENCY_CODE]: queryParams[ITEM_AGENCY_CODE],
    [CENTRAL_PATRON_TYPE]: queryParams[CENTRAL_PATRON_TYPE],
    [CENTRAL_ITEM_TYPE]: queryParams[CENTRAL_ITEM_TYPE],
  };
};
