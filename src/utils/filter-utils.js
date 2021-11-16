import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getCheckboxFilterOptions = (filterName, options) => options.map(filterValue => ({
  label: <FormattedMessage id={`ui-inn-reach.transaction.${filterName}.${filterValue.toLowerCase()}`} />,
  value: filterValue
}));

export const applyFiltersAdapter = applyFilters => ({ name, values }) => applyFilters(name, values);

export const handleClearFilter = (onChange, name) => () => onChange({ name, values: [] });
