import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Pane,
  Row,
  Col,
  AccordionSet,
  Headline,
} from '@folio/stripes-components';
import {
  PatronInformation,
  TransactionSummary,
  ItemInformation,
  ActionMenu,
} from './components';
import {
  TRANSACTION_DETAIL_ACCORDION_STATE,
  FILL_PANE_WIDTH,
  HOLD_FIELDS,
  TRANSACTION_FIELDS,
} from '../../../constants';

const {
  TYPE,
  HOLD,
} = TRANSACTION_FIELDS;

const {
  TITLE,
} = HOLD_FIELDS;

const TransactionDetail = ({
  transaction,
  onClose,
}) => {
  const renderActionMenu = useCallback(({ onToggle }) => (
    <ActionMenu
      transactionType={transaction[TYPE]}
      onToggle={onToggle}
    />
  ), [transaction[TYPE]]);

  return (
    <Pane
      dismissible
      defaultWidth={FILL_PANE_WIDTH}
      actionMenu={renderActionMenu}
      paneTitle={<FormattedMessage id="ui-inn-reach.transaction-detail.title" />}
      onClose={onClose}
    >
      <Row>
        <Col xs={12}>
          <Headline
            size="large"
            tag="h2"
            margin="small"
          >
            {transaction[HOLD]?.[TITLE]}
          </Headline>
        </Col>
      </Row>
      <AccordionSet initialStatus={TRANSACTION_DETAIL_ACCORDION_STATE}>
        <TransactionSummary transaction={transaction} />
        <PatronInformation transaction={transaction} />
        <ItemInformation transaction={transaction} />
      </AccordionSet>
    </Pane>
  );
};

TransactionDetail.propTypes = {
  transaction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TransactionDetail;
