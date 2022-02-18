import {
  FormattedMessage,
} from 'react-intl';
import {
  upperFirst,
} from 'lodash';
import PropTypes from 'prop-types';

import {
  stripesShape,
} from '@folio/stripes/core';

import {
  convertToSlipData,
} from '../../ReceiveShippedItem/utils';
import {
  ConfirmStatusModal,
} from '../../ReceiveShippedItem/components';

const HoldModal = ({
  stripes,
  checkinData,
  intl,
  onGetSlipTmpl,
  onFocusBarcodeField,
  onClose,
}) => {
  const {
    timezone,
    locale,
  } = stripes;
  const {
    folioCheckIn: {
      item,
      staffSlipContext,
    },
  } = checkinData;
  const {
    patronComments,
    servicePointPickup,
  } = staffSlipContext?.request || {};
  const slipData = convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Hold' });
  const messages = [
    <FormattedMessage
      id="ui-inn-reach.shipped-items.modal.hold.message"
      values={{
        title: item.title,
        barcode: item.barcode,
        materialType: upperFirst(item?.materialType?.name || ''),
        pickupServicePoint: servicePointPickup || '',
      }}
    />,
  ];

  if (patronComments) {
    messages.push(
      <FormattedMessage
        id="ui-inn-reach.shipped-items.modal.hold.comment"
        values={{
          comment: patronComments,
          strong: (chunks) => (
            <strong>
              {chunks}
            </strong>
          ),
        }}
      />
    );
  }

  return (
    <ConfirmStatusModal
      isPrintable
      showPrintButton
      label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.hold.heading" />}
      slipTemplate={onGetSlipTmpl('hold')}
      slipData={slipData}
      message={messages}
      onAfterPrint={onFocusBarcodeField}
      onClose={onClose}
    />
  );
};

HoldModal.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  onClose: PropTypes.func.isRequired,
  onGetSlipTmpl: PropTypes.func.isRequired,
  checkinData: PropTypes.object,
  onFocusBarcodeField: PropTypes.func,
};

export default HoldModal;
