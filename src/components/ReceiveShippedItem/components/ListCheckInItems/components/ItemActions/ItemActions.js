import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Button,
  IconButton,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes-components';

import {
  ICONS,
} from '../../../../../../constants';

const ItemActions = ({
  loan,
  intl,
}) => {
  const trigger = ({ getTriggerProps, triggerRef }) => (
    <IconButton
      {...getTriggerProps()}
      icon={ICONS.ELLIPSIS}
      aria-label={intl.formatMessage({ id: 'ui-inn-reach.shipped-items.actions-menu' })}
      id={`available-actions-button-${loan.rowIndex}`}
      ref={triggerRef}
    />
  );

  const menu = ({ onToggle }) => (
    <DropdownMenu
      role="menu"
      aria-label={<FormattedMessage id="ui-inn-reach.available-actions" />}
      onToggle={onToggle}
    >
      <Button
        buttonStyle="dropdownItem"
      >
        <FormattedMessage id="ui-inn-reach.shipped-items.action.print-barcode-slip" />
      </Button>
    </DropdownMenu>
  );

  return (
    <Dropdown
      renderTrigger={trigger}
      renderMenu={menu}
    />
  );
};

ItemActions.propTypes = {
  intl: PropTypes.object.isRequired,
  loan: PropTypes.object.isRequired,
};

export default ItemActions;
