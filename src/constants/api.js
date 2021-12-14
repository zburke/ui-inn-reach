import {
  MODULE_ROUTE,
} from './base';

const TRANSACTIONS = 'transactions';

const VIEW = 'view';
const RECEIVE_SHIPPED_ITEM = 'receive-shipped-item';

export const getTransactionListUrl = () => (`/${MODULE_ROUTE}/${TRANSACTIONS}`);
export const getTransactionViewUrl = (id) => (`/${MODULE_ROUTE}/${TRANSACTIONS}/${id}/${VIEW}`);
export const getReceiveShippedItemUrl = () => (`/${MODULE_ROUTE}/${RECEIVE_SHIPPED_ITEM}`);
