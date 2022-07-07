import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import FilterAccordion from '../FilterAccordion';

const MultiChoiceFilter = ({
  name,
  labelId,
  activeFilters,
  dataOptions,
  closedByDefault,
  disabled,
  onChange,
}) => {
  return (
    <FilterAccordion
      id={`${name}-filter-accordion`}
      label={<FormattedMessage id={labelId} />}
      name={name}
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      onChange={onChange}
    >
      <MultiSelectionFilter
        id={`${name}-filter`}
        name={name}
        ariaLabelledBy={`accordion-toggle-button-transaction-filter-${name}`}
        dataOptions={dataOptions}
        selectedValues={activeFilters}
        disabled={disabled}
        onChange={onChange}
      />
    </FilterAccordion>
  );
};

MultiChoiceFilter.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
};

MultiChoiceFilter.defaultProps = {
  disabled: false,
};

export default MultiChoiceFilter;
