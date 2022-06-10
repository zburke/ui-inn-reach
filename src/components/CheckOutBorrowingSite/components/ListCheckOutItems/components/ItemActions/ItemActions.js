import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';

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
  setShowChangeDueDateDialog,
  setLoanToChangeDueDate,
}) => {
  const openChangeDueDateDialog = () => {
    setLoanToChangeDueDate(cloneDeep(loan));
    setShowChangeDueDateDialog(true);
  };

  const trigger = ({ getTriggerProps, triggerRef }) => {
    return (
      <IconButton
        {...getTriggerProps()}
        icon={ICONS.ELLIPSIS}
        aria-label={intl.formatMessage({ id: 'ui-inn-reach.check-out-borrowing-site.actions-menu' })}
        id={`available-actions-button-${loan.rowIndex}`}
        ref={triggerRef}
      />
    );
  };

  const menu = ({ onToggle }) => (
    <DropdownMenu
      role="menu"
      aria-label={<FormattedMessage id="ui-inn-reach.available-actions" />}
      onToggle={onToggle}
    >
      <Button
        data-testid="show-loan-details"
        buttonStyle="dropdownItem"
        to={`/users/${loan.userId}/loans/view/${loan.id}`}
      >
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.loan-detail" />
      </Button>
      <Button
        data-testid="change-due-date"
        buttonStyle="dropdownItem"
        onClick={openChangeDueDateDialog}
      >
        <FormattedMessage id="ui-inn-reach.check-out-borrowing-site.action.change-due-date" />
      </Button>
      <Button
        data-testid="transaction-detail"
        buttonStyle="dropdownItem"
        to={`/innreach/transactions/${loan.transactionId}/view`}
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
  setLoanToChangeDueDate: PropTypes.func.isRequired,
  setShowChangeDueDateDialog: PropTypes.func.isRequired,
};

export default ItemActions;
