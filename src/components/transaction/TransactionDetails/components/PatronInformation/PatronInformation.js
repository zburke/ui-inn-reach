import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes-components';
import {
  Link,
} from 'react-router-dom';
import {
  HOLD_FIELDS,
  PATRON_INFORMATION,
  TRANSACTION_FIELDS,
  TRANSACTION_TYPES,
} from '../../../../../constants';

const {
  PATRON,
} = TRANSACTION_TYPES;

const {
  TYPE,
  HOLD,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  PATRON_NAME,
  PATRON_ID,
  CENTRAL_PATRON_TYPE,
  PATRON_AGENCY_CODE,
  FOLIO_PATRON_ID,
} = HOLD_FIELDS;

const PatronInformation = ({
  transaction,
}) => {
  return (
    <Accordion
      id={PATRON_INFORMATION}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.patron" />}
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronId" />}
            value={
              transaction[HOLD]?.[PATRON_ID] &&
              transaction[HOLD]?.[FOLIO_PATRON_ID] &&
              transaction[TYPE] === PATRON
                ? (
                  <Link to={`/users/preview/${transaction[HOLD][FOLIO_PATRON_ID]}`}>
                    {transaction[HOLD][FOLIO_PATRON_ID]}
                  </Link>
                )
                : transaction[HOLD]?.[PATRON_ID]
            }
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
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronType" />}
            value={
              transaction[CENTRAL_SERVER_CODE] &&
              transaction[HOLD]?.[CENTRAL_PATRON_TYPE] &&
              `${transaction[CENTRAL_SERVER_CODE]}: ${transaction[HOLD][CENTRAL_PATRON_TYPE]}`
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronAgency" />}
            value={transaction[HOLD]?.[PATRON_AGENCY_CODE]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

PatronInformation.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default PatronInformation;
