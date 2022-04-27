import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionItem,
} from '../../../../../../common';
import {
  HOLD_FIELDS,
  ICONS,
  TRANSACTION_FIELDS,
  TRANSACTION_STATUSES,
} from '../../../../../../../constants';

const {
  STATUS,
  HOLD,
} = TRANSACTION_FIELDS;

const {
  PATRON_HOLD,
  TRANSFER,
  ITEM_SHIPPED,
  ITEM_RECEIVED,
  RECEIVE_UNANNOUNCED,
} = TRANSACTION_STATUSES;

const {
  FOLIO_LOAN_ID,
} = HOLD_FIELDS;

const {
  FOLIO_REQUEST_ID,
} = HOLD_FIELDS;

const PatronActions = ({
  transaction,
  onToggle,
  onCheckOutToPatron,
  onReceiveItem,
  onReceiveUnshippedItem,
  onReturnItem,
  onCancelPatronHold,
}) => {
  return (
    <>
      <ActionItem
        disabled={!(
          !transaction[HOLD][FOLIO_LOAN_ID] &&
          [ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS])
        )}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOutToPatron}
      />
      <ActionItem
        disabled={transaction[STATUS] !== ITEM_SHIPPED}
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
        disabled={![ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS])}
        icon={ICONS.CHECK_IN}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.return-item"
        onToggle={onToggle}
        onClickHandler={onReturnItem}
      />
      <ActionItem
        disabled={!(
          [PATRON_HOLD, ITEM_RECEIVED, RECEIVE_UNANNOUNCED].includes(transaction[STATUS]) &&
          transaction?.[HOLD]?.[FOLIO_REQUEST_ID]
        )}
        icon={ICONS.TIMES_CIRCLE}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.patron-type.action.cancel-hold"
        onToggle={onToggle}
        onClickHandler={onCancelPatronHold}
      />
    </>
  );
};

PatronActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelPatronHold: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func,
};

export default PatronActions;
