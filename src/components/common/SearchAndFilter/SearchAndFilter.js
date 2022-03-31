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
  FIELDS_OF_REPORT_MODALS,
  ICONS,
  REPORT_TYPES,
  REPORT_MODALS,
} from '../../../constants';

const {
  SHOW_OVERDUE_REPORT_MODAL,
  SHOW_REQUESTED_TOO_LONG_REPORT_MODAL,
  SHOW_RETURNED_TOO_LONG_REPORT_MODAL,
  SHOW_PAGED_TOO_LONG_REPORT_MODAL,
  SHOW_IN_TRANSIT_TOO_LONG_REPORT_MODAL,
} = REPORT_MODALS;

const {
  MINIMUM_DAYS_RETURNED,
  MINIMUM_DAYS_OVERDUE,
  MINIMUM_DAYS_REQUESTED,
  MINIMUM_DAYS_PAGED,
  MINIMUM_DAYS_SHIPPED,
} = FIELDS_OF_REPORT_MODALS;

const {
  OVERDUE,
  REQUESTED_TOO_LONG,
  RETURNED_TOO_LONG,
  PAGED_TOO_LONG,
  IN_TRANSIT_TOO_LONG,
} = REPORT_TYPES;

const SearchAndFilter = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  statesOfModalReports: {
    [SHOW_OVERDUE_REPORT_MODAL]: showOverdueReportModal,
    [SHOW_REQUESTED_TOO_LONG_REPORT_MODAL]: showRequestedTooLongReportModal,
    [SHOW_RETURNED_TOO_LONG_REPORT_MODAL]: showReturnedTooLongReportModal,
    [SHOW_PAGED_TOO_LONG_REPORT_MODAL]: showPagedTooLongReportModal,
    [SHOW_IN_TRANSIT_TOO_LONG_REPORT_MODAL]: showInTransitTooLongReportModal,
  },
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
  onToggleStatesOfModalReports,
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
    onToggleStatesOfModalReports(SHOW_OVERDUE_REPORT_MODAL);
  };

  const handleRequestedTooLongReport = (record) => {
    onGenerateReport(REQUESTED_TOO_LONG, record);
    onToggleStatesOfModalReports(SHOW_REQUESTED_TOO_LONG_REPORT_MODAL);
  };

  const handleReturnedTooLongReport = (record) => {
    onGenerateReport(RETURNED_TOO_LONG, record);
    onToggleStatesOfModalReports(SHOW_RETURNED_TOO_LONG_REPORT_MODAL);
  };

  const handlePagedTooLongReport = (record) => {
    onGenerateReport(PAGED_TOO_LONG, record);
    onToggleStatesOfModalReports(SHOW_PAGED_TOO_LONG_REPORT_MODAL);
  };

  const handleInTransitTooLongReport = (record) => {
    onGenerateReport(IN_TRANSIT_TOO_LONG, record);
    onToggleStatesOfModalReports(SHOW_IN_TRANSIT_TOO_LONG_REPORT_MODAL);
  };

  const toggleOverdueModal = () => {
    onToggleStatesOfModalReports(SHOW_OVERDUE_REPORT_MODAL);
  };

  const toggleRequestedTooLongModal = () => {
    onToggleStatesOfModalReports(SHOW_REQUESTED_TOO_LONG_REPORT_MODAL);
  };

  const toggleReturnedTooLongModal = () => {
    onToggleStatesOfModalReports(SHOW_RETURNED_TOO_LONG_REPORT_MODAL);
  };

  const togglePagedTooLongModal = () => {
    onToggleStatesOfModalReports(SHOW_PAGED_TOO_LONG_REPORT_MODAL);
  };

  const toggleInTransitTooLongModal = () => {
    onToggleStatesOfModalReports(SHOW_IN_TRANSIT_TOO_LONG_REPORT_MODAL);
  };

  const renderActionMenu = ({ onToggle }) => {
    return (
      <>
        <ActionItem
          id="export-owning-site-overdue-report"
          icon={ICONS.DOWNLOAD}
          buttonTextTranslationKey="ui-inn-reach.reports.owning-site-overdue.label"
          onClickHandler={toggleOverdueModal}
          onToggle={onToggle}
        />
        <ActionItem
          id="export-requested-too-long-report"
          icon={ICONS.DOWNLOAD}
          buttonTextTranslationKey="ui-inn-reach.reports.requested-too-long.label"
          onClickHandler={toggleRequestedTooLongModal}
          onToggle={onToggle}
        />
        <ActionItem
          id="export-returned-too-long-report"
          icon={ICONS.DOWNLOAD}
          buttonTextTranslationKey="ui-inn-reach.reports.returned-too-long.label"
          onClickHandler={toggleReturnedTooLongModal}
          onToggle={onToggle}
        />
        <ActionItem
          id="export-paged-too-long-report"
          icon={ICONS.DOWNLOAD}
          buttonTextTranslationKey="ui-inn-reach.reports.paged-too-long.label"
          onClickHandler={togglePagedTooLongModal}
          onToggle={onToggle}
        />
        <ActionItem
          id="export-in-transit-too-long-report"
          icon={ICONS.DOWNLOAD}
          buttonTextTranslationKey="ui-inn-reach.reports.in-transit-too-long.label"
          onClickHandler={toggleInTransitTooLongModal}
          onToggle={onToggle}
        />
      </>
    );
  };

  const renderOverdueReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.owning-site-overdue-report" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.minimum-days-overdue" />}
      fieldName={MINIMUM_DAYS_OVERDUE}
      onSubmit={handleOverdueReport}
      onTriggerModal={toggleOverdueModal}
    />
  );

  const renderRequestedTooLongReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.requested-too-long-report" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.minimum-days-requested" />}
      fieldName={MINIMUM_DAYS_REQUESTED}
      onSubmit={handleRequestedTooLongReport}
      onTriggerModal={toggleRequestedTooLongModal}
    />
  );

  const renderReturnedTooLongReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.returned-too-long-report" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.minimum-days-returned" />}
      fieldName={MINIMUM_DAYS_RETURNED}
      onSubmit={handleReturnedTooLongReport}
      onTriggerModal={toggleReturnedTooLongModal}
    />
  );

  const renderPagedTooLongReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.paged-too-long-report" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.minimum-days-paged" />}
      fieldName={MINIMUM_DAYS_PAGED}
      onSubmit={handlePagedTooLongReport}
      onTriggerModal={togglePagedTooLongModal}
    />
  );

  const renderInTransitTooLongReportModal = () => (
    <ReportModal
      heading={<FormattedMessage id="ui-inn-reach.reports.modal.title.in-transit-too-long-report" />}
      fieldLabel={<FormattedMessage id="ui-inn-reach.reports.modal.field.minimum-days-shipped" />}
      fieldName={MINIMUM_DAYS_SHIPPED}
      onSubmit={handleInTransitTooLongReport}
      onTriggerModal={toggleInTransitTooLongModal}
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

          {getFilters()}

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
      {children}
      {showOverdueReportModal && renderOverdueReportModal()}
      {showRequestedTooLongReportModal && renderRequestedTooLongReportModal()}
      {showReturnedTooLongReportModal && renderReturnedTooLongReportModal()}
      {showPagedTooLongReportModal && renderPagedTooLongReportModal()}
      {showInTransitTooLongReportModal && renderInTransitTooLongReportModal()}
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
  statesOfModalReports: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  onGenerateReport: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onToggleStatesOfModalReports: PropTypes.func.isRequired,
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
