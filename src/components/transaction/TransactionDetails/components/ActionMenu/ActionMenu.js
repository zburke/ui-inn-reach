import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuSection,
} from '@folio/stripes-components';
import {
  TRANSACTION_TYPES,
} from '../../../../../constants';
import {
  PatronActions,
} from './components';

const {
  ITEM,
  PATRON,
  LOCAL,
} = TRANSACTION_TYPES;

const ActionMenu = ({
  onToggle,
  transactionType,
}) => {
  let actions;

  switch (transactionType) {
    case ITEM:
      actions = null;
      break;
    case PATRON:
      actions = (
        <PatronActions
          onToggle={onToggle}
        />
      );
      break;
    case LOCAL:
      actions = null;
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
  transactionType: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ActionMenu;
