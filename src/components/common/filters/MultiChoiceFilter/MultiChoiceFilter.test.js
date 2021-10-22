import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';

import MultiChoiceFilter from './MultiChoiceFilter';
import { translationsProperties } from '../../../../../test/jest/helpers';

const dataOptionsMock = [
  { label: 'central server1', value: 'central server1' },
  { label: 'central server2', value: 'central server2' },
];

const renderMultiChoiceFilter = ({
  name = 'transactionStatus',
  activeFilters = [],
  dataOptions = dataOptionsMock,
  closedByDefault,
  disabled,
  onChange = jest.fn(),
} = {}) => (renderWithIntl(
  <MultiChoiceFilter
    name={name}
    activeFilters={activeFilters}
    dataOptions={dataOptions}
    closedByDefault={closedByDefault}
    disabled={disabled}
    onChange={onChange}
  />,
  translationsProperties,
));

describe('MultiChoiceFilter', () => {
  it('should display the correct filter name', () => {
    renderMultiChoiceFilter();
    expect(screen.getByText('Transaction status')).toBeVisible();
  });

  it('should call onChange', () => {
    const onChange = jest.fn();

    renderMultiChoiceFilter({ onChange });
    userEvent.click(screen.getByText('central server1'));
    expect(onChange).toHaveBeenCalledWith({
      name: 'transactionStatus',
      values: ['central server1'],
    });
  });
});
