import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  Col,
  Label,
  Row,
} from '@folio/stripes-components';
import css from '../../TabularList.css';

const TabularListTitles = () => {
  return (
    <Row>
      <Col
        sm={3}
        className={css.tabularHeaderCol}
      >

        <Label required>
          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.code" />
        </Label>
      </Col>
      <Col
        sm={8}
        className={classNames(css.tabularHeaderCol)}
      >
        <Label required>
          <FormattedMessage id="ui-inn-reach.settings.central-server-configuration.local-agency.field.libraries" />
        </Label>
      </Col>
      <Col
        sm={1}
        className={css.tabularHeaderCol}
      />
    </Row>
  );
};

export default TabularListTitles;
