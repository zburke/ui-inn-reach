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
      aria-label={intl.formatMessage({ id: 'ui-inn-reach.check-out-borrowing-site.actions-menu' })}
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
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.loan-detail" />
      </Button>
      <Button
        buttonStyle="dropdownItem"
      >
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.request-detail" />
      </Button>
      <Button
        buttonStyle="dropdownItem"
      >
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.change-due-date" />
      </Button>
      <Button
        buttonStyle="dropdownItem"
      >
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.transaction-detail" />
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
