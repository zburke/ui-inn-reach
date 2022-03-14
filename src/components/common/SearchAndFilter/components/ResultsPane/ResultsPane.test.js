import React from 'react';
import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { getFiltersCount } from '../../../../../utils';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import ResultsPane from './ResultsPane';

jest.mock('../../../../../utils', () => ({
  getFiltersCount: jest.fn().mockReturnValue(1),
}));

const RESULTS = 'Results';
const TITLE = 'Entities';

const renderResultsPane = (props = {
  title: TITLE,
}) => (renderWithIntl(
  <ResultsPane
    {...props}
    filters={{}}
    renderActionMenu={jest.fn(() => <div>renderActionMenu</div>)}
  >
    {RESULTS}
  </ResultsPane>,
  translationsProperties
));

describe('ResultsPane', () => {
  it('should display passed children', () => {
    const { getByText } = renderResultsPane();

    expect(getByText(RESULTS)).toBeDefined();
  });

  describe('Pane left menu', () => {
    const filtersCount = 1;

    beforeEach(() => {
      getFiltersCount.mockClear().mockReturnValue(filtersCount);
    });

    it('should display filters count when filters are closed', () => {
      const { getByText } = renderResultsPane({ isFiltersOpened: false, title: TITLE });

      expect(getByText(filtersCount)).toBeDefined();
    });

    it('should not display filters count when filters are opened', () => {
      const { queryByText } = renderResultsPane({ isFiltersOpened: true, title: TITLE });

      expect(queryByText(filtersCount)).toBeNull();
    });
  });

  describe('Pane right menu', () => {
    it('should be rendered when defined', () => {
      const renderLastMenu = jest.fn();

      renderResultsPane({ title: TITLE, renderLastMenu });

      expect(renderLastMenu).toHaveBeenCalled();
    });
  });

  describe('Pane title', () => {
    it('should display passed title value', () => {
      const { getByText } = renderResultsPane({ title: TITLE });

      expect(getByText(TITLE)).toBeDefined();
    });
  });
});
