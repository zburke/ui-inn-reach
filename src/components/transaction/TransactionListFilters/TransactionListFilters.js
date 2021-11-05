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
  getCentralServerAgencyOptions,
  getCentralServerPatronTypeOptions,
  getCentralServerItemTypeOptions,
} from './utils';

const {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
  CENTRAL_SERVER,
  PATRON_AGENCY,
  ITEM_AGENCY,
  PATRON_TYPE,
  ITEM_TYPE,
} = TRANSACTION_FILTER_NAMES;

const TransactionListFilters = ({
  resources: {
    centralServerRecords: {
      records: centralServers,
    },
    centralServerAgencies: {
      records: agencies,
    },
    centralServerPatronTypes: {
      records: patronTypes,
    },
    centralServerItemTypes: {
      records: itemTypes,
    },
  },
  activeFilters,
  applyFilters,
}) => {
  const servers = centralServers[0]?.centralServers || [];
  const centralServerAgencies = agencies[0]?.centralServerAgencies || [];
  const centralServerPatronTypes = patronTypes[0]?.centralServerPatronTypes || [];
  const centralServerItemTypes = itemTypes[0]?.centralServerItemTypes || [];
  const transactionStatusOptions = useMemo(() => getTransactionStatusOptions(Object.values(TRANSACTION_STATUSES)), []);
  const centralServerOptions = useMemo(() => getCentralServerOptions(servers), [servers]);
  const centralServerAgencyOptions = useMemo(() => getCentralServerAgencyOptions(centralServerAgencies), [centralServerAgencies]);
  const centralServerPatronTypeOptions = useMemo(() => getCentralServerPatronTypeOptions(centralServerPatronTypes), [centralServerPatronTypes]);
  const centralServerItemTypeOptions = useMemo(() => getCentralServerItemTypeOptions(centralServerItemTypes), [centralServerItemTypes]);

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
      <MultiChoiceFilter
        name={PATRON_AGENCY}
        activeFilters={activeFilters[PATRON_AGENCY]}
        dataOptions={centralServerAgencyOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={ITEM_AGENCY}
        activeFilters={activeFilters[ITEM_AGENCY]}
        dataOptions={centralServerAgencyOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={PATRON_TYPE}
        activeFilters={activeFilters[PATRON_TYPE]}
        dataOptions={centralServerPatronTypeOptions}
        onChange={adaptedApplyFilters}
      />
      <MultiChoiceFilter
        name={ITEM_TYPE}
        activeFilters={activeFilters[ITEM_TYPE]}
        dataOptions={centralServerItemTypeOptions}
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
    centralServerAgencies: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    centralServerPatronTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    centralServerItemTypes: PropTypes.shape({
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
  centralServerAgencies: {
    type: 'okapi',
    path: 'inn-reach/central-servers/agencies',
    throwErrors: false,
  },
  centralServerPatronTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/patron-types',
    throwErrors: false,
  },
  centralServerItemTypes: {
    type: 'okapi',
    path: 'inn-reach/central-servers/item-types',
    throwErrors: false,
  },
});

export default stripesConnect(TransactionListFilters);
