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
  METADATA,
  METADATA_FIELDS,
  REQUESTED_TOO_LONG,
  REQUESTED_TOO_LONG_COLUMNS_FOR_CSV,
  SHOW_OVERDUE_REPORT_MODAL,
  SHOW_REQUESTED_TOO_LONG_REPORT_MODAL,
  PAGED_TOO_LONG_COLUMNS_FOR_CSV,
  PAGED_TOO_LONG,
  SHOW_PAGED_TOO_LONG_REPORT_MODAL,
  PAGED_TOO_LONG_COLUMN_TRANSLATIONS,
} from '../../constants';
import {
  getParams,
} from '../../utils';
import CsvReport from './CsvReport';
import {
  fetchBatchItems,
  fetchLocalServers,
  formatDateAndTime,
  getAgencyCodeMap,
  getLoansMap,
  getOverdueParams,
  getRequestedTooLongParams,
  getOwningSitePagedTooLongParams,
} from './utils';

const {
  PAGED_ITEM_HRID,
  PAGED_EFFECTIVE_LOCATION,
  PAGED_CALL_NUMBER,
  PAGED_BARCODE,
  PAGED_TITLE,
  PAGED_PATRON_AGENCY_CODE,
  PAGED_DATE,
} = PAGED_TOO_LONG_COLUMN_TRANSLATIONS;
const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  ITEM_AGENCY_CODE,
  PATRON_AGENCY_CODE,
  CALL_NUMBER,
  BARCODE,
  HRID,
  TITLE,
} = HOLD_FIELDS;

const {
  EFFECTIVE_LOCATION,
} = INVENTORY_ITEM_FIELDS;

const {
  CREATED_DATE,
  UPDATED_DATE,
} = METADATA_FIELDS;

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
  const [statesOfModalReports, setStatesOfModalReports] = useState({
    [SHOW_OVERDUE_REPORT_MODAL]: false,
    [SHOW_REQUESTED_TOO_LONG_REPORT_MODAL]: false,
    [SHOW_PAGED_TOO_LONG_REPORT_MODAL]: false,
  });

  const csvReport = useMemo(() => new CsvReport({ intl }), [intl]);

  const toggleStatesOfModalReports = (modalName) => {
    setStatesOfModalReports(prev => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  };

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

  const getRequestedTooLongLoansToCsv = async (loans) => {
    const localServers = await fetchLocalServers(mutator, loans);
    const agencyCodeMap = getAgencyCodeMap(localServers);
    const items = await fetchBatchItems(mutator, loans);
    const loansMap = getLoansMap(loans);

    return items.map(item => {
      const itemData = loansMap.get(item.id);
      const patronAgencyCode = itemData[HOLD][PATRON_AGENCY_CODE];
      const itemAgencyCode = itemData[HOLD][ITEM_AGENCY_CODE];
      const itemAgencyDescription = agencyCodeMap.get(itemAgencyCode);
      const patronAgencyDescription = agencyCodeMap.get(patronAgencyCode);

      return {
        ...loansMap.get(item.id),
        [ITEM_AGENCY_CODE]: `${itemAgencyDescription}(${itemAgencyCode})`,
        [CALL_NUMBER]: item[CALL_NUMBER],
        [PATRON_AGENCY_CODE]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [CREATED_DATE]: formatDateAndTime(item[METADATA][CREATED_DATE], intl.formatTime),
      };
    });
  };

  const getPagedTooLongLoansToCsv = async (loans) => {
    const localServers = await fetchLocalServers(mutator, loans);
    const agencyCodeMap = getAgencyCodeMap(localServers);
    const items = await fetchBatchItems(mutator, loans);
    const loansMap = getLoansMap(loans);

    return items.map(item => {
      const itemData = loansMap.get(item.id);
      const patronAgencyCode = itemData[HOLD][PATRON_AGENCY_CODE];
      const patronAgencyDescription = agencyCodeMap.get(patronAgencyCode);

      return {
        [PAGED_ITEM_HRID]: item[HRID],
        [PAGED_EFFECTIVE_LOCATION]: item[EFFECTIVE_LOCATION].name,
        [PAGED_CALL_NUMBER]: item[CALL_NUMBER],
        [PAGED_BARCODE]: item[BARCODE],
        [PAGED_TITLE]: item[TITLE],
        [PAGED_PATRON_AGENCY_CODE]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [PAGED_DATE]: formatDateAndTime(item[METADATA][UPDATED_DATE], intl.formatTime),
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
    } else if (type === REQUESTED_TOO_LONG) {
      getLoansToCsv = getRequestedTooLongLoansToCsv;
      reportColumns = REQUESTED_TOO_LONG_COLUMNS_FOR_CSV;
      params = getRequestedTooLongParams(record);
    } else if (type === PAGED_TOO_LONG) {
      getLoansToCsv = getPagedTooLongLoansToCsv;
      reportColumns = PAGED_TOO_LONG_COLUMNS_FOR_CSV;
      params = getOwningSitePagedTooLongParams(record);
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
      statesOfModalReports={statesOfModalReports}
      onGenerateReport={generateReport}
      onToggleStatesOfModalReports={toggleStatesOfModalReports}
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
