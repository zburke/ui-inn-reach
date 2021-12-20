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
  PATRON_HOLD,
  TRANSFER,
} = TRANSACTION_STATUSES;

const PatronActions = ({
  transaction,
  onToggle,
  onCheckOut,
  onReceiveItem,
  onReceiveUnshippedItem,
  onReturnItem,
  onCancelHold,
}) => {
  return (
    <>
      <ActionItem
        disabled
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOut}
      />
      <ActionItem
        disabled
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-item"
        onToggle={onToggle}
        onClickHandler={onReceiveItem}
      />
      <ActionItem
        disabled={![PATRON_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-unshipped-item"
        onToggle={onToggle}
        onClickHandler={onReceiveUnshippedItem}
      />
      <ActionItem
        disabled
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.return-item"
        onToggle={onToggle}
        onClickHandler={onReturnItem}
      />
      <ActionItem
        disabled
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
    </>
  );
};

PatronActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCancelHold: PropTypes.func,
  onCheckOut: PropTypes.func,
  onReceiveItem: PropTypes.func,
  onReceiveUnshippedItem: PropTypes.func,
  onReturnItem: PropTypes.func,
};

export default PatronActions;
