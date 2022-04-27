import { renderHook, act } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import useReceiveItemModals from './useReceiveItemModals';

const checkinRespMock = {
  folioCheckIn: {
    item: {
      status: {
        name: 'status name',
      },
    },
  },
  barcodeAugmented: false,
};

const staffSlipsMock = [
  { name: 'Hold', template: 'some kind of cold template' },
  { name: 'Transit' },
];

describe('useReceiveItemModals hook', () => {
  let result;

  beforeEach(async () => {
    await act(async () => {
      result = await renderHook(() => useReceiveItemModals(staffSlipsMock)).result;
    });
  });

  it('should return checkinData', async () => {
    const data = {};

    await act(async () => { result.current.onSetCheckinData(data); });
    expect(result.current.checkinData).toEqual(data);
  });

  describe('onProcessModals', () => {
    describe('with augmented barcode', () => {
      const newCheckinResp = cloneDeep(checkinRespMock);

      newCheckinResp.barcodeAugmented = true;

      beforeEach(async () => {
        await act(async () => { result.current.onProcessModals(newCheckinResp); });
      });

      it('should return the isOpenAugmentedBarcodeModal state as true', () => {
        expect(result.current.isOpenAugmentedBarcodeModal).toBeTruthy();
      });

      it('should return the isOpenAugmentedBarcodeModal state as false', async () => {
        await act(async () => { result.current.onSetAugmentedBarcodeModalAfterClose(); });
        expect(result.current.isOpenAugmentedBarcodeModal).toBeFalsy();
      });
    });

    describe('with "Awaiting pickup" status', () => {
      const newCheckinResp = cloneDeep(checkinRespMock);
      let updatedCheckinResp;

      newCheckinResp.folioCheckIn.item.status.name = 'Awaiting pickup';

      beforeEach(async () => {
        await act(async () => { updatedCheckinResp = await result.current.onProcessModals(newCheckinResp); });
      });

      it('should add the isHoldItem prop to the checkinResp', () => {
        expect(updatedCheckinResp).toEqual({
          ...newCheckinResp,
          isHoldItem: true,
        });
      });

      it('should return the isOpenItemHoldModal state as true', () => {
        expect(result.current.isOpenItemHoldModal).toBeTruthy();
      });
    });

    describe('with "In transit" status', () => {
      const newCheckinResp = cloneDeep(checkinRespMock);
      let updatedCheckinResp;

      newCheckinResp.folioCheckIn.item.status.name = 'In transit';

      beforeEach(async () => {
        await act(async () => { updatedCheckinResp = await result.current.onProcessModals(newCheckinResp); });
      });

      it('should add the isTransitItem prop to the checkinResp', () => {
        expect(updatedCheckinResp).toEqual({
          ...newCheckinResp,
          isTransitItem: true,
        });
      });

      it('should return isOpenInTransitModal state as true', () => {
        expect(result.current.isOpenInTransitModal).toBeTruthy();
      });
    });
  });

  describe('onGetSlipTmpl', () => {
    it('should return the "Hold" version template', () => {
      expect(result.current.onGetSlipTmpl('hold')).toBe('some kind of cold template');
    });

    it('should return the empty string', () => {
      expect(result.current.onGetSlipTmpl()).toBe('');
    });
  });

  describe('onCloseModal', () => {
    it('should return the AugmentedModal state as false', async () => {
      const newCheckinResp = cloneDeep(checkinRespMock);

      newCheckinResp.barcodeAugmented = true;
      await act(async () => {
        await result.current.onProcessModals(newCheckinResp);
        result.current.onCloseModal();
      });

      expect(result.current.isOpenAugmentedBarcodeModal).toBeFalsy();
    });

    it('should return the isOpenItemHoldModal state as false', async () => {
      const newCheckinResp = cloneDeep(checkinRespMock);

      newCheckinResp.folioCheckIn.item.status.name = 'Awaiting pickup';
      await act(async () => {
        await result.current.onProcessModals(newCheckinResp);
        result.current.onCloseModal();
      });
      expect(result.current.isOpenItemHoldModal).toBeFalsy();
    });

    it('should return the isOpenInTransitModal state as false', async () => {
      const newCheckinResp = cloneDeep(checkinRespMock);

      newCheckinResp.folioCheckIn.item.status.name = 'In transit';
      await act(async () => {
        await result.current.onProcessModals(newCheckinResp);
        result.current.onCloseModal();
      });
      expect(result.current.isOpenInTransitModal).toBeFalsy();
    });

    it('should return the checkin data as null', async () => {
      await act(async () => {
        await result.current.onSetCheckinData({});
        result.current.onCloseModal();
      });
      expect(result.current.checkinData).toBeNull();
    });
  });
});
