import React from 'react';
import { FormattedMessage } from 'react-intl';
import { convertToSlipData } from '../../ReceiveShippedItem/utils';
import { ConfirmStatusModal } from '../../ReceiveShippedItem/components';
import { AUGMENTED_BARCODE_TEMPLATE } from '../../../constants';

const AugmentedBarcodeModal = ({
  intl,
  folioCheckIn: {
    staffSlipContext,
  },
  transaction,
  onClose,
  onClickClose,
  onBeforePrint,
}) => {
  const slipData = convertToSlipData({ staffSlipContext, transaction, intl });
  const messages = [
    <FormattedMessage id="ui-inn-reach.shipped-items.modal.message.barcode-augmented" />,
  ];

  return (
    <ConfirmStatusModal
      isPrintable
      showPrintButton
      label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.barcode-augmented.heading" />}
      checkboxLabel={<FormattedMessage id="ui-inn-reach.shipped-items.field.print-barcode-slip" />}
      slipTemplate={AUGMENTED_BARCODE_TEMPLATE}
      slipData={slipData}
      message={messages}
      onClose={onClose}
      onClickClose={onClickClose}
      onBeforePrint={onBeforePrint}
    />
  );
};

export default AugmentedBarcodeModal;
