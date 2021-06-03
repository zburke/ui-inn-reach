import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes-components';

import {
  SERVER_CONNECTION_ACCORDION_NAME,
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';

const ServerConnection = ({
  centralServer,
}) => {
  return (
    <Accordion
      id={SERVER_CONNECTION_ACCORDION_NAME}
      label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.accordion.server-connection.title" />}
    >
      <Row>
        <Col xs>
          <KeyValue
            data-testid="central-server-configuration-view-fields-name"
            label={<FormattedMessage id="ui-inn-reach.settings.central-server-configuration.view.field.address" />}
            value={centralServer[CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS] || <NoValue />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ServerConnection.propTypes = {
  centralServer: PropTypes.object.isRequired,
};

export default ServerConnection;
