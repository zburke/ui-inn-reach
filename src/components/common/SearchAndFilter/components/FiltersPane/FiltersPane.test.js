import React from 'react';
import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';
import user from '@testing-library/user-event';

import FiltersPane from './FiltersPane';
import { translationsProperties } from '../../../../../../test/jest/helpers';

const FILTERS = 'Filters';
const COLLAPSE_FILTERS_BUTTON = 'Icon';

const renderFiltersPane = (props = {
  toggleFilters: jest.fn(),
}) => (renderWithIntl(
  <FiltersPane
    {...props}
  >
    {FILTERS}
  </FiltersPane>,
  translationsProperties
));

describe('FiltersPane', () => {
  it('should display passed children', () => {
    const { getByText } = renderFiltersPane();

    expect(getByText(FILTERS)).toBeDefined();
  });

  it('should call toggleFilters when collapse filters button is pressed', () => {
    const toggleFilters = jest.fn();
    const { getByText } = renderFiltersPane({ toggleFilters });

    user.click(getByText(COLLAPSE_FILTERS_BUTTON));

    expect(toggleFilters).toHaveBeenCalled();
  });
});
