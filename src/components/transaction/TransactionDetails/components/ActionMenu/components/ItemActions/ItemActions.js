import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  ICONS,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
} from '../../../../../../../constants';

const {
  STATUS,
} = TRANSACTION_FIELDS;

const {
  ITEM_HOLD,
  TRANSFER,
  ITEM_SHIPPED,
  ITEM_RECEIVED,
  RECEIVE_UNANNOUNCED,
} = TRANSACTION_STATUSES;

const ItemActions = ({
  transaction,
  onToggle,
  onCheckoutBorrowingSite,
  onTransferHold,
  onRecallItem,
  onCancelHold,
  onFinalCheckIn,
}) => {
  return (
    <>
      <ActionItem
        disabled={![ITEM_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckoutBorrowingSite}
      />
      <ActionItem
        disabled
        icon={ICONS.TRANSFER}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.transfer-hold"
        onToggle={onToggle}
        onClickHandler={onTransferHold}
      />
      <ActionItem
        disabled={
          ![ITEM_SHIPPED, ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(
            transaction[STATUS]
          )
        }
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.recall-item"
        onToggle={onToggle}
        onClickHandler={onRecallItem}
      />
      <ActionItem
        disabled
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
      <ActionItem
        disabled
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.item-type.action.final-check-in"
        onToggle={onToggle}
        onClickHandler={onFinalCheckIn}
      />
    </>
  );
};

ItemActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCancelHold: PropTypes.func,
  onCheckoutBorrowingSite: PropTypes.func,
  onFinalCheckIn: PropTypes.func,
  onRecallItem: PropTypes.func,
  onTransferHold: PropTypes.func,
};

export default ItemActions;
