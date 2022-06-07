import {
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  isEmpty,
} from 'lodash';
import cloneDeep from 'lodash/cloneDeep';

import {
  Button,
  Paneset,
  Pane,
  PaneFooter,
  Icon,
} from '@folio/stripes-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { ChangeDueDateDialog } from '@folio/stripes/smart-components';

import {
  DESC_ORDER,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
  CALLOUT_ERROR_TYPE,
  FILL_PANE_WIDTH,
  FILTER_PANE_WIDTH,
  getCheckOutToBorrowingSiteUrl,
  ICONS,
  METADATA_FIELDS,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../../constants';

import {
  ItemForm,
  ListCheckOutItems,
} from './components';
import {
  NavigationMenu,
} from '../common';
import {
  useCallout,
} from '../../hooks';
import css from './CheckOutBorrowingSite.css';

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  ITEM,
} = TRANSACTION_TYPES;

const {
  TYPE,
  STATUS,
  ITEM_BARCODE,
} = TRANSACTION_FIELDS;

const {
  ITEM_HOLD,
  TRANSFER,
} = TRANSACTION_STATUSES;

const CheckOutBorrowingSite = ({
  history,
  location,
  resources: {
    transactionRecords: {
      records: transactionsData,
      isPending: isTransactionsPending,
    },
    checkoutBorroingSiteItem: {
      isPending: isCheckoutBorroingSitePending,
    },
  },
  mutator,
  stripes,
}) => {
  const showCallout = useCallout();
  const intl = useIntl();
  const itemFormRef = useRef({});
  const isLoading = isTransactionsPending || isCheckoutBorroingSitePending;

  const [scannedItems, setScannedItems] = useState([]);
  const [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);

  const ConnectedDialog = stripes.connect(ChangeDueDateDialog);

  const [loanToChangeDueDate, setLoanToChangeDueDate] = useState(null);
  const [showChangeDueDateDialog, setShowChangeDueDateDialog] = useState(false);

  const fetchLoan = () => {
    mutator.loans.reset();

    return mutator.loans.GET({
      params: {
        query: `id=${loanToChangeDueDate.id}`
      },
    });
  };

  const hideChangeDueDateDialog = useCallback(() => {
    fetchLoan()
      .then((loansResponse) => {
        const scannedItemsToChange = cloneDeep(scannedItems);

        const loanToChandeIndex = scannedItemsToChange.findIndex((loan => loan.id === loansResponse.loans[0].id));

        scannedItemsToChange[loanToChandeIndex].dueDate = loansResponse.loans[0].dueDate;

        setShowChangeDueDateDialog(false);
        setScannedItems(scannedItemsToChange);
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.loan.callout.connection-problem.get.loan" />,
        });
      });
  }, [showChangeDueDateDialog, setScannedItems, scannedItems, setShowChangeDueDateDialog]);

  const renderDialog = useCallback(() => {
    return (
      <ConnectedDialog
        user={{ id: loanToChangeDueDate.userId }}
        stripes={stripes}
        loanIds={[{ id: loanToChangeDueDate.id }]}
        open={showChangeDueDateDialog}
        onClose={hideChangeDueDateDialog}
      />
    );
  }, [hideChangeDueDateDialog, showChangeDueDateDialog, loanToChangeDueDate]);

  const addScannedItem = ({ folioCheckOut, transaction }) => {
    const scannedItem = {
      transactionId: transaction.id,
      ...folioCheckOut,
    };

    setScannedItems(prev => [scannedItem, ...prev]);
  };

  const fetchReceiveShippedItem = useCallback(() => {
    mutator.checkoutBorroingSiteItem.POST({})
      .then(addScannedItem)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.connection-problem.post.check-out-borrowing-site" />,
        });
      });
  }, [isTransactionsLoaded]);

  const fetchTransactions = (itemBarcode) => {
    setIsTransactionsLoaded(false);
    mutator.transactionRecords.reset();
    mutator.transactionRecords.GET({
      params: {
        [ITEM_BARCODE]: itemBarcode.trim(),
        [TYPE]: ITEM,
        [STATUS]: [ITEM_HOLD, TRANSFER],
        [SORT_PARAMETER]: UPDATED_DATE,
        [SORT_ORDER_PARAMETER]: DESC_ORDER,
      },
    })
      .then(({ transactions: [transaction] }) => {
        const servicePointId = stripes?.user?.user?.curServicePoint?.id;

        setIsTransactionsLoaded(true);
        mutator.itemBarcode.replace(transaction?.hold?.folioItemBarcode || '');
        mutator.servicePointId.replace(servicePointId || '');

        if (transaction) {
          fetchReceiveShippedItem();
        }
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.connection-problem.get.transactions" />,
        });
      });
  };

  const handleSubmit = ({ itemBarcode }) => {
    fetchTransactions(itemBarcode);
  };

  const handleSessionEnd = () => {
    if (itemFormRef.current.reset) {
      itemFormRef.current.reset();
    }
    setScannedItems([]);
  };

  const renderChackedOutList = useCallback(() => {
    return (
      <ListCheckOutItems
        scannedItems={scannedItems}
        intl={intl}
        setShowChangeDueDateDialog={setShowChangeDueDateDialog}
        setLoanToChangeDueDate={setLoanToChangeDueDate}
      />
    );
  }, [setLoanToChangeDueDate, setShowChangeDueDateDialog, scannedItems]);

  return (
    <div className={css.container}>
      <Paneset static>
        <Pane
          defaultWidth={FILTER_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.check-out-borrowing-site.title.check-out-borrowing-site" />}
        >
          <NavigationMenu
            history={history}
            location={location}
            value={getCheckOutToBorrowingSiteUrl()}
          />
        </Pane>
        <Pane
          defaultWidth={FILL_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.check-out-borrowing-site.title.scan-items" />}
        >
          <ItemForm
            isOpenModal={isTransactionsLoaded && !transactionsData[0]?.totalRecords}
            isLoading={isLoading}
            intl={intl}
            formRef={itemFormRef}
            onSubmit={handleSubmit}
          />
          {isLoading &&
            <Icon icon={ICONS.SPINNER_ELLIPSIS} />
          }
          {renderChackedOutList()}
        </Pane>
      </Paneset>
      <PaneFooter
        innerClassName={css.footerContent}
        renderEnd={
          <Button
            marginBottom0
            buttonStyle="primary mega"
            disabled={isEmpty(scannedItems)}
            onClick={handleSessionEnd}
          >
            <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.button.end-session" />
          </Button>
        }
      />
      {
        loanToChangeDueDate && renderDialog()
      }
    </div>
  );
};

CheckOutBorrowingSite.manifest = Object.freeze({
  itemBarcode: { initialValue: '' },
  servicePointId: { initialValue: '' },
  transactionRecords: {
    type: 'okapi',
    path: 'inn-reach/transactions',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  checkoutBorroingSiteItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{itemBarcode}/check-out-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  loans: {
    type: 'okapi',
    path: 'circulation/loans',
    fetch: false,
    throwErrors: false,
    accumulate: true,
  },
});

CheckOutBorrowingSite.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.shape({
    itemBarcode: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    loans: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    transactionRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    checkoutBorroingSiteItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
  resources: PropTypes.shape({
    loans: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    transactionRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    checkoutBorroingSiteItem: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
  }),
};

export default stripesConnect(CheckOutBorrowingSite);
