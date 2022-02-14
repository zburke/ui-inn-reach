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
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  CALLOUT_ERROR_TYPE,
  DESC_ORDER,
  METADATA_FIELDS,
  SORT_ORDER_PARAMETER,
  SORT_PARAMETER,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '../../constants';
import {
  AugmentedBarcodeModal,
  HoldModal,
  InTransitModal,
} from '../common';
import {
  CheckIn,
  ConfirmStatusModal,
} from './components';
import {
  useCallout,
  useReceiveItemModals,
} from '../../hooks';

const {
  UPDATED_DATE,
} = METADATA_FIELDS;

const {
  PATRON,
} = TRANSACTION_TYPES;

const {
  TYPE,
  STATUS,
  ITEM_BARCODE,
} = TRANSACTION_FIELDS;

const {
  ITEM_SHIPPED,
} = TRANSACTION_STATUSES;

const ReceiveShippedItems = ({
  history,
  location,
  resources: {
    transactionRecords: {
      isPending: isTransactionsPending,
    },
    receiveShippedItem: {
      isPending: isReceiveShippedItemPending,
    },
    staffSlips: {
      records: staffSlips,
    },
  },
  mutator,
  stripes,
}) => {
  const [scannedItems, setScannedItems] = useState([]);
  const [noTransaction, setNoTransaction] = useState(false);

  const showCallout = useCallout();
  const intl = useIntl();
  const itemFormRef = useRef({});
  const barcodeRef = useRef();
  const isLoading = isTransactionsPending || isReceiveShippedItemPending;

  const focusBarcodeField = () => {
    barcodeRef.current.focus();
  };

  const {
    isOpenAugmentedBarcodeModal,
    isOpenItemHoldModal,
    isOpenInTransitModal,
    checkinData,
    onSetCheckinData,
    onGetSlipTmpl,
    onProcessModals,
    onSetAugmentedBarcodeModalAfterClose,
    onCloseModal,
  } = useReceiveItemModals(staffSlips);

  const resetData = () => {
    if (itemFormRef.current.reset) {
      itemFormRef.current.reset();
    }
    setScannedItems([]);
  };

  const closeNoTransactionModal = () => {
    setNoTransaction(false);
  };

  const addScannedItem = (checkinResp) => {
    setScannedItems(prev => [checkinResp, ...prev]);

    return checkinResp;
  };

  const fetchReceiveShippedItem = () => {
    mutator.receiveShippedItem.POST({})
      .then(checkinResp => {
        onSetCheckinData(checkinResp);

        return checkinResp;
      })
      .then(onProcessModals)
      .then(addScannedItem)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.put.receive-shipped-item" />,
        });
      });
  };

  const fetchTransactions = ({ itemBarcode }) => {
    mutator.transactionRecords.reset();
    mutator.transactionRecords.GET({
      params: {
        [ITEM_BARCODE]: itemBarcode.trim(),
        [TYPE]: PATRON,
        [STATUS]: ITEM_SHIPPED,
        [SORT_PARAMETER]: UPDATED_DATE,
        [SORT_ORDER_PARAMETER]: DESC_ORDER,
      },
    })
      .then(({ transactions: [transaction] }) => {
        const servicePointId = stripes?.user?.user?.curServicePoint?.id;

        mutator.transactionId.replace(transaction?.id || '');
        mutator.servicePointId.replace(servicePointId || '');

        if (transaction) {
          fetchReceiveShippedItem();
        } else {
          setNoTransaction(true);
        }
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.shipped-items.callout.connection-problem.get.transactions" />,
        });
      });
  };

  const renderNoTransactionModal = () => {
    return (
      <ConfirmStatusModal
        label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.no-transaction.heading" />}
        message={[<FormattedMessage id="ui-inn-reach.shipped-items.modal.message.no-transaction" />]}
        onClose={closeNoTransactionModal}
        onAfterPrint={focusBarcodeField}
      />
    );
  };

  const renderAugmentedBarcodeModal = () => (
    <AugmentedBarcodeModal
      {...checkinData}
      intl={intl}
      onClose={onCloseModal}
      onClickClose={onSetAugmentedBarcodeModalAfterClose}
      onBeforePrint={onSetAugmentedBarcodeModalAfterClose}
    />
  );

  const renderHoldModal = () => (
    <HoldModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onFocusBarcodeField={focusBarcodeField}
      onClose={onCloseModal}
    />
  );

  const renderTransitModal = () => (
    <InTransitModal
      stripes={stripes}
      checkinData={checkinData}
      intl={intl}
      onGetSlipTmpl={onGetSlipTmpl}
      onClose={onCloseModal}
      onFocusBarcodeField={focusBarcodeField}
    />
  );

  return (
    <>
      <CheckIn
        history={history}
        location={location}
        stripes={stripes}
        isLoading={isLoading}
        intl={intl}
        itemFormRef={itemFormRef}
        barcodeRef={barcodeRef}
        scannedItems={scannedItems}
        onGetSlipTemplate={onGetSlipTmpl}
        onSessionEnd={resetData}
        onSubmit={fetchTransactions}
      />
      {noTransaction && renderNoTransactionModal()}
      {isOpenAugmentedBarcodeModal && renderAugmentedBarcodeModal()}
      {isOpenItemHoldModal && renderHoldModal()}
      {isOpenInTransitModal && renderTransitModal()}
    </>
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
  staffSlips: {
    type: 'okapi',
    records: 'staffSlips',
    path: 'staff-slips-storage/staff-slips?limit=1000',
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
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    receiveShippedItem: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
    }).isRequired,
    staffSlips: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }),
};

export default stripesConnect(ReceiveShippedItems);
