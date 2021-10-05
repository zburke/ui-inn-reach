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
  PATRON_INFORMATION,
  TRANSACTION_DETAIL_FIELDS,
} from '../../../../../constants';

const {
  PATRON_ID,
  PATRON_NAME,
  PATRON_TYPE,
  PATRON_AGENCY,
} = TRANSACTION_DETAIL_FIELDS;

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
            value={transaction[PATRON_ID] &&
              <Link to="/">
                {transaction[PATRON_ID]}
              </Link>
            }
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
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronType" />}
            value={transaction[PATRON_TYPE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.patronAgency" />}
            value={transaction[PATRON_AGENCY] &&
              <Link to="/">
                {transaction[PATRON_AGENCY]}
              </Link>
            }
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
