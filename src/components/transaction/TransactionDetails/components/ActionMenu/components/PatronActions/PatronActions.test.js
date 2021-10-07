import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../../../../test/jest/helpers';
import PatronActions from './PatronActions';

const renderPatronActions = ({
  onToggle = jest.fn(),
} = {}) => {
  return renderWithIntl(
    <PatronActions
      onToggle={onToggle}
    />,
    translationsProperties,
  );
};

describe('PatronActions component', () => {
  it('should render "check out" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Check out to patron')).toBeVisible();
  });

  it('should render "Receive item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Receive item')).toBeVisible();
  });

  it('should render "Receive unshipped item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Receive unshipped item')).toBeVisible();
  });

  it('should render "Return item" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Return item')).toBeVisible();
  });

  it('should render "Cancel hold" action', () => {
    const { getByText } = renderPatronActions();

    expect(getByText('Cancel hold')).toBeVisible();
  });
});
