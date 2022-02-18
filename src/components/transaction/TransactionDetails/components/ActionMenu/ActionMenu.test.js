import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ActionMenu from './ActionMenu';

jest.mock('./components', () => ({
  PatronActions: jest.fn(() => <div>PatronActions</div>),
  ItemActions: jest.fn(() => <div>ItemActions</div>),
}));

const renderActionMenu = ({
  transaction,
} = {}) => {
  return renderWithIntl(
    <ActionMenu
      transaction={transaction}
      onToggle={jest.fn()}
      onReceiveUnshippedItem={jest.fn()}
      onReceiveItem={jest.fn()}
      onCheckoutBorrowingSite={jest.fn()}
    />,
    translationsProperties,
  );
};

describe('ActionMenu', () => {
  it('should render the patron actions', () => {
    const { getByText } = renderActionMenu({ transaction: { type: 'PATRON' } });

    expect(getByText('PatronActions')).toBeInTheDocument();
  });

  it('should render the item actions', () => {
    const { getByText } = renderActionMenu({ transaction: { type: 'ITEM' } });

    expect(getByText('ItemActions')).toBeInTheDocument();
  });
});
