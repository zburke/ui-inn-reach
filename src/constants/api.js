import {
  MODULE_ROUTE,
} from './base';

const TRANSACTIONS = 'transactions';

const VIEW = 'view';
const RECEIVE_SHIPPED_ITEM = 'receive-shipped-item';
const CHECK_OUT_TO_BORROWING_SITE = 'check-out-to-borrowing-site';

export const getTransactionListUrl = () => (`/${MODULE_ROUTE}/${TRANSACTIONS}`);
export const getTransactionViewUrl = (id) => (`/${MODULE_ROUTE}/${TRANSACTIONS}/${id}/${VIEW}`);
export const getReceiveShippedItemUrl = () => (`/${MODULE_ROUTE}/${RECEIVE_SHIPPED_ITEM}`);
export const getCheckOutToBorrowingSiteUrl = () => (`/${MODULE_ROUTE}/${CHECK_OUT_TO_BORROWING_SITE}`);
