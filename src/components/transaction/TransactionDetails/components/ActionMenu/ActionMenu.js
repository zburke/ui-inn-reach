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
  onReceiveUnshippedItem,
  onReceiveItem,
  onReturnItem,
  onCheckoutBorrowingSite,
  onCheckOutToPatron,
  onCancelPatronHold,
  onCancelItemHold,
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
          onCheckoutBorrowingSite={onCheckoutBorrowingSite}
          onCancelItemHold={onCancelItemHold}
        />
      );
      break;
    case LOCAL:
      actions = (
        <LocalActions
          transaction={transaction}
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
  onCancelPatronHold: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onCheckoutBorrowingSite: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ActionMenu;
