import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetail from './TransactionDetail';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  ActionMenu: jest.fn(() => <div>ActionMenu</div>),
  TransactionSummary: jest.fn(() => <div>TransactionSummary</div>),
  PatronInformation: jest.fn(() => <div>PatronInformation</div>),
  ItemInformation: jest.fn(() => <div>ItemInformation</div>),
  ReceiveUnshippedItemModal: jest.fn(() => <div>ReceiveUnshippedItemModal</div>),
}));

const transactionMock = {
  type: 'ITEM',
  hold: {
    title: 'test title',
  },
};

const renderTransactionDetail = ({
  transaction = transactionMock,
  onClose,
  onCheckOutBorrowingSite,
  onCheckOutToPatron,
  onCheckOutToLocalPatron,
  onFinalCheckInItem,
  onReturnItem,
  onCancelHold,
  onTransferHold,
  onReceiveUnshippedItem,
  onReceiveItem,
  onRecallItem,
} = {}) => {
  return renderWithIntl(
    <TransactionDetail
      transaction={transaction}
      onClose={onClose}
      onRecallItem={onRecallItem}
      onReceiveUnshippedItem={onReceiveUnshippedItem}
      onReceiveItem={onReceiveItem}
      onCheckOutBorrowingSite={onCheckOutBorrowingSite}
      onCheckOutToLocalPatron={onCheckOutToLocalPatron}
      onCheckOutToPatron={onCheckOutToPatron}
      onFinalCheckInItem={onFinalCheckInItem}
      onReturnItem={onReturnItem}
      onCancelHold={onCancelHold}
      onTransferHold={onTransferHold}
    />,
    translationsProperties,
  );
};

describe('TransactionDetail', () => {
  const onClose = jest.fn();
  const onTransferHold = jest.fn();
  const onReceiveUnshippedItem = jest.fn();
  const onReceiveItem = jest.fn();
  const onCheckOutBorrowingSite = jest.fn();
  const onRecallItem = jest.fn();
  const onReturnItem = jest.fn();
  const onCheckOutToPatron = jest.fn();
  const onCheckOutToLocalPatron = jest.fn();
  const onCancelHold = jest.fn();
  const onFinalCheckInItem = jest.fn();

  const commonProps = {
    onClose,
    onReceiveUnshippedItem,
    onReceiveItem,
    onRecallItem,
    onCheckOutBorrowingSite,
    onCheckOutToPatron,
    onCheckOutToLocalPatron,
    onCancelHold,
    onFinalCheckInItem,
    onReturnItem,
    onTransferHold,
  };

  it('should be rendered', () => {
    const { container } = renderTransactionDetail(commonProps);

    expect(container).toBeVisible();
  });

  it('should display a title', () => {
    renderTransactionDetail(commonProps);
    expect(screen.getByText('test title')).toBeVisible();
  });

  describe('accordion set', () => {
    beforeEach(() => {
      renderTransactionDetail(commonProps);
    });

    it('should have TransactionSummary', () => {
      expect(screen.getByText('TransactionSummary')).toBeVisible();
    });

    it('should have PatronInformation', () => {
      expect(screen.getByText('PatronInformation')).toBeVisible();
    });

    it('should have ItemInformation', () => {
      expect(screen.getByText('ItemInformation')).toBeVisible();
    });
  });
});
