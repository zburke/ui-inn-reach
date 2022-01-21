import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  IconButton,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes-components';

import {
  stripesShape,
} from '@folio/stripes/core';
import {
  ICONS,
  AUGMENTED_BARCODE_TEMPLATE,
} from '../../../../../../../../constants';
import {
  PrintButton,
} from '../../../../../../../common';
import {
  convertToSlipData,
} from '../../../../../../utils';

const ItemActions = ({
  loan: {
    barcodeAugmented,
    isHoldItem,
    isTransitItem,
    folioCheckIn: {
      staffSlipContext
    },
    transaction,
    rowIndex,
  },
  intl,
  stripes: {
    timezone,
    locale,
  },
  onGetSlipTemplate,
}) => {
  const trigger = ({ getTriggerProps, triggerRef }) => (
    <IconButton
      {...getTriggerProps()}
      icon={ICONS.ELLIPSIS}
      aria-label={intl.formatMessage({ id: 'ui-inn-reach.shipped-items.actions-menu' })}
      id={`available-actions-button-${rowIndex}`}
      ref={triggerRef}
    />
  );

  const menu = ({ onToggle }) => (
    <DropdownMenu
      role="menu"
      aria-label={<FormattedMessage id="ui-inn-reach.available-actions" />}
      onToggle={onToggle}
    >
      {barcodeAugmented &&
        <PrintButton
          data-testid="print-inn-reach-barcode"
          role="menuitem"
          buttonStyle="dropdownItem"
          template={AUGMENTED_BARCODE_TEMPLATE}
          dataSource={convertToSlipData({ staffSlipContext, transaction })}
        >
          <FormattedMessage id="ui-inn-reach.shipped-items.action.print-inn-reach-barcode" />
        </PrintButton>
      }
      {isHoldItem && !barcodeAugmented &&
        <PrintButton
          data-testid="print-hold-slip"
          role="menuitem"
          buttonStyle="dropdownItem"
          template={onGetSlipTemplate('hold')}
          dataSource={convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Hold' })}
        >
          <FormattedMessage id="ui-inn-reach.shipped-items.action.print-hold-slip" />
        </PrintButton>
      }
      {isTransitItem && !barcodeAugmented &&
        <PrintButton
          data-testid="print-transit-slip"
          role="menuitem"
          buttonStyle="dropdownItem"
          template={onGetSlipTemplate('transit')}
          dataSource={convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Transit' })}
        >
          <FormattedMessage id="ui-inn-reach.shipped-items.action.print-transit-slip" />
        </PrintButton>
      }
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
  stripes: stripesShape.isRequired,
  onGetSlipTemplate: PropTypes.func.isRequired,
};

export default ItemActions;
