import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

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
  HOLD,
} = TRANSACTION_FIELDS;

const {
  TITLE,
} = HOLD_FIELDS;

const TransactionDetail = ({
  transaction,
  onClose,
  onCheckOutBorrowingSite,
  onCheckOutToLocalPatron,
  onCheckOutToPatron,
  onReturnItem,
  onCancelPatronHold,
  onCancelItemHold,
  onFinalCheckInItem,
  onCancelLocalHold,
  onReceiveUnshippedItem,
  onRecallItem,
  onReceiveItem,
  onTransferHold,
}) => {
  const renderActionMenu = useCallback(({ onToggle }) => (
    <ActionMenu
      transaction={transaction}
      onToggle={onToggle}
      onRecallItem={onRecallItem}
      onReceiveUnshippedItem={onReceiveUnshippedItem}
      onReceiveItem={onReceiveItem}
      onCheckOutBorrowingSite={onCheckOutBorrowingSite}
      onCheckOutToPatron={onCheckOutToPatron}
      onCheckOutToLocalPatron={onCheckOutToLocalPatron}
      onFinalCheckInItem={onFinalCheckInItem}
      onReturnItem={onReturnItem}
      onCancelPatronHold={onCancelPatronHold}
      onCancelItemHold={onCancelItemHold}
      onCancelLocalHold={onCancelLocalHold}
      onTransferHold={onTransferHold}
    />
  ), [transaction]);

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
  onCancelItemHold: PropTypes.func.isRequired,
  onCancelLocalHold: PropTypes.func.isRequired,
  onCancelPatronHold: PropTypes.func.isRequired,
  onCheckOutBorrowingSite: PropTypes.func.isRequired,
  onCheckOutToLocalPatron: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFinalCheckInItem: PropTypes.func.isRequired,
  onRecallItem: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onTransferHold: PropTypes.func.isRequired,
};

export default TransactionDetail;
