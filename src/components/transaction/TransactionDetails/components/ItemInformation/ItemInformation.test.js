import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ItemInformation from './ItemInformation';

const transactionMock = {
  centralServerCode: 'd2ir',
  hold: {
    centralItemType: 200,
    itemAgencyCode: 'ydg01',
    itemId: 'it00000000002',
    author: 'Herbert, Frank J',
    folioItemId: '34bd066f-51a3-40d0-ba49-4ad3508b4778',
    folioInstanceId: 'j7f5ebb7-9285-58f8-bc1e-608ac2080894',
    folioHoldingId: 'w5f5ebb7-9285-58f8-bc1e-608ac2080832',
    title: 'Children of Dune',
    callNumber: 'QP1.E61 v.78 c.1',
  },
};

const history = createMemoryHistory();

const renderItemInformation = ({
  transaction = transactionMock,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <ItemInformation
        transaction={transaction}
      />
    </Router>,
    translationsProperties,
  );
};

describe('ItemInformation', () => {
  beforeEach(() => {
    renderItemInformation();
  });

  it('should show the transaction item ID', () => {
    expect(screen.getByText('it00000000002')).toBeVisible();
  });

  it('should show the transaction item title', () => {
    expect(screen.getByText('Children of Dune')).toBeVisible();
  });

  it('should show the transaction central item type', () => {
    expect(screen.getByText('d2ir: 200')).toBeVisible();
  });

  it('should show the transaction author', () => {
    expect(screen.getByText('Herbert, Frank J')).toBeVisible();
  });

  it('should show the transaction call no.', () => {
    expect(screen.getByText('QP1.E61 v.78 c.1')).toBeVisible();
  });

  it('should show the transaction item agency', () => {
    expect(screen.getByText('ydg01')).toBeVisible();
  });
});
