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
       
      </Row>
    </>
  );
};

CurrentContribution.propTypes = {
  currentContribution: PropTypes.object.isRequired,
};
export default CurrentContribution;
