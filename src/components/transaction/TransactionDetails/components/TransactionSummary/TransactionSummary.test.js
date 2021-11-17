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
  hold: {
    patronName: 'Brown, Adam',
    pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
    transactionTime: 1636614805,
    folioRequestId: '78ad79d9-afbb-462a-afb7-a31eb331a371',
    folioLoanId: '829f0791-9c2a-42d5-a2eb-6c3b4a38c1d8',
    folioPatronId: 'b4cee18d-f862-4ef1-95a5-879fdd619603',
  },
  metadata: {
    createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
    createdByUsername: 'diku_admin',
    createdDate: '2021-10-19T07:12:50.858+00:00',
  },
  state: 'ITEM_HOLD',
  trackingId: '12348',
  type: 'ITEM',
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
    expect(screen.getByText('11/11/2021, 7:13 AM')).toBeVisible();
  });

  it('should show the transaction tracking id', () => {
    expect(screen.getByText('12348')).toBeVisible();
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
    expect(screen.getByText('Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1')).toBeVisible();
  });

  it('should show the transaction request', () => {
    expect(screen.getByText('Request detail')).toBeVisible();
  });

  it('should show the "Loan detail" link', () => {
    expect(screen.getByText('Loan detail')).toBeVisible();
  });
});
