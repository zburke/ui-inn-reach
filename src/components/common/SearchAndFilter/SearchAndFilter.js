import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  FormattedMessage,
} from 'react-intl';
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
import ActionItem from '../ActionItem';
import {
  ReportModal,
} from '../../../routes/transaction/components';
import {
  ICONS,
  OVERDUE,
  OWNING_SITE_OVERDUE_FIELDS,
} from '../../../constants';

const {
  MINIMUM_DAYS_OVERDUE,
} = OWNING_SITE_OVERDUE_FIELDS;

const SearchAndFilter = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  showOverdueReportModal,
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
  onGenerateReport,
  onToggleOverdueReportModal,
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

  const handleOverdueReport = (record) => {
    onGenerateReport(OVERDUE, record);
    onToggleOverdueReportModal();
  };

  const renderActionMenu = ({ onToggle }) => {
    return (
      <ActionItem
        id="export-owning-site-overdue-report"
        icon={ICONS.DOWNLOAD}
        buttonTextTranslationKey="ui-inn-reach.reports.owning-site-overdue.label"
        onClickHandler={onToggleOverdueReportModal}
        onToggle={onToggle}
      />
    );
  };

  const renderOverdueReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.maximum-days-overdue" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.maximum-days-overdue" />}
      fieldName={MINIMUM_DAYS_OVERDUE}
      onSubmit={handleOverdueReport}
      onTriggerModal={onToggleOverdueReportModal}
    />
  );

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
        renderActionMenu={renderActionMenu}
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
      {showOverdueReportModal && renderOverdueReportModal()}
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
  showOverdueReportModal: PropTypes.bool.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  onGenerateReport: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onToggleOverdueReportModal: PropTypes.func.isRequired,
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
