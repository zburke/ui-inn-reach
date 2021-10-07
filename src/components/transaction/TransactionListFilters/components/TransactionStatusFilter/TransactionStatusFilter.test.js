import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import user from '@testing-library/user-event';

import TransactionStatusFilter from './TransactionStatusFilter';
import { translationsProperties } from '../../../../../../test/jest/helpers';

const renderTransactionStatusFilter = ({
  activeFilters = [],
  onChange,
}) => (renderWithIntl(
  <TransactionStatusFilter
    id="transaction-filter-transactionStatus"
    name="transactionStatus"
    activeFilters={activeFilters}
    onChange={onChange}
  />,
  translationsProperties,
));

describe('TransactionStatusFilter', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should display Transaction status filter', () => {
    renderTransactionStatusFilter({ onChange });
    expect(screen.getByText('Transaction status')).toBeDefined();
  });

  it('should call onChange', () => {
    renderTransactionStatusFilter({ onChange });
    user.click(screen.getByText('ITEM_HOLD'));
    expect(onChange).toHaveBeenCalledWith({
      name: 'transactionStatus',
      values: ['ITEM_HOLD'],
    });
  });
});
