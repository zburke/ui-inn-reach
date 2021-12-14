import {
  useState,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  isEmpty,
  orderBy,
} from 'lodash';

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

import {
  CALLOUT_ERROR_TYPE,
  FILL_PANE_WIDTH,
  getReceiveShippedItemUrl,
  ICONS,
  METADATA,
  METADATA_FIELDS,
  RECEIVED_ITEM_FIELDS,
  SEARCH_PARAMETER,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../../constants';
import {
  ItemForm,
  ListCheckInItems,
} from './components';
import {
  NavigationMenu,
} from '../common';
import {
  useCallout,
} from '../../hooks';
import css from './ReceiveShippedItem.css';

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  PATRON,
} = TRANSACTION_TYPES;

const {
  TYPE,
  STATUS,
} = TRANSACTION_FIELDS;

const {
  ITEM_SHIPPED,
} = TRANSACTION_STATUSES;

const {
  TRANSACTION,
  FOLIO_CHECK_IN,
  HOLD,
  PICK_UP_LOCATION,
} = RECEIVED_ITEM_FIELDS;

const ReceiveShippedItems = ({
  history,
  location,
  resources: {
    transactionRecords: {
      records: transactionsData,
      isPending: isTransactionsPending,
    },
    receiveShippedItem: {
      isPending: isReceiveShippedItemPending,
    },
  },
  mutator,
  stripes,
}) => {
  const showCallout = useCallout();
  const intl = useIntl();
  const itemFormRef = useRef({});
  const isLoading = isTransactionsPending || isReceiveShippedItemPending;

  const [scannedItems, setScannedItems] = useState([]);
  const [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);

  const addScannedItem = (checkinResp) => {
    const {
      [TRANSACTION]: {
        [HOLD]: {
          [PICK_UP_LOCATION]: pickupLocation,
        },
      },
      [FOLIO_CHECK_IN]: folioCheckIn,
    } = checkinResp;

    const scannedItem = {
      ...folioCheckIn,
      [PICK_UP_LOCATION]: pickupLocation,
    };

    setScannedItems(prev => [scannedItem, ...prev]);
  };

  const fetchReceiveShippedItem = () => {
    mutator.receiveShippedItem.POST({})
      .then(addScannedItem)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.put.receive-shipped-item" />,
        });
      });
  };

  const fetchTransactions = (itemBarcode) => {
    setIsTransactionsLoaded(false);
    mutator.transactionRecords.reset();
    mutator.transactionRecords.GET({
      params: {
        [SEARCH_PARAMETER]: itemBarcode.trim(),
        [TYPE]: PATRON,
        [STATUS]: ITEM_SHIPPED,
      },
    })
      .then(({ transactions }) => {
        const transaction = orderBy(transactions, [`${METADATA}.${UPDATED_DATE}`], ['desc'])[0];
        const servicePointId = stripes?.user?.user?.curServicePoint?.id;

        setIsTransactionsLoaded(true);
        mutator.transactionId.replace(transaction?.id || '');
        mutator.servicePointId.replace(servicePointId || '');

        if (transaction) {
          fetchReceiveShippedItem();
        }
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.get.transactions" />,
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

  return (
    <div className={css.container}>
      <Paneset static>
        <Pane
          defaultWidth="20%"
          paneTitle={<FormattedMessage id="ui-inn-reach.shipped-items.title.receive-shipped-items" />}
        >
          <NavigationMenu
            history={history}
            location={location}
            value={getReceiveShippedItemUrl()}
          />
        </Pane>
        <Pane
          defaultWidth={FILL_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-inn-reach.shipped-items.title.scan-items" />}
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
          <ListCheckInItems
            scannedItems={scannedItems}
            intl={intl}
          />
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
            <FormattedMessage id="ui-inn-reach.shipped-items.button.end-session" />
          </Button>
        }
      />
    </div>
  );
};

ReceiveShippedItems.manifest = Object.freeze({
  transactionId: { initialValue: '' },
  servicePointId: { initialValue: '' },
  transactionRecords: {
    type: 'okapi',
    path: 'inn-reach/transactions',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  receiveShippedItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
});

ReceiveShippedItems.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.shape({
    transactionId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    transactionRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    receiveShippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
  resources: PropTypes.shape({
    transactionRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    receiveShippedItem: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
  }),
};

export default stripesConnect(ReceiveShippedItems);
