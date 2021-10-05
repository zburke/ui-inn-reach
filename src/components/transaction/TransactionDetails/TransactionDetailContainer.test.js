import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { cloneDeep } from 'lodash';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetailContainer from './TransactionDetailContainer';
import TransactionDetail from './TransactionDetail';

jest.mock('./TransactionDetail', () => {
  return jest.fn(() => <div>TransactionDetail</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

const transactionMock = {
  id: '1',
  title: 'title',
  transactionTime: '2021-09-29T07:24:38.607+00:00',
  trackingId: '12345',
  transactionType: 'Item',
  status: 'ITEM_HOLD',
  patronName: 'Brown, Adam',
  pickupLocation: 'Circ 1',
  request: 'Request detail',
  loan: 'Loan detail',
  patronId: '111222333',
  patronType: 'Jon (123)',
  patronAgency: 'Jane (234)',
  itemId: '4324534',
  itemTitle: 'Canadian labour relations boards reports.',
  centralItemType: 'Material type name (INN-Reach code)',
  author: '-',
  callNo: 'QP1.E61 v.78 c.1',
  itemAgency: 'fl1g1 (Description)',
  metadata: {
    createdDate: '2021-09-29T07:24:38.607+00:00',
    updatedDate: '2021-09-29T07:24:38.607+00:00',
  },
};

const resourcesMock = {
  transactionView: {
    records: [{ transaction: transactionMock }],
    isPending: false,
  },
};

const historyMock = createMemoryHistory();

const renderTransactionDetailContainer = ({
  resources = resourcesMock,
  history = historyMock,
} = {}) => {
  return renderWithIntl(
    <TransactionDetailContainer
      resources={resources}
      history={history}
      location={{ pathname: '/' }}
    />,
    translationsProperties,
  );
};

describe('TransactionDetailContainer', () => {
  it('should be rendered', () => {
    const { container } = renderTransactionDetailContainer();

    expect(container).toBeVisible();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.transactionView.isPending = true;
    renderTransactionDetailContainer({ resources: newResources });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  describe('closing the current page', () => {
    it('should navigate to the page with a list of transactions', () => {
      const history = createMemoryHistory();

      renderTransactionDetailContainer({ history });
      TransactionDetail.mock.calls[1][0].onClose();
      expect(history.location.pathname).toBe('/innreach/transactions');
    });
  });
});
