import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import LastMenu from './components';
import {
  FILL_PANE_WIDTH,
  PAGE_AMOUNT,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../constants';

const columnMapping = {
  [CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME]: <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.list.field.name" />,
};

const visibleColumns = [
  [CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME]
];

const CentralServersConfigurationList = ({
  isLoading,
  totalCount,
  centralServers,
  onRowClick,
  onNeedMoreData,
  children,
}) => {
  return (
    <Paneset>
      <Pane
        data-test-central-server-configuration-list
        defaultWidth={FILL_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.list.title" />}
        lastMenu={<LastMenu />}
      >
        <MultiColumnList
          id="centralServerConfigurationList"
          autosize
          virtualize
          loading={isLoading}
          pageAmount={PAGE_AMOUNT}
          pagingType="click"
          totalCount={totalCount}
          isEmptyMessage={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.list.noItems" />}
          contentData={centralServers}
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          onRowClick={onRowClick}
          onNeedMoreData={onNeedMoreData}
        />
      </Pane>
      { children}
    </Paneset>
  );
};

CentralServersConfigurationList.propTypes = {
  isLoading: PropTypes.bool,
  totalCount: PropTypes.number,
  centralServers: PropTypes.arrayOf(PropTypes.object),
  onRowClick: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CentralServersConfigurationList.defaultProps = {
  isLoading: false,
  totalCount: 0,
  centralServers: [],
};

export default CentralServersConfigurationList;