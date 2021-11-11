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
  HOLD_FIELDS,
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
  [TRANSACTION_FIELDS.TIME]: (data) => {
    const timestamp = data[TRANSACTION_FIELDS.HOLD][HOLD_FIELDS.TRANSACTION_TIME] * 1000;

    return (
      <FormattedMessage
        id="ui-inn-reach.transaction.field.label.time"
        values={{
          date: <FormattedDate value={timestamp} />,
          time: <FormattedTime value={timestamp} />,
        }}
      />
    );
  },
  [TRANSACTION_FIELDS.TYPE]: data => (
    <FormattedMessage id={`ui-inn-reach.transaction.transactionType.${data[TRANSACTION_FIELDS.TYPE].toLowerCase()}`} />
  ),
  [TRANSACTION_FIELDS.ITEM_TITLE]: data => {
    const hold = data[TRANSACTION_FIELDS.HOLD];
    const itemTitle = hold[HOLD_FIELDS.TITLE] || <NoValue />;
    const itemAgencyCode = hold[HOLD_FIELDS.ITEM_AGENCY_CODE] || <NoValue />;

    return (
      <FormattedMessage
        id="ui-inn-reach.transaction.list.itemTitle"
        tagName="span"
        values={{
          itemTitle,
          itemAgencyCode,
        }}
      />
    );
  },
  [TRANSACTION_FIELDS.PATRON_NAME]: data => {
    const hold = data[TRANSACTION_FIELDS.HOLD];
    const patronName = hold[HOLD_FIELDS.PATRON_NAME] || <NoValue />;
    const patronAgencyCode = hold[HOLD_FIELDS.PATRON_AGENCY_CODE] || <NoValue />;

    return (
      <FormattedMessage
        id="ui-inn-reach.transaction.list.patronName"
        tagName="span"
        values={{
          patronName,
          patronAgencyCode,
        }}
      />
    );
  },
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
      {children}
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
