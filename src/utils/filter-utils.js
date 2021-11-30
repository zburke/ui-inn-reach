import React from 'react';
import { FormattedMessage } from 'react-intl';
import { omit } from 'lodash';

import {
  SORT_PARAMETER,
  SORT_ORDER_PARAMETER,
} from '../constants';

export const getCheckboxFilterOptions = (filterName, options) => options.map(filterValue => ({
  label: <FormattedMessage id={`ui-inn-reach.transaction.${filterName}.${filterValue.toLowerCase()}`} />,
  value: filterValue
}));

export const applyFiltersAdapter = applyFilters => ({ name, values }) => applyFilters(name, values);

export const handleClearFilter = (onChange, name) => () => onChange({ name, values: [] });

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [
    SORT_PARAMETER,
    SORT_ORDER_PARAMETER,
  ],
);

export const getFiltersCount = (filters) => {
  return filters && Object.keys(getFilterParams(filters)).filter(k => filters[k] !== undefined).length;
};
