import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import {
  countBy,
  chunk,
} from 'lodash';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  Modal,
  Paneset,
  Pane,
  Loading,
  MultiColumnList,
} from '@folio/stripes-components';

import {
  FILL_PANE_WIDTH,
} from '../../../../../constants';
import css from './TransferHoldModal.css';

const COLUMN_NAMES = [
  'barcode',
  'itemStatus',
  'requestQueue',
  'location',
  'materialType',
  'loanType',
];

const COLUMN_WIDTHS = {
  barcode: '16%',
  itemStatus: '16%',
  requestQueue: '16%',
  location: '16%',
  materialType: '16%',
  loanType: '16%',
};

const COLUMN_MAP = {
  barcode: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.barcode" />,
  itemStatus: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.item-status" />,
  requestQueue: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.request-queue" />,
  location: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.location" />,
  materialType: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.material-type" />,
  loanType: <FormattedMessage id="ui-inn-reach.transfer-hold.modal.column.loan-type" />,
};

const formatter = {
  itemStatus: item => item.status.name,
  location: item => item.effectiveLocation?.name || '',
  materialType: item => item.materialType.name,
  loanType: item => item.temporaryLoanType?.name || item.permanentLoanType?.name || '',
};

const MAX_HEIGHT = 500;

const TransferHoldModal = ({
  title,
  instanceId,
  skippedItemId,
  mutator,
  onClose,
  onRowClick,
}) => {
  const [areItemsBeingLoaded, setAreItemsBeingLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const contentData = useMemo(() => {
    return items.filter(item => skippedItemId !== item.id &&
      item.status.name === 'Available');
  }, [items, skippedItemId]);
  const itemsAmount = contentData.length;

  const fetchHoldings = () => {
    const query = `instanceId==${instanceId}`;

    mutator.holdings.reset();

    return mutator.holdings.GET({ params: { query } });
  };

  const fetchItems = (holdings) => {
    const query = holdings.map(h => `holdingsRecordId==${h.id}`).join(' or ');

    mutator.items.reset();

    return mutator.items.GET({ params: { query, limit: 1000 } });
  };

  const fetchRequests = async (itemsList) => {
    // Split the list of items into small chunks to create a short enough query string
    // that we can avoid an error (URI too long).
    const CHUNK_SIZE = 71;
    const chunkedItems = chunk(itemsList, CHUNK_SIZE);
    const requests = chunkedItems.map(itemChunk => {
      let query = itemChunk.map(i => `itemId==${i.id}`).join(' or ');

      query = `(${query}) and (status="Open")`;

      return mutator.requests.GET({ params: { query, limit: 1000 } });
    });

    return Promise.all(requests).then(res => res.flat());
  };

  const getItems = async () => {
    setAreItemsBeingLoaded(true);

    const holdings = await fetchHoldings();
    let itemsList = await fetchItems(holdings);
    const requests = await fetchRequests(itemsList);
    const requestMap = countBy(requests, 'itemId');

    itemsList = itemsList.map(item => {
      return {
        ...item,
        requestQueue: requestMap[item.id] || 0,
      };
    });

    setAreItemsBeingLoaded(false);
    setItems(itemsList);
  };

  useEffect(() => {
    if (instanceId) {
      getItems();
    }
  }, [instanceId]);

  return (
    <Modal
      open
      dismissible
      label={<FormattedMessage id="ui-inn-reach.transfer-hold.modal.label" />}
      contentClass={css.content}
      onClose={onClose}
    >
      <Paneset
        isRoot
        static
      >
        <Pane
          defaultWidth={FILL_PANE_WIDTH}
          paneTitle={<FormattedMessage
            id="ui-inn-reach.transfer-hold.modal.title"
            values={{ title }}
          />}
          paneSub={<FormattedMessage
            id="ui-inn-reach.transfer-hold.modal.result-count"
            values={{ count: itemsAmount }}
          />}
        >
          {areItemsBeingLoaded
            ? <Loading size="xlarge" />
            : <MultiColumnList
                interactive
                id="instance-items-list"
                ariaLabel={<FormattedMessage
                  id="ui-inn-reach.transfer-hold.modal.title"
                  values={{ title }}
                />}
                contentData={contentData}
                visibleColumns={COLUMN_NAMES}
                columnMapping={COLUMN_MAP}
                columnWidths={COLUMN_WIDTHS}
                formatter={formatter}
                maxHeight={MAX_HEIGHT}
                isEmptyMessage={<FormattedMessage id="ui-inn-reach.transfer-hold.modal.list-of-items.notFound" />}
                onRowClick={onRowClick}
            />
          }
        </Pane>
      </Paneset>
    </Modal>
  );
};

TransferHoldModal.manifest = Object.freeze({
  holdings: {
    type: 'okapi',
    records: 'holdingsRecords',
    path: 'holdings-storage/holdings',
    accumulate: true,
    fetch: false,
  },
  items: {
    type: 'okapi',
    records: 'items',
    path: 'inventory/items',
    accumulate: true,
    fetch: false,
  },
  requests: {
    type: 'okapi',
    path: 'circulation/requests',
    records: 'requests',
    accumulate: true,
    fetch: false,
  },
});

TransferHoldModal.propTypes = {
  instanceId: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    holdings: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }).isRequired,
    items: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }).isRequired,
    requests: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
  }).isRequired,
  skippedItemId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default stripesConnect(TransferHoldModal);
