import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Label,
  Row,
} from '@folio/stripes-components';
import css from '../../../../../../MaterialType/components/MaterialTypeMappingList/MaterialTypeMappingList.css';

const TabularListTitles = () => {
  return (
    <Row>
      <Col
        className={css.tabularHeaderCol}
        sm={6}
      >
        <Label>
          <FormattedMessage id="ui-inn-reach.settings.patron-agency.field.custom-field-value" />
        </Label>
      </Col>
      <Col
        className={css.tabularHeaderCol}
        sm={6}
      >
        <Label>
          <FormattedMessage id="ui-inn-reach.settings.patron-agency.field.agency-code" />
        </Label>
      </Col>
    </Row>
  );
};

export default TabularListTitles;
