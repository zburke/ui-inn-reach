import React, {
  useCallback,
  cloneElement,
  useState,
  useMemo,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import {
  useLocationReset,
  useList,
  useCallout,
  useToggle,
} from '../../hooks';
import TransactionList from '../../components/transaction/TransactionList';
import {
  TRANSACTION_LIST_DEFAULT_SORT_FIELD,
  RESULT_COUNT_INCREMENT,
  getTransactionListUrl,
  NO_ITEMS_FOUND,
  CALLOUT_ERROR_TYPE,
  CENTRAL_SERVERS_LIMITING,
  HOLD_FIELDS,
  INVENTORY_ITEM_FIELDS,
  TRANSACTION_FIELDS,
  OVERDUE,
  OVERDUE_COLUMNS_FOR_CSV,
} from '../../constants';
import {
  getParams,
} from '../../utils';
import CsvReport from './CsvReport';
import {
  fetchBatchItems,
  fetchLocalServers,
  getAgencyCodeMap,
  getLoansMap,
  getOverdueParams,
} from './utils';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  PATRON_AGENCY_CODE,
  CALL_NUMBER,
} = HOLD_FIELDS;

const {
  EFFECTIVE_LOCATION,
} = INVENTORY_ITEM_FIELDS;

const resetData = () => {};

const TransactionListRoute = ({
  mutator,
  location,
  history,
  children,
}) => {
  const showCallout = useCallout();
  const intl = useIntl();

  const [exportInProgress, setExportInProgress] = useState(false);
  const [showOverdueReportModal, toggleOverdueReportModal] = useToggle(false);

  const csvReport = useMemo(() => new CsvReport({ intl }), [intl]);

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
    onUpdateList: onUpdateTransactionList,
    refreshList,
  } = useList(false, loadTransactions, loadTransactionsCB, RESULT_COUNT_INCREMENT);

  useLocationReset(history, location, getTransactionListUrl(), refreshList);

  const additionalProps = {
    render: props => children.props.render({ ...props, onUpdateTransactionList }),
  };

  const getOverdueLoansToCsv = async (loans) => {
    const localServers = await fetchLocalServers(mutator, loans);
    const agencyCodeMap = getAgencyCodeMap(localServers);
    const items = await fetchBatchItems(mutator, loans);
    const loansMap = getLoansMap(loans);

    return items.map(item => {
      const patronAgencyCode = loansMap.get(item.id)[HOLD][PATRON_AGENCY_CODE];
      const agencyDescription = agencyCodeMap.get(patronAgencyCode);

      return {
        ...loansMap.get(item.id),
        [CALL_NUMBER]: item[CALL_NUMBER],
        [EFFECTIVE_LOCATION]: item[EFFECTIVE_LOCATION].name,
        [PATRON_AGENCY_CODE]: `${agencyDescription} (${patronAgencyCode})`,
      };
    });
  };

  const generateReport = (type, record) => {
    if (exportInProgress) return;

    let getLoansToCsv;
    let reportColumns;
    let params;

    if (type === OVERDUE) {
      getLoansToCsv = getOverdueLoansToCsv;
      reportColumns = OVERDUE_COLUMNS_FOR_CSV;
      params = getOverdueParams(record);
    }

    setExportInProgress(true);
    showCallout({ message: <FormattedMessage id="ui-inn-reach.reports.callout.export-in-progress" /> });

    csvReport.generate(mutator, getLoansToCsv, params, reportColumns)
      .catch(error => {
        if (error.message === NO_ITEMS_FOUND) {
          showCallout({
            type: CALLOUT_ERROR_TYPE,
            message: <FormattedMessage id="ui-inn-reach.reports.callout.no-items-found" />,
          });
        }
      })
      .finally(() => setExportInProgress(false));
  };

  return (
    <TransactionList
      isLoading={isLoading}
      transactions={transactions}
      transactionsCount={transactionsCount}
      resetData={resetData}
      showOverdueReportModal={showOverdueReportModal}
      onGenerateReport={generateReport}
      onToggleOverdueReportModal={toggleOverdueReportModal}
      onNeedMoreData={onNeedMoreData}
    >
      {cloneElement(children, additionalProps)}
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
  items: {
    type: 'okapi',
    path: 'inventory/items',
    accumulate: 'true',
    fetch: false,
  },
  localServers: {
    type: 'okapi',
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
  centralServerRecords: {
    type: 'okapi',
    path: `inn-reach/central-servers?limit=${CENTRAL_SERVERS_LIMITING}`,
    accumulate: true,
    fetch: false,
    throwErrors: false,
  },
});

TransactionListRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node,
  mutator: PropTypes.shape({
    transactionRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
  }),
};

export default withRouter(stripesConnect(TransactionListRoute));
