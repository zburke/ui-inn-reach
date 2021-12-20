import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetail from './TransactionDetail';

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
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
  isOpenUnshippedItemModal = false,
  onTriggerUnshippedItemModal,
  onFetchReceiveUnshippedItem,
  onClose,
} = {}) => {
  return renderWithIntl(
    <TransactionDetail
      transaction={transaction}
      intl={{}}
      isOpenUnshippedItemModal={isOpenUnshippedItemModal}
      onClose={onClose}
      onTriggerUnshippedItemModal={onTriggerUnshippedItemModal}
      onFetchReceiveUnshippedItem={onFetchReceiveUnshippedItem}
    />,
    translationsProperties,
  );
};

describe('TransactionDetail', () => {
  const onClose = jest.fn();
  const onTriggerUnshippedItemModal = jest.fn();
  const onFetchReceiveUnshippedItem = jest.fn();

  const commonProps = {
    onClose,
    onTriggerUnshippedItemModal,
    onFetchReceiveUnshippedItem,
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

  it('should display a modal for "receive unshipped item"', () => {
    renderTransactionDetail({
      ...commonProps,
      isOpenUnshippedItemModal: true,
    });
    expect(screen.getByText('ReceiveUnshippedItemModal')).toBeVisible();
  });
});
