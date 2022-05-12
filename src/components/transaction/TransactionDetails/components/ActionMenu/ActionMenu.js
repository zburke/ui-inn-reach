import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuSection,
} from '@folio/stripes-components';
import {
  TRANSACTION_FIELDS,
  TRANSACTION_TYPES,
} from '../../../../../constants';
import {
  PatronActions,
  ItemActions,
  LocalActions,
} from './components';

const {
  PATRON,
  ITEM,
  LOCAL
} = TRANSACTION_TYPES;

const {
  TYPE,
} = TRANSACTION_FIELDS;

const ActionMenu = ({
  transaction,
  onToggle,
  onRecallItem,
  onReceiveUnshippedItem,
  onReceiveItem,
  onReturnItem,
  onFinalCheckInItem,
  onCheckOutBorrowingSite,
  onCheckOutToLocalPatron,
  onCheckOutToPatron,
  onTransferHold,
  onCancelHold,
}) => {
  let actions;

  switch (transaction[TYPE]) {
    case PATRON:
      actions = (
        <PatronActions
          transaction={transaction}
          onToggle={onToggle}
          onReceiveUnshippedItem={onReceiveUnshippedItem}
          onReceiveItem={onReceiveItem}
          onCheckOutToPatron={onCheckOutToPatron}
          onReturnItem={onReturnItem}
          onCancelHold={onCancelHold}
        />
      );
      break;
    case ITEM:
      actions = (
        <ItemActions
          transaction={transaction}
          onToggle={onToggle}
          onCheckOutBorrowingSite={onCheckOutBorrowingSite}
          onRecallItem={onRecallItem}
          onFinalCheckInItem={onFinalCheckInItem}
          onTransferHold={onTransferHold}
          onCancelHold={onCancelHold}
        />
      );
      break;
    case LOCAL:
      actions = (
        <LocalActions
          transaction={transaction}
          onCheckOutToLocalPatron={onCheckOutToLocalPatron}
          onToggle={onToggle}
          onTransferHold={onTransferHold}
          onCancelHold={onCancelHold}
        />
      );
      break;
    default:
      actions = null;
  }

  return (
    <MenuSection>
      {actions}
    </MenuSection>
  );
};

ActionMenu.propTypes = {
  transaction: PropTypes.object.isRequired,
  onCancelHold: PropTypes.func.isRequired,
  onCheckOutBorrowingSite: PropTypes.func.isRequired,
  onCheckOutToLocalPatron: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onFinalCheckInItem: PropTypes.func.isRequired,
  onRecallItem: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTransferHold: PropTypes.func.isRequired,
};

export default ActionMenu;
