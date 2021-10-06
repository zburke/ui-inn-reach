import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ActionMenu from './ActionMenu';
import {
  PatronActions,
} from './components';

jest.mock('./components', () => ({
  PatronActions: jest.fn(() => <div>PatronActions</div>),
}));

const renderActionMenu = ({
  transactionType,
} = {}) => {
  return renderWithIntl(
    <ActionMenu
      onToggle={jest.fn()}
      transactionType={transactionType}
    />,
    translationsProperties,
  );
};

describe('ActionMenu', () => {
  it('should render the patron actions', () => {
    const { getByText } = renderActionMenu({ transactionType: 'patron' });
    expect(getByText('PatronActions')).toBeInTheDocument();
  });
});
