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
  LOCAL_HOLD
} = TRANSACTION_STATUSES;

const LocalActions = ({
  transaction,
  onToggle,
  onCheckout,
  onTransferHold,
  onCancelLocalHold,
}) => {
  return (
    <>
      <ActionItem
        disabled
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckout}
      />
      <ActionItem
        disabled
        icon={ICONS.TRANSFER}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.transfer-hold"
        onToggle={onToggle}
        onClickHandler={onTransferHold}
      />
      <ActionItem
        disabled={transaction[STATUS] !== LOCAL_HOLD}
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelLocalHold}
      />
    </>
  );
};

LocalActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelLocalHold: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCheckout: PropTypes.func,
  onTransferHold: PropTypes.func,
};

export default LocalActions;
