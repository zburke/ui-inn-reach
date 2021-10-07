import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../../../../common/filters';
import {
  TRANSACTION_STATUSES,
} from '../../../../../constants';

const getTransactionStatusOptions = statuses => {
  return statuses.map(status => ({
    label: status,
    value: status,
  }));
};

const TransactionStatusFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  name,
  id,
  onChange,
}) => {
  const statuses = useMemo(() => getTransactionStatusOptions(Object.values(TRANSACTION_STATUSES)), [TRANSACTION_STATUSES]);
  const intl = useIntl();
  const labelId = 'ui-inn-reach.transaction.transactionStatus';
  const label = useMemo(() => intl.formatMessage({ id: labelId }), [intl, labelId]);

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id="transaction-status-filter-accordion"
      label={label}
      name={name}
      onChange={onChange}
    >
      <MultiSelectionFilter
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={statuses}
        disabled={disabled}
        id="transaction-status-filter"
        name={name}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </FilterAccordion>
  );
};

TransactionStatusFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
};

TransactionStatusFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default TransactionStatusFilter;
