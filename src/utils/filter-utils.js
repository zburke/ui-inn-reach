import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getCheckboxFilterOptions = (filterName, options) => options.map(filterValue => ({
  label: <FormattedMessage id={`ui-inn-reach.transaction.filter.${filterName}.${filterValue}`} />,
  value: filterValue
}));

export const applyFiltersAdapter = applyFilters => ({ name, values }) => applyFilters(name, values);

export const handleClearFilter = (onChange, name) => () => onChange({ name, values: [] });
