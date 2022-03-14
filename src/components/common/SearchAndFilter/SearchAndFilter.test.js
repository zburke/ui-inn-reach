import React from 'react';
import { screen } from '@testing-library/react';
import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import SearchAndFilter from './SearchAndFilter';
import { translationsProperties } from '../../../../test/jest/helpers';
import { ReportModal } from '../../../routes/transaction/components';

jest.mock('@folio/stripes/components', () => {
  return {
    ...jest.requireActual('@folio/stripes/components'),
    MultiColumnList: jest.fn(() => 'MultiColumnList'),
  };
});

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  FiltersPane: jest.fn(() => <div>FiltersPane</div>),
  ResetButton: jest.fn(() => <div>ResetButton</div>),
  ResultListLastMenu: jest.fn(() => <div>ResultListLastMenu</div>),
  SearchForm: jest.fn(() => <div>SearchForm</div>),
  ResultStatusMessage: jest.fn(() => <div>ResultStatusMessage</div>),
}));

jest.mock('../NavigationMenu', () => jest.fn(() => <div>NavigationMenu</div>));

jest.mock('../../../routes/transaction/components', () => ({
  ...jest.requireActual('../../../routes/transaction/components'),
  ReportModal: jest.fn(() => <div>ReportModal</div>),
}));

const renderSearchAndFilter = ({
  isLoading = false,
  showOverdueReportModal = false,
  children,
  visibleColumns = [],
  columnMapping = {},
  resultsFormatter = {},
  resultsPaneTitle = <div>resultsPaneTitle</div>,
  isShowAddNew = false,
  count = 0,
  contentData = [],
  isPreRenderAllData = false,
  isInsideListSearch = false,
  id = 'transactions-list',
  onNeedMoreData,
  onRowClick,
  resetData,
  onGenerateReport,
  onToggleOverdueReportModal,
}) => (renderWithIntl(
  <Router history={createMemoryHistory()}>
    <SearchAndFilter
      location={{ pathname: '/', hash: '', search: '' }}
      isLoading={isLoading}
      showOverdueReportModal={showOverdueReportModal}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      resultsFormatter={resultsFormatter}
      resultsPaneTitle={resultsPaneTitle}
      isShowAddNew={isShowAddNew}
      count={count}
      contentData={contentData}
      isPreRenderAllData={isPreRenderAllData}
      isInsideListSearch={isInsideListSearch}
      id={id}
      resetData={resetData}
      onNeedMoreData={onNeedMoreData}
      onRowClick={onRowClick}
      onGenerateReport={onGenerateReport}
      onToggleOverdueReportModal={onToggleOverdueReportModal}
    >
      {children}
    </SearchAndFilter>
  </Router>,
  translationsProperties
));

describe('SearchAndFilter', () => {
  const onNeedMoreData = jest.fn();
  const onGenerateReport = jest.fn();
  const onToggleOverdueReportModal = jest.fn();
  const onRowClick = jest.fn();
  const resetData = jest.fn();

  const commonProps = {
    onNeedMoreData,
    onGenerateReport,
    onToggleOverdueReportModal,
    onRowClick,
    resetData,
  };

  it('should be rendered', () => {
    const { container } = renderSearchAndFilter(commonProps);

    expect(container).toBeVisible();
  });

  it('should display ResultListLastMenu', () => {
    renderSearchAndFilter({
      ...commonProps,
      isShowAddNew: true,
    });
    expect(screen.getByText('ResultListLastMenu')).toBeVisible();
  });

  describe('ReportModal', () => {
    beforeEach(() => {
      renderSearchAndFilter({
        ...commonProps,
        showOverdueReportModal: true,
      });
    });

    it('should be visible', () => {
      expect(screen.getByText('ReportModal')).toBeVisible();
    });

    it('should generate report', () => {
      const record = { minDaysOverdue: 2 };

      ReportModal.mock.calls[1][0].onSubmit(record);
      expect(onGenerateReport).toHaveBeenCalledWith('overdue', record);
    });

    it('should close the modal', () => {
      ReportModal.mock.calls[1][0].onTriggerModal();
      expect(onToggleOverdueReportModal).toHaveBeenCalled();
    });
  });
});
