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
  onCancelPatronHold,
  onCancelItemHold,
  onCancelLocalHold,
  onTransferHold,
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
          onCancelPatronHold={onCancelPatronHold}
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
          onCancelItemHold={onCancelItemHold}
          onFinalCheckInItem={onFinalCheckInItem}
          onTransferHold={onTransferHold}
        />
      );
      break;
    case LOCAL:
      actions = (
        <LocalActions
          transaction={transaction}
          onCancelLocalHold={onCancelLocalHold}
          onCheckOutToLocalPatron={onCheckOutToLocalPatron}
          onToggle={onToggle}
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
  onCancelItemHold: PropTypes.func.isRequired,
  onCancelLocalHold: PropTypes.func.isRequired,
  onCancelPatronHold: PropTypes.func.isRequired,
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
