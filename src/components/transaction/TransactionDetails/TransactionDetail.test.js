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
  isOpenItemHoldModal = false,
  isOpenInTransitModal = false,
  isOpenAugmentedBarcodeModal = false,
  isOpenUnshippedItemModal = false,
  onCheckoutBorrowingSite,
  onCheckOutToPatron,
  onReturnItem,
  onCancelPatronHold,
  onCancelItemHold,
  onTriggerUnshippedItemModal,
  onFetchReceiveUnshippedItem,
  onFetchReceiveItem,
  onClose,
  onReset,
  onRenderAugmentedBarcodeModal,
  onRenderHoldModal,
  onRenderTransitModal,
} = {}) => {
  return renderWithIntl(
    <TransactionDetail
      transaction={transaction}
      isOpenItemHoldModal={isOpenItemHoldModal}
      isOpenInTransitModal={isOpenInTransitModal}
      isOpenAugmentedBarcodeModal={isOpenAugmentedBarcodeModal}
      isOpenUnshippedItemModal={isOpenUnshippedItemModal}
      intl={{}}
      onClose={onClose}
      onTriggerUnshippedItemModal={onTriggerUnshippedItemModal}
      onFetchReceiveUnshippedItem={onFetchReceiveUnshippedItem}
      onFetchReceiveItem={onFetchReceiveItem}
      onCheckoutBorrowingSite={onCheckoutBorrowingSite}
      onCheckOutToPatron={onCheckOutToPatron}
      onReturnItem={onReturnItem}
      onCancelPatronHold={onCancelPatronHold}
      onCancelItemHold={onCancelItemHold}
      onReset={onReset}
      onRenderAugmentedBarcodeModal={onRenderAugmentedBarcodeModal}
      onRenderHoldModal={onRenderHoldModal}
      onRenderTransitModal={onRenderTransitModal}
    />,
    translationsProperties,
  );
};

describe('TransactionDetail', () => {
  const onClose = jest.fn();
  const onTriggerUnshippedItemModal = jest.fn();
  const onFetchReceiveUnshippedItem = jest.fn();
  const onFetchReceiveItem = jest.fn();
  const onCheckoutBorrowingSite = jest.fn();
  const onReturnItem = jest.fn();
  const onCheckOutToPatron = jest.fn();
  const onCancelPatronHold = jest.fn();
  const onCancelItemHold = jest.fn();
  const onReset = jest.fn();
  const onRenderAugmentedBarcodeModal = jest.fn(() => <div>AugmentedBarcodeModal</div>);
  const onRenderHoldModal = jest.fn(() => <div>HoldModal</div>);
  const onRenderTransitModal = jest.fn(() => <div>TransitModal</div>);

  const commonProps = {
    onClose,
    onTriggerUnshippedItemModal,
    onFetchReceiveUnshippedItem,
    onFetchReceiveItem,
    onCheckoutBorrowingSite,
    onCheckOutToPatron,
    onCancelPatronHold,
    onCancelItemHold,
    onReset,
    onReturnItem,
    onRenderAugmentedBarcodeModal,
    onRenderHoldModal,
    onRenderTransitModal,
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

  it('should display the "Augmented Barcode" modal', () => {
    renderTransactionDetail({
      ...commonProps,
      isOpenAugmentedBarcodeModal: true,
    });
    expect(screen.getByText('AugmentedBarcodeModal')).toBeVisible();
  });

  it('should display the "Hold" modal', () => {
    renderTransactionDetail({
      ...commonProps,
      isOpenItemHoldModal: true,
    });
    expect(screen.getByText('HoldModal')).toBeVisible();
  });

  it('should display the "Transit" modal', () => {
    renderTransactionDetail({
      ...commonProps,
      isOpenInTransitModal: true,
    });
    expect(screen.getByText('TransitModal')).toBeVisible();
  });
});
