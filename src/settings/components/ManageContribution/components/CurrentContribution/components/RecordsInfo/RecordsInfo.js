import React from 'react';
import classNames from 'classnames';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  NoValue,
} from '@folio/stripes-components';
import {
  MANAGE_CONTRIBUTION_FIELDS,
} from '../../../../../../../constants';
import css from '../../CurrentContribution.css';

const {
  RECORDS_EVALUATED,
  CONTRIBUTED,
  UPDATED,
  DE_CONTRIBUTED,
  ERRORS,
} = MANAGE_CONTRIBUTION_FIELDS;

const RecordsInfo = ({
  currentContribution,
}) => {
  return (
    <Col sm={12}>
      <Row>
        <Col
          className={css.tabularHeaderCol}
          sm={3}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.records-evaluated" />
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={2}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contributed" />
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={2}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.updated" />
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={2}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.decontributed" />
        </Col>
        <Col
          className={css.tabularHeaderCol}
          sm={3}
        >
          <FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.error" />
        </Col>
      </Row>
      <Row
        className={css.tabularRow}
      >
        <Col
          sm={3}
          className={classNames(css.tabularCol, css.tabularColFirst)}
        >
          {currentContribution[RECORDS_EVALUATED]
            ? <FormattedNumber value={currentContribution[RECORDS_EVALUATED]} />
            : <NoValue />}
        </Col>
        <Col
          sm={2}
          className={css.tabularCol}
        >
          {currentContribution[CONTRIBUTED]
            ? <FormattedNumber value={currentContribution[CONTRIBUTED]} />
            : <NoValue />}
        </Col>
        <Col
          sm={2}
          className={css.tabularCol}
        >
          {currentContribution[UPDATED]
            ? <FormattedNumber value={currentContribution[UPDATED]} />
            : <NoValue />}
        </Col>
        <Col
          sm={2}
          className={css.tabularCol}
        >
          {currentContribution[DE_CONTRIBUTED]
            ? <FormattedNumber value={currentContribution[DE_CONTRIBUTED]} />
            : <NoValue />}
        </Col>
        <Col
          sm={3}
          className={css.tabularCol}
        >
          {currentContribution[ERRORS]
            ? <FormattedNumber value={currentContribution[ERRORS]} />
            : <NoValue />}
        </Col>
      </Row>
    </Col>
  );
};

export default RecordsInfo;
