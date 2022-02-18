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

const InTransitModal = ({
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
  const slipData = convertToSlipData({ staffSlipContext, intl, timezone, locale, slipName: 'Transit' });
  const destinationServicePoint = item?.inTransitDestinationServicePoint?.name || '';
  const messages = [
    <FormattedMessage
      id="ui-inn-reach.shipped-items.modal.transit.message"
      values={{
        title: item.title,
        barcode: item.barcode,
        materialType: upperFirst(item?.materialType?.name || ''),
        servicePoint: destinationServicePoint,
      }}
    />,
  ];

  return (
    <ConfirmStatusModal
      isPrintable
      showPrintButton
      label={<FormattedMessage id="ui-inn-reach.shipped-items.modal.transit.heading" />}
      slipTemplate={onGetSlipTmpl('transit')}
      slipData={slipData}
      message={messages}
      onClose={onClose}
      onAfterPrint={onFocusBarcodeField}
    />
  );
};

InTransitModal.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  onClose: PropTypes.func.isRequired,
  onGetSlipTmpl: PropTypes.func.isRequired,
  checkinData: PropTypes.object,
  onFocusBarcodeField: PropTypes.func,
};

export default InTransitModal;
