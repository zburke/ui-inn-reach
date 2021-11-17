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
  ITEM_INFORMATION,
  TRANSACTION_FIELDS,
} from '../../../../../constants';

const {
  HOLD,
  CENTRAL_SERVER_CODE,
} = TRANSACTION_FIELDS;

const {
  ITEM_ID,
  TITLE,
  CENTRAL_ITEM_TYPE,
  AUTHOR,
  CALL_NUMBER,
  ITEM_AGENCY_CODE,
  FOLIO_ITEM_ID,
  FOLIO_INSTANCE_ID,
  FOLIO_HOLDING_ID,
} = HOLD_FIELDS;

const ItemInformation = ({
  transaction,
}) => {
  return (
    <Accordion
      id={ITEM_INFORMATION}
      label={<FormattedMessage id="ui-inn-reach.transaction-detail.accordion.item" />}
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemId" />}
            value={
              transaction[HOLD]?.[ITEM_ID] &&
              transaction[HOLD]?.[FOLIO_ITEM_ID] &&
              transaction[HOLD]?.[FOLIO_INSTANCE_ID] &&
              transaction[HOLD]?.[FOLIO_HOLDING_ID] &&
              <Link to={`/inventory/view/${transaction[HOLD][FOLIO_INSTANCE_ID]}/${transaction[HOLD][FOLIO_HOLDING_ID]}/${transaction[HOLD][FOLIO_ITEM_ID]}`}>
                {transaction[HOLD][ITEM_ID]}
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemTitle" />}
            value={transaction[HOLD]?.[TITLE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.centralItemType" />}
            value={transaction[HOLD]?.[CENTRAL_ITEM_TYPE] &&
              `${transaction[CENTRAL_SERVER_CODE]}: ${transaction[HOLD][CENTRAL_ITEM_TYPE]}`
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.author" />}
            value={transaction[HOLD]?.[AUTHOR]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.callNo" />}
            value={transaction[HOLD]?.[CALL_NUMBER]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemAgency" />}
            value={transaction[HOLD]?.[ITEM_AGENCY_CODE]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemInformation.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default ItemInformation;
