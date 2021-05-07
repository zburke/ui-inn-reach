import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
  NavList,
  NavListItem,
} from '@folio/stripes/components';

import LastMenu from './components';
import {
  FILL_PANE_WIDTH,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../constants';
import {
  getCentralServerConfigurationViewUrl,
} from '../../../../utils';

const CentralServersConfigurationList = ({
  centralServers,
  children,
}) => {
  return (
    <Paneset>
      <Pane
        data-test-central-server-configuration-list
        defaultWidth={FILL_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-inn-reach.settings.central-servers.list.title" />}
        lastMenu={<LastMenu />}
      >
        <NavList>
          {centralServers.map(centralServer => (
            <NavListItem
              key={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.ID]}
              to={getCentralServerConfigurationViewUrl(centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.ID])}
            >
              {centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.NAME]}
            </NavListItem>
          ))}
        </NavList>
      </Pane>
      {children}
    </Paneset>
  );
};

CentralServersConfigurationList.propTypes = {
  centralServers: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

CentralServersConfigurationList.defaultProps = {
  centralServers: [],
};

export default CentralServersConfigurationList;
