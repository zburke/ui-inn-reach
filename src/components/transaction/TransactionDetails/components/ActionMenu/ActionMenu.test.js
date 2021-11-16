import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ActionMenu from './ActionMenu';

jest.mock('./components', () => ({
  PatronActions: jest.fn(() => <div>PatronActions</div>),
  ItemActions: jest.fn(() => <div>ItemActions</div>),
}));

const renderActionMenu = ({
  transactionType,
} = {}) => {
  return renderWithIntl(
    <ActionMenu
      transactionType={transactionType}
      onToggle={jest.fn()}
    />,
    translationsProperties,
  );
};

describe('ActionMenu', () => {
  it('should render the patron actions', () => {
    const { getByText } = renderActionMenu({ transactionType: 'PATRON' });

    expect(getByText('PatronActions')).toBeInTheDocument();
  });

  it('should render the item actions', () => {
    const { getByText } = renderActionMenu({ transactionType: 'ITEM' });

    expect(getByText('ItemActions')).toBeInTheDocument();
  });
});
