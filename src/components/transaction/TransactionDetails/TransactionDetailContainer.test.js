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
  id: 'b6f66467-b9b0-4165-8cde-ec6fe4cfb79c',
  centralServerCode: 'd2ir',
  hold: {
    centralItemType: 200,
    centralPatronType: 200,
    id: '0abd066f-51a3-40d0-ba49-4ad3508b47b5',
    itemAgencyCode: 'ydg01',
    itemId: 'it00000000002',
    author: 'Herbert, Frank J',
    metadata: {
      createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
      createdByUsername: 'diku_admin',
      createdDate: '2021-10-19T07:12:51.162+00:00',
    },
    needBefore: 1745467531,
    patronAgencyCode: 'jcg01',
    patronId: 'patron1',
    patronName: 'Brown, Adam',
    pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
    transactionTime: 1544466568,
    title: 'Children of Dune',
    folioRequestId: '78ad79d9-afbb-462a-afb7-a31eb331a371',
    folioLoanId: '829f0791-9c2a-42d5-a2eb-6c3b4a38c1d8',
    folioPatronId: 'b4cee18d-f862-4ef1-95a5-879fdd619603',
    folioItemId: '34bd066f-51a3-40d0-ba49-4ad3508b4778',
    folioInstanceId: 'j7f5ebb7-9285-58f8-bc1e-608ac2080894',
    folioHoldingId: 'w5f5ebb7-9285-58f8-bc1e-608ac2080832',
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

const resourcesMock = {
  transactionView: {
    records: [transactionMock],
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
