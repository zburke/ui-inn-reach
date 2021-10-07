import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import user from '@testing-library/user-event';

import TransactionStatusFilter from './transaction-status-filter';

import {
  TRANSACTION_STATUSES,
} from '../../../../../constants';

const TRANSACTION_STRATUS_FILTER_LABEL = 'ui-inn-reach.transaction.filter.transactionStatus';

const renderTransactionStatusFilter = (props = {}) => (renderWithIntl(
  <TransactionStatusFilter
    id="transaction-filter-transactionStatus"
    name="transactionStatus"
    {...props}
  />,
));

describe('TransactionStatusFilter', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should display Transaction status filter', () => {
    renderTransactionStatusFilter({ onChange });
    expect(screen.getByText(TRANSACTION_STRATUS_FILTER_LABEL)).toBeDefined();
  });

  it('should call onChange', () => {
    renderTransactionStatusFilter({ onChange });
    user.click(screen.getByText(TRANSACTION_STATUSES.ITEM_HOLD));
    expect(onChange).toHaveBeenCalledWith({
      name: 'transactionStatus',
      values: [TRANSACTION_STATUSES.ITEM_HOLD],
    });
  });
});
