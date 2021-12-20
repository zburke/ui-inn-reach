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
}) => {
  let actions;

  switch (transaction[TYPE]) {
    case PATRON:
      actions = (
        <PatronActions
          transaction={transaction}
          onToggle={onToggle}
          onReceiveUnshippedItem={onReceiveUnshippedItem}
        />
      );
      break;
    case ITEM:
      actions = (
        <ItemActions
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
  onReceiveUnshippedItem: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ActionMenu;
