import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  MultiColumnList,
  FormattedTime,
  FormattedDate,
} from '@folio/stripes/components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  PAGE_AMOUNT,
  MANAGE_CONTRIBUTION_HISTORY_METADATA,
} from '../../../../../constants';

const {
  STATUS,
  TOTAL_FOLIO_INSTANCE_RECORDS,
  RECORDS_EVALUATED,
  CONTRIBUTED,
  UPDATED,
  DE_CONTRIBUTED,
  ERRORS,
} = MANAGE_CONTRIBUTION_FIELDS;

const {
  UPDATED_DATE,
} = MANAGE_CONTRIBUTION_HISTORY_METADATA;

const columnMapping = {
  [UPDATED_DATE]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.date" />,
  [STATUS]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.status" />,
  [TOTAL_FOLIO_INSTANCE_RECORDS]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.total" />,
  [RECORDS_EVALUATED]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.evaluated" />,
  [CONTRIBUTED]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.contributed" />,
  [UPDATED]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.updated" />,
  [DE_CONTRIBUTED]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.decontributed" />,
  [ERRORS]: <FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.field.error" />,
};

const visibleColumns = [
  UPDATED_DATE,
  STATUS,
  RECORDS_EVALUATED,
  CONTRIBUTED,
  UPDATED,
  DE_CONTRIBUTED,
  ERRORS,
];

const resultsFormatter = () => ({
  [UPDATED_DATE]: (data) => (
    <FormattedMessage
      id="ui-inn-reach.settings.manage-contribution.updatedDatePattern"
      values={{
        date: <FormattedDate value={data.metadata[UPDATED_DATE]} />,
        time: <FormattedTime value={data.metadata[UPDATED_DATE]} />,
      }}
    />
  ),
});

const ContributionHistory = ({
  currentContributionHistory,
  isCurrentContributionHistoryPending,
  currentContributionHistoryCount,
  onNeedMoreContributionHistoryData,
}) => {
  return (
    <MultiColumnList
      autosize
      virtualize
      id="contributionHistoryList"
      loading={isCurrentContributionHistoryPending}
      pageAmount={PAGE_AMOUNT}
      pagingType="click"
      totalCount={currentContributionHistoryCount}
      isEmptyMessage={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.history.list.no.history" />}
      contentData={currentContributionHistory}
      columnMapping={columnMapping}
      visibleColumns={visibleColumns}
      formatter={resultsFormatter()}
      onNeedMoreData={onNeedMoreContributionHistoryData}
    />
  );
};

ContributionHistory.propTypes = {
  currentContributionHistory: PropTypes.array.isRequired,
  currentContributionHistoryCount: PropTypes.number.isRequired,
  isCurrentContributionHistoryPending: PropTypes.bool.isRequired,
  onNeedMoreContributionHistoryData: PropTypes.func.isRequired,
};
export default ContributionHistory;
