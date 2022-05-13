import React from 'react';
import PropTypes from 'prop-types';

import {
  IfPermission,
} from '@folio/stripes/core';

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
  LOCAL_HOLD,
  TRANSFER,
} = TRANSACTION_STATUSES;

const LocalActions = ({
  transaction,
  onToggle,
  onCheckOutToLocalPatron,
  onTransferHold,
  onCancelHold,
}) => {
  return (
    <>
      <ActionItem
        disabled={![LOCAL_HOLD, TRANSFER].includes(transaction[STATUS])}
        icon={ICONS.CHECK_OUT}
        buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.check-out"
        onToggle={onToggle}
        onClickHandler={onCheckOutToLocalPatron}
      />
      <IfPermission perm="ui-requests.moveRequest">
        <ActionItem
          disabled={![LOCAL_HOLD, TRANSFER].includes(transaction[STATUS])}
          icon={ICONS.TRANSFER}
          buttonTextTranslationKey="ui-inn-reach.transaction-detail.local-type.action.transfer-hold"
          onToggle={onToggle}
          onClickHandler={onTransferHold}
        />
      </IfPermission>
      <ActionItem
        disabled={transaction[STATUS] !== LOCAL_HOLD}
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
  onCancelHold: PropTypes.func.isRequired,
  onCheckOutToLocalPatron: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTransferHold: PropTypes.func.isRequired,
};

export default LocalActions;
