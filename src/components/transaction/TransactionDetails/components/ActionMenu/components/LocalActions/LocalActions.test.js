import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import LocalActions from './LocalActions';

const transactionMock = {
  state: 'LOCAL_HOLD',
};

const renderLocalActions = ({
  transaction = transactionMock,
  onToggle = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <LocalActions
      transaction={transaction}
      onToggle={onToggle}
    />,
    translationsProperties,
  );
};

describe('LocalActions component', () => {
  it('should render "check out" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Check out to local patron')).toBeVisible();
  });

  it('should render "Transfer hold to another item" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Transfer hold to another item')).toBeVisible();
  });

  it('should render "Cancel hold" action', () => {
    const { getByText } = renderLocalActions();

    expect(getByText('Cancel hold')).toBeVisible();
  });
});
