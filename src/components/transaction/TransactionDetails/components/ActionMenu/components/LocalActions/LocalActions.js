import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  ICONS,
} from '../../../../../../../constants';

const LocalActions = ({
  transaction,
  onToggle,
  onCheckout,
  onTransferHold,
  onCancelHold,
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
        disabled
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
    </>
  );
};

LocalActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCancelHold: PropTypes.func,
  onCheckout: PropTypes.func,
  onTransferHold: PropTypes.func,
};

export default LocalActions;
