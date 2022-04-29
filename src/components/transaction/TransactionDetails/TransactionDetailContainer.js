import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingPane,
} from '@folio/stripes-components';

import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import TransactionDetail from './TransactionDetail';
import {
  AugmentedBarcodeModal,
  HoldModal,
  InTransitModal,
} from '../../common';
import {
  CALLOUT_ERROR_TYPE,
  getTransactionListUrl,
  TRANSACTION_FIELDS,
  HOLD_FIELDS,
} from '../../../constants';
import {
  useCallout,
  useReceiveItemModals,
} from '../../../hooks';
import {
  ReceiveUnshippedItemModal,
  TransferHoldModal,
} from './components';

const {
  HOLD,
} = TRANSACTION_FIELDS;

const {
  FOLIO_ITEM_BARCODE,
  TITLE,
  FOLIO_INSTANCE_ID,
  FOLIO_ITEM_ID,
} = HOLD_FIELDS;

const TransactionDetailContainer = ({
  resources: {
    transactionView: {
      records: transactionData,
      isPending: isTransactionPending,
    },
    staffSlips: {
      records: staffSlips,
    },
  },
  mutator,
  stripes,
  history,
  location,
  onUpdateTransactionList,
}) => {
  const transaction = transactionData[0] || {};

  const servicePointId = stripes?.user?.user?.curServicePoint?.id;

  const folioItemBarcode = transaction?.[HOLD]?.[FOLIO_ITEM_BARCODE];

  const showCallout = useCallout();
  const intl = useIntl();

  const [isOpenUnshippedItemModal, setIsOpenUnshippedItemModal] = useState(false);
  const [isOpenTransferHoldModal, setIsOpenTransferHoldModal] = useState(false);

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

  const triggerUnshippedItemModal = () => {
    setIsOpenUnshippedItemModal(prevModalState => !prevModalState);
  };

  const triggerTransferHoldModal = () => {
    setIsOpenTransferHoldModal(prev => !prev);
  };

  const backToList = useCallback(() => {
    history.push({
      pathname: getTransactionListUrl(),
      search: location.search,
    });
  }, [history, location.search]);

  const fetchReceiveUnshippedItem = () => {
    mutator.receiveUnshippedItem.POST({})
      .then(response => {
        setIsOpenUnshippedItemModal(false);
        onSetCheckinData(response);
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.success.post.receive-unshipped-item" />,
        });

        return response;
      })
      .then(onProcessModals)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.connection-problem.post.receive-unshipped-item" />,
        });
      });
  };
  const onCheckoutBorroingSite = () => {
    mutator.checkoutBorroingSiteItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.success.post.check-out-borrowing-site" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.callout.connection-problem.post.check-out-borrowing-site" />,
        });
      });
  };

  const onReturnPatronHoldItem = () => {
    mutator.returnPatronHoldItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.return-patron-hold-item.callout.success.post.return-patron-hold-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.return-patron-hold-item.callout.connection-problem.post.return-patron-hold-item" />,
        });
      });
  };

  const fetchCheckOutToPatron = () => {
    mutator.checkOutToPatron.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.check-out-to-patron.callout.success.post.check-out-to-patron" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-to-patron.callout.connection-problem.post.check-out-to-patron" />,
        });
      });
  };

  const fetchCheckoutToLocalPatron = () => {
    mutator.checkOutToLocalPatron.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.check-out-to-local-patron.callout.success.post.check-out-to-local-patron" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.check-out-to-local-patron.callout.connection-problem.post.check-out-to-local-patron" />,
        });
      });
  };

  const fetchRecallItem = () => {
    mutator.recallItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.recall-item.callout.success.post.recall-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.recall-item.callout.connection-problem.post.recall-item" />,
        });
      });
  };

  const fetchReceiveItem = () => {
    mutator.receiveItem.POST({})
      .then(response => {
        onSetCheckinData(response);
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.success.post.receive-item" />,
        });

        return response;
      })
      .then(onProcessModals)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.connection-problem.post.receive-item" />,
        });
      });
  };

  const fetchCancelPatronHold = (response) => {
    mutator.cancelPatronHold.POST({
      cancellationReasonId: response.id,
      cancellationAdditionalInformation: 'Cancelled by staff',
    })
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.cancel-patron-hold.callout.success.post.cancel-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-patron-hold.callout.connection-problem.post.cancel-hold" />,
        });
      });
  };

  const fetchCancelItemHold = (response) => {
    mutator.cancelItemHold.POST({
      cancellationReasonId: response.id,
      cancellationAdditionalInformation: 'Owning site cancels request',
    })
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.cancel-item-hold.callout.success.post.cancel-item-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-item-hold.callout.connection-problem.post.cancel-item-hold" />,
        });
      });
  };
  const fetchFinalCheckInItem = () => {
    mutator.finalCheckInItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.final-check-in-item-hold.callout.success.post.final-check-in-item-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.final-check-in-item-hold.connection-problem.post.final-check-in-item-hold" />,
        });
      });
  };

  const fetchCancelLocalHold = (response) => {
    mutator.cancelLocalHold.POST({
      cancellationReasonId: response.id,
      cancellationAdditionalInformation: 'Owning site cancels request',
    })
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.cancel-local-hold.callout.success.post.cancel-local-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-local-hold.callout.connection-problem.post.cancel-local-hold" />,
        });
      });
  };

  const handleCancelPatronHold = () => {
    mutator.cancellationReasons.GET()
      .then(response => {
        if (response?.length === 1) {
          return response[0];
        }
        throw new Error();
      })
      .then(fetchCancelPatronHold)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-item-hold.callout.connection-problem.get.cancellation-reasons" />,
        });
      });
  };

  const handleCancelItemHold = () => {
    mutator.cancellationReasons.GET()
      .then(response => {
        if (response?.length === 1) {
          return response[0];
        }
        throw new Error();
      })
      .then(fetchCancelItemHold)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-item-hold.callout.connection-problem.post.cancel-item-hold" />,
        });
      });
  };

  const handleCancelLocalHold = () => {
    mutator.cancellationReasons.GET()
      .then(response => {
        if (response?.length === 1) {
          return response[0];
        }
        throw new Error();
      })
      .then(fetchCancelLocalHold)
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.cancel-local-hold.callout.connection-problem.post.cancel-local-hold" />,
        });
      });
  };

  const handleFetchReceiveUnshippedItem = ({ itemBarcode }) => {
    mutator.itemBarcode.replace(itemBarcode || '');
    fetchReceiveUnshippedItem();
  };

  const fetchTransferHold = () => {
    mutator.transferItem.POST({})
      .then(() => {
        triggerTransferHoldModal();
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.transfer-hold.callout.success.post.transfer-hold" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.transfer-hold.callout.connection-problem.post.transfer-hold" />,
        });
      });
  };

  const handleTransferHold = (_, selectedItem) => {
    mutator.itemId.replace(selectedItem.id);
    fetchTransferHold();
  };

  const renderReceiveUnshippedItemModal = () => (
    <ReceiveUnshippedItemModal
      intl={intl}
      onSubmit={handleFetchReceiveUnshippedItem}
      onTriggerModal={triggerUnshippedItemModal}
    />
  );

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
    />
  );

  const renderTransferHoldModal = () => (
    <TransferHoldModal
      title={transaction?.[HOLD]?.[TITLE]}
      instanceId={transaction?.[HOLD]?.[FOLIO_INSTANCE_ID]}
      skippedItemId={transaction?.[HOLD]?.[FOLIO_ITEM_ID]}
      onClose={triggerTransferHoldModal}
      onRowClick={handleTransferHold}
    />
  );

  useEffect(() => {
    mutator.servicePointId.replace(servicePointId || '');
    mutator.transactionId.replace(transaction.id || '');
    mutator.itemBarcode.replace(folioItemBarcode || '');
  }, [servicePointId, transaction]);

  if (isTransactionPending) return <LoadingPane />;

  return (
    <>
      <TransactionDetail
        transaction={transaction}
        onClose={backToList}
        onCheckOutBorrowingSite={onCheckoutBorroingSite}
        onCheckOutToLocalPatron={fetchCheckoutToLocalPatron}
        onCheckOutToPatron={fetchCheckOutToPatron}
        onReturnItem={onReturnPatronHoldItem}
        onCancelPatronHold={handleCancelPatronHold}
        onCancelItemHold={handleCancelItemHold}
        onFinalCheckInItem={fetchFinalCheckInItem}
        onCancelLocalHold={handleCancelLocalHold}
        onRecallItem={fetchRecallItem}
        onReceiveUnshippedItem={triggerUnshippedItemModal}
        onReceiveItem={fetchReceiveItem}
        onTransferHold={triggerTransferHoldModal}
      />
      {isOpenUnshippedItemModal && renderReceiveUnshippedItemModal()}
      {isOpenTransferHoldModal && renderTransferHoldModal()}
      {isOpenAugmentedBarcodeModal && renderAugmentedBarcodeModal()}
      {isOpenItemHoldModal && renderHoldModal()}
      {isOpenInTransitModal && renderTransitModal()}
    </>
  );
};

TransactionDetailContainer.manifest = Object.freeze({
  servicePointId: { initialValue: '' },
  transactionId: { initialValue: '' },
  itemBarcode: { initialValue: '' },
  itemId: { initialValue: '' },
  transactionView: {
    type: 'okapi',
    path: 'inn-reach/transactions/:{id}',
    throwErrors: false,
  },
  finalCheckInItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/itemhold/finalcheckin/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  receiveUnshippedItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-unshipped-item/%{servicePointId}/%{itemBarcode}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  recallItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/itemhold/recall',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  receiveItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
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
  },
  returnPatronHoldItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/return-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  checkOutToPatron: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/check-out-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  checkOutToLocalPatron: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/localhold/check-out-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  staffSlips: {
    type: 'okapi',
    records: 'staffSlips',
    path: 'staff-slips-storage/staff-slips?limit=1000',
    throwErrors: false,
  },
  cancellationReasons: {
    type: 'okapi',
    records: 'cancellationReasons',
    path: 'cancellation-reason-storage/cancellation-reasons?query=name=="Other"&limit=100',
    fetch: false,
    accumulate: true,
    throwErrors: false,
  },
  cancelPatronHold: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/patronhold/cancel',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  transferItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/itemhold/transfer-item/%{itemId}',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  cancelItemHold: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/itemhold/cancel',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
  },
  cancelLocalHold: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/localhold/cancel',
    pk: '',
    clientGeneratePk: false,
    fetch: false,
    accumulate: true,
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
    staffSlips: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  stripes: stripesShape.isRequired,
  onUpdateTransactionList: PropTypes.func.isRequired,
  mutator: PropTypes.shape({
    servicePointId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    transactionId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    itemBarcode: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    finalCheckInItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    itemId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    receiveUnshippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    recallItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    receiveItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    returnPatronHoldItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    checkoutBorroingSiteItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    checkOutToPatron: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    checkOutToLocalPatron: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancelPatronHold: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancelItemHold: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancelLocalHold: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    cancellationReasons: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    transferItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(TransactionDetailContainer);
