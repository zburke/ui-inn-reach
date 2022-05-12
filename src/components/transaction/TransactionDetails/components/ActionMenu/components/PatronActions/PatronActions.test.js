import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import PatronActions from './PatronActions';

const transactionMock = {
  state: 'PATRON_HOLD',
  hold: {
    folioLoanId: '',
  },
};

const renderPatronActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
  onReceiveUnshippedItem = jest.fn(),
  onReceiveItem = jest.fn(),
  onReturnItem = jest.fn(),
  onCheckOutToPatron = jest.fn(),
  onCancelHold = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <PatronActions
      transaction={transaction}
      onToggle={onToggle}
      onReceiveUnshippedItem={onReceiveUnshippedItem}
      onReceiveItem={onReceiveItem}
      onReturnItem={onReturnItem}
      onCheckOutToPatron={onCheckOutToPatron}
      onCancelHold={onCancelHold}
    />,
    translationsProperties,
  );
};

describe('PatronActions component', () => {
  describe('check out to patron', () => {
    it('should be enabled with ITEM_RECEIVED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeEnabled();
    });

    it('should be enabled with RECEIVE_UNANNOUNCED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'RECEIVE_UNANNOUNCED',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeEnabled();
    });

    it('should be disabled with FOLIO loan', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
          hold: {
            folioLoanId: '184d6771-1d06-4af5-a854-9c2e26e38c15',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to patron' })).toBeDisabled();
    });
  });

  it('should render "Receive item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Receive item')).toBeVisible();
  });

  describe('Receive unshipped item', () => {
    it('should be visible', () => {
      const { getByText } = renderPatronActions();

      expect(getByText('Receive unshipped item')).toBeVisible();
    });

    it('should be enabled', () => {
      const { getByText } = renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
        },
      });

      expect(getByText('Receive unshipped item')).toBeEnabled();
    });

    it('should be enabled', () => {
      const { getByText } = renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'TRANSFER',
        },
      });

      expect(getByText('Receive unshipped item')).toBeEnabled();
    });
  });

  it('should render "Return item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Return item')).toBeVisible();
  });

  describe('Cancel patron hold', () => {
    it('should render "Cancel hold" action', () => {
      const { getByText } = renderPatronActions();

      expect(getByText('Cancel hold')).toBeVisible();
    });

    it('should be enabled with PATRON_HOLD state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'PATRON_HOLD',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be enabled with ITEM_RECEIVED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'ITEM_RECEIVED',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be enabled with RECEIVE_UNANNOUNCED state', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'RECEIVE_UNANNOUNCED',
          hold: {
            folioRequestId: '123',
          },
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeEnabled();
    });

    it('should be disabled with any other status', () => {
      renderPatronActions({
        transaction: {
          ...transactionMock,
          state: 'any other status',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Cancel hold' })).toBeDisabled();
    });
  });
});
