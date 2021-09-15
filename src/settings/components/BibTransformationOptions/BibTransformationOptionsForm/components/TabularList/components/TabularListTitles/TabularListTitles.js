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
        sm={1}
        className={css.tabularHeaderCol}
      />
      <Col
        sm={3}
        className={css.tabularHeaderCol}
      >
        <Label required>
          <FormattedMessage id="ui-inn-reach.settings.bib-transformation.field.identifier-type" />
        </Label>
      </Col>
      <Col className={classNames(css.tabularHeaderCol, css.customColSmWidth)}>
        <Label>
          <FormattedMessage id="ui-inn-reach.settings.bib-transformation.field.strip-prefix" />
        </Label>
      </Col>
      <Col className={classNames(css.tabularHeaderCol, css.customColMdWidth)}>
        <Label>
          <FormattedMessage id="ui-inn-reach.settings.bib-transformation.field.ignore-prefixes" />
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
