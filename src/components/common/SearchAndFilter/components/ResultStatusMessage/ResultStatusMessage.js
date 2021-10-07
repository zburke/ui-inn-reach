import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';

import { SEARCH_PARAMETER } from '../../../../../constants';

import css from './ResultStatusMessage.css';

export default function ResultStatusMessage({
  filters,
  isFiltersOpened,
  isLoading,
  toggleFilters,
  isPreRenderAllData,
}) {
  const hasFilters = filters && Object.values(filters).some(Boolean);
  const isLoaded = (hasFilters || isPreRenderAllData) && !isLoading;

  const source = useMemo(
    () => ({
      loaded: () => isLoaded,
      pending: () => isLoading,
      failure: () => { },
    }),
    [isLoading, hasFilters, isPreRenderAllData],
  );

  return (
    <div className={css.negativeIndexPosition}>
      <SearchAndSortNoResultsMessage
        filterPaneIsVisible={isFiltersOpened}
        searchTerm={filters[SEARCH_PARAMETER] || ''}
        source={source}
        toggleFilterPane={toggleFilters}
      />
    </div>
  );
}

ResultStatusMessage.propTypes = {
  filters: PropTypes.object.isRequired,
  isFiltersOpened: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPreRenderAllData: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
};
