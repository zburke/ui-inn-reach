import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import LocalActions from './LocalActions';

const transactionMock = {
  state: 'LOCAL_HOLD',
};

const renderLocalActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
  onCancelHold = jest.fn(),
  onCheckOutToLocalPatron = jest.fn(),
  onTransferHold = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <LocalActions
      transaction={transaction}
      onToggle={onToggle}
      onCancelHold={onCancelHold}
      onCheckOutToLocalPatron={onCheckOutToLocalPatron}
      onTransferHold={onTransferHold}
    />,
    translationsProperties,
  );
};

describe('LocalActions component', () => {
  it('should render "check out" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Check out to local patron')).toBeVisible();
  });

  describe('"Transfer hold to another item" action', () => {
    it('should be enabled with LOCAL_HOLD state', () => {
      renderLocalActions();
      expect(screen.getByRole('button', { name: 'Icon Transfer hold to another item' })).toBeEnabled();
    });

    it('should be enabled with TRANSFER state', () => {
      renderLocalActions({
        transaction: {
          state: 'TRANSFER',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Transfer hold to another item' })).toBeEnabled();
    });
  });

  it('should render "Cancel hold" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Cancel hold')).toBeVisible();
  });

  describe('check out to local patron action', () => {
    it('should rbe enabled with LOCAL_HOLD', () => {
      renderLocalActions({
        transaction: {
          ...transactionMock,
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to local patron' })).toBeEnabled();
    });
    it('should rbe enabled with LOCAL_HOLD', () => {
      renderLocalActions({
        transaction: {
          ...transactionMock,
          state: 'TRANSFER',
        },
      });
      expect(screen.getByRole('button', { name: 'Icon Check out to local patron' })).toBeEnabled();
    });
  });
});
