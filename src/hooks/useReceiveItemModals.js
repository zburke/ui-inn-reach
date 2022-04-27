import {
  useState,
} from 'react';
import {
  CHECK_IN_STATUSES,
} from '../constants';

const {
  AWAITING_PICKUP,
  IN_TRANSIT,
} = CHECK_IN_STATUSES;

const useReceiveItemModals = (staffSlips) => {
  const [isOpenAugmentedBarcodeModal, setIsOpenAugmentedBarcodeModal] = useState(false);
  const [isHoldItem, setIsHoldItem] = useState(false);
  const [isTransitItem, setIsTransitItem] = useState(false);
  const [isAugmentedBarcodeModalAfterClose, setIsAugmentedBarcodeModalAfterClose] = useState(false);
  const [checkinData, setCheckinData] = useState(null);

  const showHoldOrTransitModal = !isOpenAugmentedBarcodeModal || isAugmentedBarcodeModalAfterClose;
  const isOpenItemHoldModal = isHoldItem && showHoldOrTransitModal;
  const isOpenInTransitModal = isTransitItem && showHoldOrTransitModal;

  const onCloseModal = () => {
    setIsOpenAugmentedBarcodeModal(false);
    setIsHoldItem(false);
    setIsTransitItem(false);
    setIsAugmentedBarcodeModalAfterClose(false);
    setCheckinData(null);
  };

  const onSetAugmentedBarcodeModalAfterClose = () => {
    setIsOpenAugmentedBarcodeModal(false);
    setIsAugmentedBarcodeModalAfterClose(true);
  };

  const onSetCheckinData = (value) => {
    setCheckinData(value);
  };

  const onGetSlipTmpl = (type) => {
    const staffSlip = staffSlips?.find(slip => slip.name.toLowerCase() === type);

    return staffSlip?.template || '';
  };

  const onProcessModals = (checkinResp) => {
    const {
      folioCheckIn: {
        item,
      },
      barcodeAugmented,
    } = checkinResp;

    switch (item?.status?.name) {
      case AWAITING_PICKUP:
        checkinResp.isHoldItem = true;
        setIsHoldItem(true);
        break;
      case IN_TRANSIT:
        checkinResp.isTransitItem = true;
        setIsTransitItem(true);
        break;
      default:
    }

    if (barcodeAugmented) setIsOpenAugmentedBarcodeModal(true);

    return checkinResp;
  };

  return {
    isOpenAugmentedBarcodeModal,
    isOpenItemHoldModal,
    isOpenInTransitModal,
    checkinData,
    onSetCheckinData,
    onGetSlipTmpl,
    onProcessModals,
    onSetAugmentedBarcodeModalAfterClose,
    onCloseModal,
  };
};

export default useReceiveItemModals;
