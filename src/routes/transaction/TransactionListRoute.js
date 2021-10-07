import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import {
  useLocationReset,
  useList,
} from '../../hooks';
import TransactionList from '../../components/transaction/TransactionList';
import {
  TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  RESULT_COUNT_INCREMENT,
  getTransactionListUrl,
} from '../../constants';
import {
  getParams,
} from '../../utils';

const resetData = () => {};

const TransactionListRoute = ({
  mutator,
  location,
  history,
  children,
}) => {
  const loadTransactions = (offset) => mutator.transactionRecords.GET({
    params: {
      limit: RESULT_COUNT_INCREMENT,
      offset,
      ...getParams(location.search, TRANSACTION_LIST_DEFAULT_SORT_FIELD),
    }
  });

  const loadTransactionsCB = useCallback((setTransactions, transactionsResponse) => {
    setTransactions((prev) => [...prev, ...transactionsResponse.transactions]);
  }, []);

  const {
    records: transactions,
    recordsCount: transactionsCount,
    isLoading,
    onNeedMoreData,
    refreshList,
  } = useList(false, loadTransactions, loadTransactionsCB, RESULT_COUNT_INCREMENT);

  useLocationReset(history, location, getTransactionListUrl(), refreshList);

  return (
    <TransactionList
      isLoading={isLoading}
      transactions={transactions}
      transactionsCount={transactionsCount}
      resetData={resetData}
      onNeedMoreData={onNeedMoreData}
    >
      {children}
    </TransactionList>
  );
};

TransactionListRoute.manifest = Object.freeze({
  transactionRecords: {
    type: 'okapi',
    path: 'inn-reach/transactions',
    fetch: false,
    accumulate: true,
  },
  query: { initialValue: {} },
  resultCount: { initialValue: RESULT_COUNT_INCREMENT },
});

TransactionListRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node,
  mutator: PropTypes.shape({
    transactionRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
  }),
};

export default withRouter(stripesConnect(TransactionListRoute));
