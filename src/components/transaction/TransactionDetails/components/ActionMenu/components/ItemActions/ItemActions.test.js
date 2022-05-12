import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import ItemActions from './ItemActions';

const transactionMock = {
  state: 'ITEM_HOLD',
};

const renderItemActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
  onCheckOutBorrowingSite = jest.fn(),
  onFinalCheckInItem = jest.fn(),
  onRecallItem = jest.fn(),
  onTransferHold = jest.fn(),
  onCancelHold = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <ItemActions
      transaction={transaction}
      onToggle={onToggle}
      onCheckOutBorrowingSite={onCheckOutBorrowingSite}
      onFinalCheckInItem={onFinalCheckInItem}
      onRecallItem={onRecallItem}
      onTransferHold={onTransferHold}
      onCancelHold={onCancelHold}
    />,
    translationsProperties,
  );
};

describe('ItemActions component', () => {
  describe('cancel item hold', () => {
    it('should be enabled with ITEM_HOLD state', () => {
      renderItemActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_HOLD',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be enabled with TRANSFER state', () => {
      renderItemActions({
        transaction: {
          ...transactionMock,
          state: 'TRANSFER',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });
  });

  it('should render "check out" action', () => {
    const { getByText } = renderItemActions();

    expect(getByText('Check out to borrowing site')).toBeVisible();
  });

  it('should render "Transfer hold to another item" action', () => {
    const { getByText } = renderItemActions();

    expect(getByText('Transfer hold to another item')).toBeVisible();
  });

  it('should render "Recall item" action', () => {
    const { getByText } = renderItemActions();

    expect(getByText('Recall item')).toBeVisible();
  });

  it('should render "Cancel hold" action', () => {
    const { getByText } = renderItemActions();

    expect(getByText('Cancel hold')).toBeVisible();
  });

  it('should render "Final check-in" action', () => {
    const { getByText } = renderItemActions();

    expect(getByText('Final check-in')).toBeVisible();
  });
});
