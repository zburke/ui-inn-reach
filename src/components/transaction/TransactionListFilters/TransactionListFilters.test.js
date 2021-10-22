import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import TransactionListFilters from './TransactionListFilters';
import { translationsProperties } from '../../../../test/jest/helpers';
import {
  MultiChoiceFilter,
} from '../../common';

const centralServers = {
  centralServers: [
    { id: '1', name: 'central server1' },
    { id: '2', name: 'central server2' },
  ]
};

const centralServerOptions = [
  { id: '1', label: 'central server1', value: 'central server1' },
  { id: '2', label: 'central server2', value: 'central server2' },
];

const transactionStatusOptions = [
  { label: 'ITEM_HOLD', value: 'ITEM_HOLD' },
  { label: 'PATRON_HOLD', value: 'PATRON_HOLD' },
  { label: 'LOCAL_HOLD', value: 'LOCAL_HOLD' },
  { label: 'TRANSFER', value: 'TRANSFER' },
  { label: 'ITEM_SHIPPED', value: 'ITEM_SHIPPED' },
  { label: 'ITEM_IN_TRANSIT', value: 'ITEM_IN_TRANSIT' },
  { label: 'ITEM_RECEIVED', value: 'ITEM_RECEIVED' },
  { label: 'RECEIVE_UNANNOUNCED', value: 'RECEIVE_UNANNOUNCED' },
  { label: 'RETURN_UNCIRCULATED', value: 'RETURN_UNCIRCULATED' },
  { label: 'LOCAL_CHECKOUT', value: 'LOCAL_CHECKOUT' },
  { label: 'CANCEL_REQUEST', value: 'CANCEL_REQUEST' },
  { label: 'BORROWING_SITE_CANCEL', value: 'BORROWING_SITE_CANCEL' },
  { label: 'BORROWER_RENEW', value: 'BORROWER_RENEW' },
  { label: 'CLAIMS_RETURNED', value: 'CLAIMS_RETURNED' },
  { label: 'RECALL', value: 'RECALL' },
  { label: 'FINAL_CHECKIN', value: 'FINAL_CHECKIN' }
];

const resourcesMock = {
  centralServerRecords: {
    records: [centralServers],
  },
};

const activeFiltersMock = {
  transactionType: [],
  transactionStatus: [],
  centralServer: [],
};

jest.mock('../../common', () => ({
  CheckboxFilter: jest.fn(() => <div>CheckboxFilter</div>),
  MultiChoiceFilter: jest.fn(() => <div>MultiChoiceFilter</div>),
}));

const renderTransactionListFilters = ({
  resources = resourcesMock,
  activeFilters = activeFiltersMock,
  applyFilters = jest.fn(),
} = {}) => (renderWithIntl(
  <TransactionListFilters
    resources={resources}
    activeFilters={activeFilters}
    applyFilters={applyFilters}
  />,
  translationsProperties,
));

describe('TransactionListFilters', () => {
  it('should show the correct number of CheckboxFilter components', () => {
    renderTransactionListFilters();
    expect(screen.getAllByText('CheckboxFilter')).toHaveLength(1);
  });

  it('should show the correct number of MultiChoiceFilter components', () => {
    renderTransactionListFilters();
    expect(screen.getAllByText('MultiChoiceFilter')).toHaveLength(2);
  });

  it('should pass the correct status options', () => {
    renderTransactionListFilters();
    expect(MultiChoiceFilter.mock.calls[0][0].dataOptions).toEqual(transactionStatusOptions);
  });

  it('should pass the correct central server options', () => {
    renderTransactionListFilters();
    expect(MultiChoiceFilter.mock.calls[1][0].dataOptions).toEqual(centralServerOptions);
  });
});
