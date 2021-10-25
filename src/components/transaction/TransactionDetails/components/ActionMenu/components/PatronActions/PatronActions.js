import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  ICONS,
} from '../../../../../../../constants';

const PatronActions = ({
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
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOut}
      />
      <ActionItem
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-item"
        onToggle={onToggle}
        onClickHandler={onReceiveItem}
      />
      <ActionItem
        icon={ICONS.RECEIVE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.receive-unshipped-item"
        onToggle={onToggle}
        onClickHandler={onReceiveUnshippedItem}
      />
      <ActionItem
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.return-item"
        onToggle={onToggle}
        onClickHandler={onReturnItem}
      />
      <ActionItem
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelHold}
      />
    </>
  );
};

PatronActions.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onCancelHold: PropTypes.func,
  onCheckOut: PropTypes.func,
  onReceiveItem: PropTypes.func,
  onReceiveUnshippedItem: PropTypes.func,
  onReturnItem: PropTypes.func,
};

export default PatronActions;
