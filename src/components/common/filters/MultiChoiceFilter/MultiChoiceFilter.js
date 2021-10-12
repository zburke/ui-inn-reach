import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { MultiSelectionFilter } from '@folio/stripes-smart-components';
import FilterAccordion from '../FilterAccordion';

const MultiChoiceFilter = ({
  name,
  activeFilters,
  dataOptions,
  closedByDefault,
  disabled,
  onChange,
}) => {
  return (
    <FilterAccordion
      id={`${name}-filter-accordion`}
      label={<FormattedMessage id={`ui-inn-reach.transaction.${name}`} />}
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
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
};

MultiChoiceFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default MultiChoiceFilter;
