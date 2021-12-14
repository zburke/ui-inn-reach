import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  FiltersPane,
  ResetButton,
  ResultListLastMenu,
  SearchForm,
  ResultsPane,
  ResultStatusMessage,
} from './components';
import NavigationMenu from '../NavigationMenu';

import TransactionListFilters from '../../transaction/TransactionListFilters';

import {
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '../../../hooks';

const SearchAndFilter = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  children,
  visibleColumns,
  columnMapping,
  resultsFormatter,
  resultsPaneTitle,
  isShowAddNew,
  count,
  contentData,
  onRowClick,
  isPreRenderAllData,
  isInsideListSearch,
  id,
}) => {
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
  ] = useLocationFilters(
    location,
    history,
    resetData,
  );

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(
    location,
    history,
    resetData,
    visibleColumns,
  );
  const [isFiltersOpened, toggleFilters] = useToggle(true);
  const getResultsPaneFilters = !isFiltersOpened ? filters : {};

  const getFilters = useCallback(() => {
    return (
      <TransactionListFilters
        activeFilters={filters}
        applyFilters={applyFilters}
      />
    );
  }, [location, filters]);

  const renderLastMenu = () => {
    if (!isShowAddNew) {
      return null;
    }

    return <ResultListLastMenu />;
  };

  const resultsStatusMessage = <ResultStatusMessage
    {
      ...{
        filters,
        isFiltersOpened,
        isLoading,
        toggleFilters,
        isPreRenderAllData,
      }
    }
  />;

  return (
    <Paneset data-test-result-list>
      {(isFiltersOpened && !isInsideListSearch) && (
        <FiltersPane toggleFilters={toggleFilters}>
          <NavigationMenu
            separator
            history={history}
            location={location}
          />
          <SearchForm
            applySearch={applySearch}
            changeSearch={changeSearch}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />

          <ResetButton
            disabled={!location.search}
            id="reset-filters"
            reset={resetFilters}
          />

          { getFilters() }

        </FiltersPane>
      )}

      <ResultsPane
        count={count}
        filters={getResultsPaneFilters}
        isFiltersOpened={isFiltersOpened}
        renderLastMenu={renderLastMenu}
        title={resultsPaneTitle}
        toggleFiltersPane={toggleFilters}
      >

        {
          isInsideListSearch && (
            <SearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              isInsideListSearch={isInsideListSearch}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          )
        }

        <MultiColumnList
          autosize
          virtualize
          columnMapping={columnMapping}
          contentData={contentData}
          formatter={resultsFormatter}
          id={id}
          isEmptyMessage={resultsStatusMessage}
          loading={isLoading}
          sortDirection={`${sortingDirection}ending`}
          sortOrder={sortingField}
          totalCount={count}
          visibleColumns={visibleColumns}
          onHeaderClick={changeSorting}
          onNeedMoreData={onNeedMoreData}
          onRowClick={onRowClick}
        />
      </ResultsPane>
      { children }
    </Paneset>
  );
};

SearchAndFilter.propTypes = {
  columnMapping: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  id: PropTypes.string.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  resetData: PropTypes.func.isRequired,
  resultsFormatter: PropTypes.object.isRequired,
  resultsPaneTitle: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  contentData: PropTypes.arrayOf(PropTypes.object),
  count: PropTypes.number,
  isInsideListSearch: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPreRenderAllData: PropTypes.bool,
  isShowAddNew: PropTypes.bool,
};

SearchAndFilter.defaultProps = {
  count: 0,
  isLoading: false,
  isShowAddNew: false,
  isInsideListSearch: false,
  isPreRenderAllData: false,
  contentData: [],
};

export default withRouter(SearchAndFilter);
