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
  CALLOUT_ERROR_TYPE,
  getTransactionListUrl,
} from '../../../constants';
import {
  useCallout,
} from '../../../hooks';

const TransactionDetailContainer = ({
  resources: {
    transactionView: {
      records: transactionData,
      isPending: isTransactionPending,
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

  const showCallout = useCallout();
  const intl = useIntl();

  const [isOpenUnshippedItemModal, setIsOpenUnshippedItemModal] = useState(false);

  const triggerUnshippedItemModal = () => {
    setIsOpenUnshippedItemModal(prevModalState => !prevModalState);
  };

  const backToList = useCallback(() => {
    history.push({
      pathname: getTransactionListUrl(),
      search: location.search,
    });
  }, [history, location.search]);

  const fetchReceiveUnshippedItem = () => {
    mutator.receiveUnshippedItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.success.post.receive-unshipped-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.unshipped-item.callout.connection-problem.post.receive-unshipped-item" />,
        });
      });
  };

  const fetchReceiveItem = () => {
    mutator.receiveItem.POST({})
      .then(() => {
        onUpdateTransactionList();
        showCallout({
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.success.post.receive-item" />,
        });
      })
      .catch(() => {
        showCallout({
          type: CALLOUT_ERROR_TYPE,
          message: <FormattedMessage id="ui-inn-reach.receive-item.callout.connection-problem.post.receive-item" />,
        });
      });
  };

  const handleFetchReceiveUnshippedItem = ({ itemBarcode }) => {
    setIsOpenUnshippedItemModal(false);
    mutator.itemBarcode.replace(itemBarcode || '');
    fetchReceiveUnshippedItem();
  };

  useEffect(() => {
    mutator.servicePointId.replace(servicePointId || '');
    mutator.transactionId.replace(transaction.id || '');
  }, [servicePointId, transaction]);

  if (isTransactionPending) return <LoadingPane />;

  return (
    <TransactionDetail
      transaction={transaction}
      intl={intl}
      isOpenUnshippedItemModal={isOpenUnshippedItemModal}
      onClose={backToList}
      onTriggerUnshippedItemModal={triggerUnshippedItemModal}
      onFetchReceiveUnshippedItem={handleFetchReceiveUnshippedItem}
      onFetchReceiveItem={fetchReceiveItem}
    />
  );
};

TransactionDetailContainer.manifest = Object.freeze({
  servicePointId: { initialValue: '' },
  transactionId: { initialValue: '' },
  itemBarcode: { initialValue: '' },
  transactionView: {
    type: 'okapi',
    path: 'inn-reach/transactions/:{id}',
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
  receiveItem: {
    type: 'okapi',
    path: 'inn-reach/transactions/%{transactionId}/receive-item/%{servicePointId}',
    pk: '',
    clientGeneratePk: false,
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
    receiveUnshippedItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    receiveItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
  }),
};

export default stripesConnect(TransactionDetailContainer);
