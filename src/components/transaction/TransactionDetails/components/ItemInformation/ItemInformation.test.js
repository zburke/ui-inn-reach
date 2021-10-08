import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ItemInformation from './ItemInformation';

const transactionMock = {
  itemId: '4324534',
  itemTitle: 'Canadian labour relations boards reports.',
  centralItemType: 'Material type name (INN-Reach code)',
  author: '-',
  callNo: 'QP1.E61 v.78 c.1',
  itemAgency: 'fl1g1 (Description)',
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
    expect(screen.getByText('4324534')).toBeVisible();
  });

  it('should show the transaction item title', () => {
    expect(screen.getByText('Canadian labour relations boards reports.')).toBeVisible();
  });

  it('should show the transaction central item type', () => {
    expect(screen.getByText('Material type name (INN-Reach code)')).toBeVisible();
  });

  it('should show the transaction author', () => {
    expect(screen.getByText('-')).toBeVisible();
  });

  it('should show the transaction call no.', () => {
    expect(screen.getByText('QP1.E61 v.78 c.1')).toBeVisible();
  });

  it('should show the transaction item agency', () => {
    expect(screen.getByText('fl1g1 (Description)')).toBeVisible();
  });
});
