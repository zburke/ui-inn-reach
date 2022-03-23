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
  COLUMN_NAMES_FOR_OVERDUE_REPORT,
  METADATA,
  METADATA_FIELDS,
  COLUMN_NAMES_FOR_REQUESTED_TOO_LONG_REPORT,
  COLUMN_NAMES_FOR_RETURNED_TOO_LONG_REPORT,
  REPORT_FIELDS,
  REPORT_TYPES,
  REPORT_MODALS,
  COLUMN_NAMES_FOR_PAGED_TOO_LONG_REPORT,
} from '../../constants';
import {
  getParams,
} from '../../utils';
import CsvReport from './CsvReport';
import {
  formatDateAndTime,
  getAgencyData,
  getData,
  getParamsForOverdueReport,
  getParamsForRequestedTooLongReport,
  getParamsForReturnedTooLongReport,
  getParamsForOwningSitePagedTooLongReport,
} from './utils';

const {
  OVERDUE,
  REQUESTED_TOO_LONG,
  RETURNED_TOO_LONG,
  PAGED_TOO_LONG,
} = REPORT_TYPES;

const {
  CALL_NUMBER,
  PATRON_ID,
  FOLIO_ITEM_BARCODE,
  TITLE,
  DUE_DATE_TIME,
  BARCODE,
  HRID,
} = HOLD_FIELDS;

const {
  CREATED_DATE,
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  ITEM_TITLE,
  ITEM_CALL_NUMBER,
  ITEM_LOCATION,
  ITEM_BARCODE,
  REQUESTING_PATRON_ID,
  PATRON_HOME_LIBRARY,
  DATE_RETURNED,
  DATE_REQUESTED,
  PATRON_AGENCY,
  PATRON_ID_FIELD,
  LOAN_DUE_DATE,
  ITEM_HRID,
  REQUESTING_PATRON_AGENCY,
  EFFECTIVE_LOCATION,
  PAGED_DATE,
} = REPORT_FIELDS;

const {
  SHOW_OVERDUE_REPORT_MODAL,
  SHOW_REQUESTED_TOO_LONG_REPORT_MODAL,
  SHOW_RETURNED_TOO_LONG_REPORT_MODAL,
  SHOW_PAGED_TOO_LONG_REPORT_MODAL,
} = REPORT_MODALS;

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
    [SHOW_RETURNED_TOO_LONG_REPORT_MODAL]: false,
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

  const getCsvDataForOverdueReport = async (loans) => {
    const {
      agencyCodeMap,
      loansMap,
      items,
    } = await getData(mutator, loans);

    return items.map(item => {
      const {
        patronAgencyDescription,
        patronAgencyCode,
        holdData,
      } = getAgencyData(loansMap, item, agencyCodeMap);

      return {
        [PATRON_ID_FIELD]: holdData[PATRON_ID],
        [EFFECTIVE_LOCATION]: item[EFFECTIVE_LOCATION].name,
        [ITEM_CALL_NUMBER]: item[CALL_NUMBER],
        [ITEM_BARCODE]: holdData[FOLIO_ITEM_BARCODE],
        [ITEM_TITLE]: holdData[TITLE],
        [PATRON_AGENCY]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [LOAN_DUE_DATE]: formatDateAndTime(holdData[DUE_DATE_TIME] * 1000, intl.formatTime),
      };
    });
  };

  const getCsvDataForRequestedTooLongReport = async (loans) => {
    const {
      agencyCodeMap,
      loansMap,
      items,
    } = await getData(mutator, loans);

    return items.map(item => {
      const {
        itemAgencyCode,
        itemAgencyDescription,
        patronAgencyCode,
        patronAgencyDescription,
        holdData,
      } = getAgencyData(loansMap, item, agencyCodeMap);

      return {
        [ITEM_LOCATION]: `${itemAgencyDescription}(${itemAgencyCode})`,
        [ITEM_CALL_NUMBER]: item[CALL_NUMBER],
        [ITEM_BARCODE]: holdData[FOLIO_ITEM_BARCODE],
        [ITEM_TITLE]: holdData[TITLE],
        [PATRON_AGENCY]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [PATRON_ID_FIELD]: holdData[PATRON_ID],
        [DATE_REQUESTED]: formatDateAndTime(item[METADATA][CREATED_DATE], intl.formatTime),
      };
    });
  };

  const getCsvDataForReturnedTooLongReport = async (loans) => {
    const {
      agencyCodeMap,
      loansMap,
      items,
    } = await getData(mutator, loans);

    return items.map(item => {
      const {
        itemAgencyCode,
        itemAgencyDescription,
        patronAgencyCode,
        patronAgencyDescription,
        holdData,
      } = getAgencyData(loansMap, item, agencyCodeMap);

      return {
        [ITEM_LOCATION]: `${itemAgencyDescription}(${itemAgencyCode})`,
        [ITEM_CALL_NUMBER]: item[CALL_NUMBER],
        [ITEM_BARCODE]: holdData[FOLIO_ITEM_BARCODE],
        [ITEM_TITLE]: holdData[TITLE],
        [PATRON_HOME_LIBRARY]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [REQUESTING_PATRON_ID]: holdData[PATRON_ID],
        [DATE_RETURNED]: formatDateAndTime(item[METADATA][UPDATED_DATE], intl.formatTime),
      };
    });
  };

  const getPagedTooLongLoansToCsv = async (loans) => {
    const {
      agencyCodeMap,
      loansMap,
      items,
    } = await getData(mutator, loans);

    return items.map(item => {
      const {
        patronAgencyCode,
        patronAgencyDescription,
      } = getAgencyData(loansMap, item, agencyCodeMap);

      return {
        [ITEM_HRID]: item[HRID],
        [EFFECTIVE_LOCATION]: item[EFFECTIVE_LOCATION].name,
        [ITEM_CALL_NUMBER]: item[CALL_NUMBER],
        [ITEM_BARCODE]: item[BARCODE],
        [ITEM_TITLE]: item[TITLE],
        [REQUESTING_PATRON_AGENCY]: `${patronAgencyDescription} (${patronAgencyCode})`,
        [PAGED_DATE]: formatDateAndTime(item[METADATA][UPDATED_DATE], intl.formatTime),
      };
    });
  };

  const generateReport = (type, record) => {
    if (exportInProgress) return;

    let getLoansToCsv;
    let reportColumns;
    let params;

    switch (type) {
      case OVERDUE:
        getLoansToCsv = getCsvDataForOverdueReport;
        reportColumns = COLUMN_NAMES_FOR_OVERDUE_REPORT;
        params = getParamsForOverdueReport(record);
        break;
      case REQUESTED_TOO_LONG:
        getLoansToCsv = getCsvDataForRequestedTooLongReport;
        reportColumns = COLUMN_NAMES_FOR_REQUESTED_TOO_LONG_REPORT;
        params = getParamsForRequestedTooLongReport(record);
        break;
      case RETURNED_TOO_LONG:
        getLoansToCsv = getCsvDataForReturnedTooLongReport;
        reportColumns = COLUMN_NAMES_FOR_RETURNED_TOO_LONG_REPORT;
        params = getParamsForReturnedTooLongReport(record);
        break;
      case PAGED_TOO_LONG:
        getLoansToCsv = getPagedTooLongLoansToCsv;
        reportColumns = COLUMN_NAMES_FOR_PAGED_TOO_LONG_REPORT;
        params = getParamsForOwningSitePagedTooLongReport(record);
        break;
      default:
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
