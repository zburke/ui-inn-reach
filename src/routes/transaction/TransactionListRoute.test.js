import React from 'react';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import TransactionListRoute from './TransactionListRoute';
import { translationsProperties } from '../../../test/jest/helpers';
import TransactionList from '../../components/transaction/TransactionList';

jest.mock('../../components/transaction/TransactionList', () => {
  return jest.fn(() => <div>TransactionList</div>);
});

const transactionsMock = {
  transactions: [
    { state: 'ITEM_HOLD', type: 'ITEM' },
  ],
  totalRecords: 1,
};

const mutatorMock = {
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
  },
};

const path = '/innreach/transactions?centralItemType=200&centralServerCode=demo1&itemAgencyCode=5east&patronAgencyCode=5dlpl&centralPatronType=201&query=secrets&state=ITEM_HOLD&type=PATRON&type=ITEM';
const params = {
  'centralItemType': '200',
  'centralServerCode': 'demo1',
  'itemAgencyCode': '5east',
  'limit': 100,
  'offset': 0,
  'patronAgencyCode': '5dlpl',
  'centralPatronType': '201',
  'query': 'secrets',
  'sortBy': 'transactionTime',
  'sortOrder': 'asc',
  'state': 'ITEM_HOLD',
  'type': ['PATRON', 'ITEM'],
};

const renderTransactionListRoute = ({
  history = createMemoryHistory(),
  mutator = mutatorMock,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <TransactionListRoute
        mutator={mutator}
        location={{ pathname: '/' }}
        history={history}
      />
    </Router>,
    translationsProperties,
  );
};

describe('TransactionListRoute', () => {
  it('should render TransactionList', async () => {
    await act(async () => { renderTransactionListRoute(); });
    expect(screen.getByText('TransactionList')).toBeVisible();
  });

  it('should not pass any transactions ', async () => {
    await act(async () => { renderTransactionListRoute(); });
    expect(TransactionList.mock.calls[0][0].transactions).toEqual([]);
  });

  describe('when we select filters', () => {
    let history;

    beforeEach(async () => {
      history = createMemoryHistory();
      history.push(path);
      await act(async () => { renderTransactionListRoute({ history }); });
    });

    it('should pass the correct transactions list', () => {
      expect(TransactionList.mock.calls[12][0].transactions).toEqual(transactionsMock.transactions);
    });

    it('should call a GET request with the correct path', () => {
      expect(mutatorMock.transactionRecords.GET).toHaveBeenCalledWith({ params });
    });

    it('should path the correct count of the transactions', async () => {
      expect(TransactionList.mock.calls[12][0].transactionsCount).toEqual(transactionsMock.totalRecords);
    });

    it('should trigger a GET request with the correct offset number', async () => {
      await act(async () => { TransactionList.mock.calls[27][0].onNeedMoreData(); });
      expect(mutatorMock.transactionRecords.GET).toHaveBeenLastCalledWith({
        params: {
          ...params,
          offset: 100,
        },
      });
    });
  });
});
