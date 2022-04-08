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
} from './components';

const {
  PATRON,
  ITEM,
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
  onCancelPatronHold: PropTypes.func.isRequired,
  onCheckOutToPatron: PropTypes.func.isRequired,
  onCheckoutBorrowingSite: PropTypes.func.isRequired,
  onReceiveItem: PropTypes.func.isRequired,
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onReturnItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ActionMenu;
