import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import TransactionSummary from './TransactionSummary';

jest.mock('@folio/stripes-smart-components', () => ({
  ViewMetaData: jest.fn(() => <div>ViewMetaData</div>),
}));

const transactionMock = {
  id: '1',
  title: 'title',
  transactionTime: '2021-09-29T07:24:38.607+00:00',
  trackingId: '12345',
  transactionType: 'ITEM',
  status: 'ITEM_HOLD',
  patronName: 'Brown, Adam',
  pickupLocation: 'Circ 1',
  request: 'Request detail',
  loan: 'Loan detail',
};

const history = createMemoryHistory();

const renderTransactionSummary = ({
  transaction = transactionMock,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <TransactionSummary
        transaction={transaction}
      />
    </Router>,
    translationsProperties,
  );
};

describe('TransactionSummary', () => {
  beforeEach(() => {
    renderTransactionSummary();
  });

  it('should show the transaction time', () => {
    expect(screen.getByText('9/29/2021, 7:24 AM')).toBeVisible();
  });

  it('should show the transaction tracking id', () => {
    expect(screen.getByText('12345')).toBeVisible();
  });

  it('should show the transaction type', () => {
    expect(screen.getByText('Item')).toBeVisible();
  });

  it('should show the transaction status', () => {
    expect(screen.getByText('ITEM_HOLD')).toBeVisible();
  });

  it('should show the transaction patron name', () => {
    expect(screen.getByText('Brown, Adam')).toBeVisible();
  });

  it('should show the transaction pickup location', () => {
    expect(screen.getByText('Circ 1')).toBeVisible();
  });

  it('should show the transaction request', () => {
    expect(screen.getByText('Request detail')).toBeVisible();
  });

  it('should show the transaction type', () => {
    expect(screen.getByText('Loan detail')).toBeVisible();
  });
});
