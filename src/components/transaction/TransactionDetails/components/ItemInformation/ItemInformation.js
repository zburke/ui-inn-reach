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
  ITEM_INFORMATION,
  TRANSACTION_DETAIL_FIELDS,
} from '../../../../../constants';

const {
  ITEM_ID,
  ITEM_TITLE,
  CENTRAL_ITEM_TYPE,
  AUTHOR,
  CALL_NO,
  ITEM_AGENCY,
} = TRANSACTION_DETAIL_FIELDS;

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
            value={transaction[ITEM_ID] &&
              <Link to="/">
                {transaction[ITEM_ID]}
              </Link>
            }
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemTitle" />}
            value={transaction[ITEM_TITLE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.centralItemType" />}
            value={transaction[CENTRAL_ITEM_TYPE]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.author" />}
            value={transaction[AUTHOR]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.callNo" />}
            value={transaction[CALL_NO]}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-inn-reach.transaction-detail.field.itemAgency" />}
            value={transaction[ITEM_AGENCY]}
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
