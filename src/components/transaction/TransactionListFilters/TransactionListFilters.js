import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  CheckboxFilter,
  MultiChoiceFilter,
} from '../../common';

import {
  CENTRAL_SERVERS_LIMITING,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_FILTER_NAMES,
} from '../../../constants';
import {
  applyFiltersAdapter,
  getCentralServerOptions,
  getCheckboxFilterOptions,
} from '../../../utils';
import {
  getTransactionStatusOptions,
} from './utils';

const {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
  CENTRAL_SERVER,
} = TRANSACTION_FILTER_NAMES;

const TransactionListFilters = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
    },
  },
  activeFilters,
  applyFilters,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const transactionStatusOptions = useMemo(() => getTransactionStatusOptions(Object.values(TRANSACTION_STATUSES)), []);
  const centralServerOptions = useMemo(() => getCentralServerOptions(servers), [servers]);

  const adaptedApplyFilters = useCallback(applyFiltersAdapter(applyFilters), [applyFilters]);

  const getTransactionTypeDataOptions = useMemo(() => (
    getCheckboxFilterOptions(
      TRANSACTION_TYPE,
      Object.values(TRANSACTION_TYPES),
    )), [TRANSACTION_TYPES]);

  return (
    <AccordionSet>
      <CheckboxFilter
        activeFilters={activeFilters[TRANSACTION_TYPE]}
        id={TRANSACTION_TYPE}
        labelId="ui-inn-reach.transaction.transactionType"
        name={TRANSACTION_TYPE}
        options={getTransactionTypeDataOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={TRANSACTION_STATUS}
        activeFilters={activeFilters[TRANSACTION_STATUS]}
        dataOptions={transactionStatusOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={CENTRAL_SERVER}
        activeFilters={activeFilters[CENTRAL_SERVER]}
        dataOptions={centralServerOptions}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

TransactionListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    centralServerRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }),
};

TransactionListFilters.manifest = Object.freeze({
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    throwErrors: false,
  },
});

export default stripesConnect(TransactionListFilters);
