import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedDate
} from 'react-intl';
import {
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import {
  MANAGE_CONTRIBUTION_FIELDS,
  CONTRIBUTION_STATUSES,
  CONTRIBUTION_STATUS_LABELS,
} from '../../../../../constants';
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
        </Col>
      </Row>
    </>
  );
};

CurrentContribution.propTypes = {
  currentContribution: PropTypes.object.isRequired,
};
export default CurrentContribution;
