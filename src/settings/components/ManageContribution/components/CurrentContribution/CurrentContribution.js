import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import {
  Row,
  Col,
  KeyValue,
  NoValue,
  FormattedDate,
} from '@folio/stripes/components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  CONTRIBUTION_STATUS_LABELS,
  ITEM_TYPE_MAPPING_STATUS_LABELS,
  LOCATIONS_MAPPING_STATUS_LABELS,
} from '../../../../../constants';
import css from './CurrentContribution.css';

const {
  STATUS,
  ITEM_TYPE_MAPPING_STATUS,
  LOCATIONS_MAPPING_STATUS,
  CONTRIBUTION_STARTED,
  CONTRIBUTION_STARTED_BY,
  CONTRIBUTION_PAUSED,
  CONTRIBUTION_PAUSED_BY,
  CONTRIBUTION_RESUMED,
  CONTRIBUTION_RESUMED_BY,
  CONTRIBUTION_CANCELLED,
  CONTRIBUTION_CANCELLED_BY,
  CONTRIBUTION_COMPLETE,
  TOTAL_FOLIO_INSTANCE_RECORDS,
  RECORDS_EVALUATED,
  CONTRIBUTED,
  UPDATED,
  DE_CONTRIBUTED,
  ERRORS,
} = MANAGE_CONTRIBUTION_FIELDS;

const CurrentContribution = ({
  currentContribution,
}) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.status" />}>
                {currentContribution[STATUS]
                  ? <FormattedMessage id={CONTRIBUTION_STATUS_LABELS[currentContribution[STATUS]]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.matrial-mapping-status" />}>
                {currentContribution[ITEM_TYPE_MAPPING_STATUS]
                  ? <FormattedMessage id={ITEM_TYPE_MAPPING_STATUS_LABELS[currentContribution[ITEM_TYPE_MAPPING_STATUS]]} />
                  : <NoValue />}
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.locations-mapping-status" />}>
                {currentContribution[LOCATIONS_MAPPING_STATUS]
                  ? <FormattedMessage id={LOCATIONS_MAPPING_STATUS_LABELS[currentContribution[LOCATIONS_MAPPING_STATUS]]} />
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-started" />}>
                {currentContribution[CONTRIBUTION_STARTED]
                  ? <FormattedDate value={currentContribution[CONTRIBUTION_STARTED]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-started-by" />}>
                {currentContribution[CONTRIBUTION_STARTED_BY]
                  ? currentContribution[CONTRIBUTION_STARTED_BY]
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-paused" />}>
                {currentContribution[CONTRIBUTION_PAUSED]
                  ? <FormattedDate value={currentContribution[CONTRIBUTION_PAUSED]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-paused-by" />}>
                {currentContribution[CONTRIBUTION_PAUSED_BY]
                  ? currentContribution[CONTRIBUTION_PAUSED_BY]
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-resumed" />}>
                {currentContribution[CONTRIBUTION_RESUMED]
                  ? <FormattedDate value={currentContribution[CONTRIBUTION_RESUMED]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-resumed-by" />}>
                {currentContribution[CONTRIBUTION_RESUMED_BY]
                  ? currentContribution[CONTRIBUTION_RESUMED_BY]
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled" />}>
                {currentContribution[CONTRIBUTION_CANCELLED]
                  ? <FormattedDate value={currentContribution[CONTRIBUTION_CANCELLED]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled-by" />}>
                {currentContribution[CONTRIBUTION_CANCELLED_BY]
                  ? currentContribution[CONTRIBUTION_CANCELLED_BY]
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-complete" />}>
                {currentContribution[CONTRIBUTION_COMPLETE]
                  ? <FormattedDate value={currentContribution[CONTRIBUTION_COMPLETE]} />
                  : <NoValue />
                }
              </KeyValue>
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled-by" />}>
                {currentContribution[TOTAL_FOLIO_INSTANCE_RECORDS]
                  ? <FormattedNumber value={currentContribution[TOTAL_FOLIO_INSTANCE_RECORDS]} />
                  : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
        </Col>
      </Row>

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
            className={css.tabularCol}
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
    </>
  );
};

CurrentContribution.propTypes = {
  currentContribution: PropTypes.object.isRequired,
};
export default CurrentContribution;
