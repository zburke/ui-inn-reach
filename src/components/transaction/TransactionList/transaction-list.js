import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  NoValue,
  FormattedDate,
  FormattedTime,
} from '@folio/stripes/components';
import { withStripes } from '@folio/stripes/core';

import {
  SearchAndFilter,
} from '../../common';
import {
  TRANSACTION_FIELDS,
} from '../../../constants';
import { openItemDetail } from '../../../utils';

const resultsPaneTitle = <FormattedMessage id="ui-inn-reach.title.list.transactions" />;

const visibleColumns = [
  TRANSACTION_FIELDS.TIME,
  TRANSACTION_FIELDS.TYPE,
  TRANSACTION_FIELDS.ITEM_TITLE,
  TRANSACTION_FIELDS.PATRON_NAME,
  TRANSACTION_FIELDS.STATUS,
];

const columnMapping = {
  [TRANSACTION_FIELDS.TIME]: <FormattedMessage id="ui-inn-reach.transaction.field.time" />,
  [TRANSACTION_FIELDS.TYPE]: <FormattedMessage id="ui-inn-reach.transaction.field.type" />,
  [TRANSACTION_FIELDS.ITEM_TITLE]: <FormattedMessage id="ui-inn-reach.transaction.field.itemTitle" />,
  [TRANSACTION_FIELDS.PATRON_NAME]: <FormattedMessage id="ui-inn-reach.transaction.field.patronName" />,
  [TRANSACTION_FIELDS.STATUS]: <FormattedMessage id="ui-inn-reach.transaction.field.status" />,
};

const resultsFormatter = {
  [TRANSACTION_FIELDS.TIME]: (data) => (
    <FormattedMessage
      id="ui-inn-reach.transaction.field.label.time"
      values={{
        date: <FormattedDate value={data[TRANSACTION_FIELDS.TIME]} />,
        time: <FormattedTime value={data[TRANSACTION_FIELDS.TIME]} />,
      }}
    />
  ),
  [TRANSACTION_FIELDS.TYPE]: data => (
    <FormattedMessage id={`ui-inn-reach.transaction.field.label.transactionType.${data[TRANSACTION_FIELDS.TYPE]}`} />
  ),
  [TRANSACTION_FIELDS.ITEM_TITLE]: data => (data[TRANSACTION_FIELDS.ITEM_TITLE]
    ? data[TRANSACTION_FIELDS.ITEM_TITLE]
    : <NoValue />
  ),
  [TRANSACTION_FIELDS.PATRON_NAME]: data => (data[TRANSACTION_FIELDS.PATRON_NAME]
    ? data[TRANSACTION_FIELDS.PATRON_NAME]
    : <NoValue />
  ),
  [TRANSACTION_FIELDS.STATUS]: data => (data[TRANSACTION_FIELDS.STATUS]
    ? data[TRANSACTION_FIELDS.STATUS]
    : <NoValue />
  ),
};

const TransactionListView = ({
  isLoading,
  onNeedMoreData,
  resetData,
  history,
  match,
  location,
  transactions,
  transactionsCount,
  children,
}) => {
  const openTransactionDetails = useCallback(
    (e, meta) => {
      openItemDetail({
        path: match.path,
        id: meta.id,
        history,
        location,
      });
    },
    [location.search],
  );

  return (
    <SearchAndFilter
      columnMapping={columnMapping}
      contentData={transactions}
      count={transactionsCount}
      id="transactions-list"
      isLoading={isLoading}
      isShowAddNew={false}
      resetData={resetData}
      resultsFormatter={resultsFormatter}
      resultsPaneTitle={resultsPaneTitle}
      visibleColumns={visibleColumns}
      onNeedMoreData={onNeedMoreData}
      onRowClick={openTransactionDetails}
    >
      { children }
    </SearchAndFilter>
  );
};

TransactionListView.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  resetData: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  transactions: PropTypes.arrayOf(PropTypes.object),
  transactionsCount: PropTypes.number,
};

TransactionListView.defaultProps = {
  transactionsCount: 0,
  isLoading: false,
  transactions: [],
};

export default withRouter(withStripes(TransactionListView));
