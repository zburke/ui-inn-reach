import React from 'react';
import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FormattedDate,
  KeyValue,
} from '@folio/stripes-components';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import {
  CONTRIBUTION_STATUS_LABELS,
  ITEM_TYPE_MAPPING_STATUS_LABELS,
  LOCATIONS_MAPPING_STATUS_LABELS,
  MANAGE_CONTRIBUTION_FIELDS,
} from '../../../../../../../constants';

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
} = MANAGE_CONTRIBUTION_FIELDS;

const ContributionInfo = ({
  currentContribution
}) => {
  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.status" />}>
              {currentContribution[STATUS]
                && <FormattedMessage id={CONTRIBUTION_STATUS_LABELS[currentContribution[STATUS]]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.matrial-mapping-status" />}>
              {currentContribution[ITEM_TYPE_MAPPING_STATUS]
                && <FormattedMessage id={ITEM_TYPE_MAPPING_STATUS_LABELS[currentContribution[ITEM_TYPE_MAPPING_STATUS]]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.locations-mapping-status" />}>
              {currentContribution[LOCATIONS_MAPPING_STATUS]
                && <FormattedMessage id={LOCATIONS_MAPPING_STATUS_LABELS[currentContribution[LOCATIONS_MAPPING_STATUS]]} />}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-started" />}>
              {currentContribution[CONTRIBUTION_STARTED]
                && <FormattedDate value={currentContribution[CONTRIBUTION_STARTED]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-started-by" />}>
              {currentContribution[CONTRIBUTION_STARTED_BY]}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-paused" />}>
              {currentContribution[CONTRIBUTION_PAUSED]
                && <FormattedDate value={currentContribution[CONTRIBUTION_PAUSED]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-paused-by" />}>
              {currentContribution[CONTRIBUTION_PAUSED_BY]}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-resumed" />}>
              {currentContribution[CONTRIBUTION_RESUMED]
                && <FormattedDate value={currentContribution[CONTRIBUTION_RESUMED]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-resumed-by" />}>
              {currentContribution[CONTRIBUTION_RESUMED_BY]}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled" />}>
              {currentContribution[CONTRIBUTION_CANCELLED]
                && <FormattedDate value={currentContribution[CONTRIBUTION_CANCELLED]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled-by" />}>
              {currentContribution[CONTRIBUTION_CANCELLED_BY]}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-complete" />}>
              {currentContribution[CONTRIBUTION_COMPLETE]
                && <FormattedDate value={currentContribution[CONTRIBUTION_COMPLETE]} />}
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-inn-reach.settings.manage-contribution.label.contribution-cancelled-by" />}>
              {currentContribution[TOTAL_FOLIO_INSTANCE_RECORDS]
                && <FormattedNumber value={currentContribution[TOTAL_FOLIO_INSTANCE_RECORDS]} />}
            </KeyValue>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ContributionInfo;
