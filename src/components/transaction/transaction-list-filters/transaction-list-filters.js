import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import {
  CheckboxFilter,
} from '../../common';

import {
  TRANSACTION_TYPE_FILTER_PARAMETER,
  TRANSACTION_TYPES,
} from '../../../constants';
import {
  applyFiltersAdapter,
  getCheckboxFilterOptions,
} from '../../../utils';

const TransactionListFilters = ({
  activeFilters,
  applyFilters,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  const getTransactionTypeDataOptions = useMemo(() => (
    getCheckboxFilterOptions(
      TRANSACTION_TYPE_FILTER_PARAMETER,
      TRANSACTION_TYPES,
    )), [TRANSACTION_TYPES]);

  return (
    <AccordionSet>
      <CheckboxFilter
        activeFilters={activeFilters[TRANSACTION_TYPE_FILTER_PARAMETER]}
        id={TRANSACTION_TYPE_FILTER_PARAMETER}
        labelId="ui-inn-reach.transaction.filter.transactionType"
        name={TRANSACTION_TYPE_FILTER_PARAMETER}
        options={getTransactionTypeDataOptions}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

TransactionListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default TransactionListFilters;
