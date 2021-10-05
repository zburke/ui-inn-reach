import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ViewMetaData,
} from '@folio/stripes-smart-components';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
  FormattedDate,
  FormattedTime,
} from '@folio/stripes-components';
import {
  Link,
} from 'react-router-dom';
import {
  TRANSACTION_DETAIL_FIELDS,
  TRANSACTION_SUMMARY,
} from '../../../../../constants';

const {
  METADATA,
  TRANSACTION_TIME,
  TRACKING_ID,
  TYPE,
  STATUS,
  PATRON_NAME,
  PICKUP_LOCATION,
  REQUEST,
  LOAN,
} = TRANSACTION_DETAIL_FIELDS;

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
            value={transaction[TRANSACTION_TIME] &&
              <FormattedMessage
                id="ui-inn-reach.transaction-detail.field.label.time"
                values={{
                  date: <FormattedDate value={transaction[TRANSACTION_TIME]} />,
                  time: <FormattedTime value={transaction[TRANSACTION_TIME]} />,
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
              <FormattedMessage id={`ui-inn-reach.transaction.field.label.transactionType.${transaction[TYPE]}`} />
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
            value={transaction[PATRON_NAME]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.pickupLocation" />}
            value={transaction[PICKUP_LOCATION]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.request" />}
            value={transaction[REQUEST] &&
              <Link to="/">
                <FormattedMessage id="ui-inn-reach.transaction-detail.field.label.request" />
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.loan" />}
            value={transaction[LOAN] &&
              <Link to="/">
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
