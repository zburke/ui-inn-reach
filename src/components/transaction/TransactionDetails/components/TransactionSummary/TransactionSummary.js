import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ViewMetaData,
} from '@folio/stripes/smart-components';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
  FormattedDate,
  FormattedTime,
} from '@folio/stripes/components';
import {
  Link,
} from 'react-router-dom';
import {
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
  TRANSACTION_SUMMARY,
} from '../../../../../constants';

const {
  TYPE,
  HOLD,
  TRACKING_ID,
  STATUS,
} = TRANSACTION_FIELDS;

const {
  TRANSACTION_TIME,
  METADATA,
  PATRON_NAME,
  PICK_UP_LOCATION,
  FOLIO_PATRON_ID,
  FOLIO_REQUEST_ID,
  FOLIO_LOAN_ID,
} = HOLD_FIELDS;

const TransactionSummary = ({
  transaction,
}) => {
  return (
    <Accordion
      id={TRANSACTION_SUMMARY}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.transaction" />}
    >
      <ViewMetaData metadata={transaction[METADATA]} />
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.time" />}
            value={transaction[HOLD]?.[TRANSACTION_TIME] &&
              <FormattedMessage
                id="ui-inn-reach.transaction-detail.field.label.time"
                values={{
                  date: <FormattedDate value={transaction[HOLD][TRANSACTION_TIME] * 1000} />,
                  time: <FormattedTime value={transaction[HOLD][TRANSACTION_TIME] * 1000} />,
                }}
              />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.trackingId" />}
            value={transaction[TRACKING_ID]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.type" />}
            value={transaction[TYPE] &&
              <FormattedMessage id={`ui-inn-reach.transaction.type.${transaction[TYPE].toLowerCase()}`} />
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.status" />}
            value={transaction[STATUS]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronName" />}
            value={transaction[HOLD]?.[PATRON_NAME]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.pickupLocation" />}
            value={transaction[HOLD]?.[PICK_UP_LOCATION]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.request" />}
            value={transaction[HOLD]?.[FOLIO_REQUEST_ID] &&
              <Link to={`/requests/view/${transaction[HOLD][FOLIO_REQUEST_ID]}`}>
                <FormattedMessage id="ui-inn-reach.transaction-detail.field.label.request" />
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.loan" />}
            value={
              transaction[HOLD]?.[FOLIO_LOAN_ID] &&
              transaction[HOLD]?.[FOLIO_PATRON_ID] &&
              <Link to={`/users/${transaction[HOLD][FOLIO_PATRON_ID]}/loans/view/${transaction[HOLD][FOLIO_LOAN_ID]}`}>
                <FormattedMessage id="ui-inn-reach.transaction-detail.field.label.loan" />
              </Link>
            }
          />
        </Col>
      </Row>
    </Accordion>
  );
};

TransactionSummary.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default TransactionSummary;
