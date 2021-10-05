import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-components';
import TransactionDetail from './TransactionDetail';
import {
  getTransactionListUrl,
} from '../../../constants';

const TransactionDetailContainer = ({
  resources: {
    transactionView: {
      records: transactionData,
      isPending: isTransactionPending,
    },
  },
  history,
  location,
}) => {
  const transaction = transactionData[0]?.transaction || {};

  const backToList = useCallback(() => {
    history.push({
      pathname: getTransactionListUrl(),
      search: location.search,
    });
  }, [history, location.search]);

  if (isTransactionPending) return <LoadingPane />;

  return (
    <TransactionDetail
      transaction={transaction}
      onClose={backToList}
    />
  );
};

TransactionDetailContainer.manifest = Object.freeze({
  transactionView: {
    type: 'okapi',
    path: 'inn-reach/transactions/:{id}',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

TransactionDetailContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    transactionView: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(TransactionDetailContainer);
