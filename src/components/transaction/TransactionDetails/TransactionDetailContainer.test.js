import React from 'react';
import { createMemoryHistory } from 'history';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { cloneDeep } from 'lodash';
import { useStripes } from '@folio/stripes/core';
import * as hooks from '../../../hooks';
import { translationsProperties } from '../../../../test/jest/helpers';
import TransactionDetailContainer from './TransactionDetailContainer';
import TransactionDetail from './TransactionDetail';
import {
  ReceiveUnshippedItemModal,
  TransferHoldModal,
} from './components';
import {
  AugmentedBarcodeModal,
  HoldModal,
  InTransitModal,
} from '../../common';

jest.mock('./TransactionDetail', () => {
  return jest.fn(() => <div>TransactionDetail</div>);
});

jest.mock('@folio/stripes-components', () => ({
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));

const onSetAugmentedBarcodeModalAfterClose = jest.fn();
const onCloseModal = jest.fn();
const onSetCheckinData = jest.fn();
const onGetSlipTmpl = jest.fn();
const onProcessModals = jest.fn();

const useReceiveItemModalMockData = {
  isOpenAugmentedBarcodeModal: false,
  isOpenItemHoldModal: false,
  isOpenInTransitModal: false,
  checkinData: {},
  onSetCheckinData,
  onGetSlipTmpl,
  onProcessModals,
  onSetAugmentedBarcodeModalAfterClose,
  onCloseModal,
};

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useReceiveItemModals: jest.fn().mockReturnValue({}),
}));

jest.mock('./components', () => ({
  ...jest.requireActual('./components'),
  ReceiveUnshippedItemModal: jest.fn(() => <div>ReceiveUnshippedItemModal</div>),
  TransferHoldModal: jest.fn(() => <div>TransferHoldModal</div>),
}));

jest.mock('../../common/AugmentedBarcodeModal', () => jest.fn(() => <div>AugmentedBarcodeModal</div>));
jest.mock('../../common/HoldModal', () => jest.fn(() => <div>HoldModal</div>));
jest.mock('../../common/InTransitModal', () => jest.fn(() => <div>InTransitModal</div>));

const transactionMock = {
  id: 'b6f66467-b9b0-4165-8cde-ec6fe4cfb79c',
  centralServerCode: 'd2ir',
  hold: {
    centralItemType: 200,
    centralPatronType: 200,
    id: '0abd066f-51a3-40d0-ba49-4ad3508b47b5',
    itemAgencyCode: 'ydg01',
    itemId: 'it00000000002',
    author: 'Herbert, Frank J',
    metadata: {
      createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
      createdByUsername: 'diku_admin',
      createdDate: '2021-10-19T07:12:51.162+00:00',
    },
    needBefore: 1745467531,
    patronAgencyCode: 'jcg01',
    patronId: 'patron1',
    patronName: 'Brown, Adam',
    pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
    transactionTime: 1544466568,
    title: 'Children of Dune',
    folioRequestId: '78ad79d9-afbb-462a-afb7-a31eb331a371',
    folioLoanId: '829f0791-9c2a-42d5-a2eb-6c3b4a38c1d8',
    folioPatronId: 'b4cee18d-f862-4ef1-95a5-879fdd619603',
    folioItemId: '34bd066f-51a3-40d0-ba49-4ad3508b4778',
    folioInstanceId: 'j7f5ebb7-9285-58f8-bc1e-608ac2080894',
    folioHoldingId: 'w5f5ebb7-9285-58f8-bc1e-608ac2080832',
  },
  metadata: {
    createdByUserId: 'e2f5ebb7-9285-58f8-bc1e-608ac2080861',
    createdByUsername: 'diku_admin',
    createdDate: '2021-10-19T07:12:50.858+00:00',
  },
  state: 'ITEM_HOLD',
  trackingId: '12348',
  type: 'ITEM',
};

const receiveUnshippedItemMock = { foo: '123' };

const resourcesMock = {
  transactionView: {
    records: [transactionMock],
    isPending: false,
  },
  staffSlips: {
    records: [],
  },
};

const receiveItemMock = {
  barcodeAugmented: true,
  folioCheckIn: {
    inHouseUse: false,
    item: {},
    staffSlipContext: {},
    transaction: {},
  },
};

const mutatorMock = {
  servicePointId: {
    replace: jest.fn(),
  },
  transactionId: {
    replace: jest.fn(),
  },
  itemBarcode: {
    replace: jest.fn(),
  },
  folioItemId: {
    replace: jest.fn(),
  },
  receiveUnshippedItem: {
    POST: jest.fn(() => Promise.resolve(receiveUnshippedItemMock)),
  },
  receiveItem: {
    POST: jest.fn(() => Promise.resolve(receiveItemMock)),
  },
  recallItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  checkoutBorroingSiteItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  finalCheckInItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  checkOutToPatron: {
    POST: jest.fn(() => Promise.resolve()),
  },
  checkOutToLocalPatron: {
    POST: jest.fn(() => Promise.resolve()),
  },
  returnPatronHoldItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  cancellationReasons: {
    GET: jest.fn(() => Promise.resolve([{ id: 'b548b182-55c2-4741-b169-616d9cd995a8' }])),
  },
  cancelPatronHold: {
    POST: jest.fn(() => Promise.resolve()),
  },
  transferItem: {
    POST: jest.fn(() => Promise.resolve()),
  },
  cancelItemHold: {
    POST: jest.fn(() => Promise.resolve()),
  },
  cancelLocalHold: {
    POST: jest.fn(() => Promise.resolve()),
  },
};

const historyMock = createMemoryHistory();
const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';
const itemBarcode = '12345';

const renderTransactionDetailContainer = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history = historyMock,
  stripes,
  onUpdateTransactionList,
} = {}) => {
  return renderWithIntl(
    <TransactionDetailContainer
      resources={resources}
      mutator={mutator}
      history={history}
      location={{ pathname: '/' }}
      stripes={stripes}
      onUpdateTransactionList={onUpdateTransactionList}
    />,
    translationsProperties,
  );
};

describe('TransactionDetailContainer', () => {
  const onUpdateTransactionList = jest.fn();
  let stripes;

  const commonProps = {
    stripes,
    onUpdateTransactionList,
  };

  beforeEach(() => {
    hooks.useReceiveItemModals.mockClear().mockReturnValue(useReceiveItemModalMockData);
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };
    TransactionDetail.mockClear();
    mutatorMock.recallItem.POST.mockClear();
    mutatorMock.returnPatronHoldItem.POST.mockClear();
    mutatorMock.cancellationReasons.GET.mockClear();
    mutatorMock.cancelPatronHold.POST.mockClear();
    mutatorMock.cancelItemHold.POST.mockClear();
    mutatorMock.cancelLocalHold.POST.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderTransactionDetailContainer(commonProps);

    expect(container).toBeVisible();
  });

  it('should display loading', async () => {
    const newResources = cloneDeep(resourcesMock);

    newResources.transactionView.isPending = true;
    renderTransactionDetailContainer({
      ...commonProps,
      resources: newResources,
    });
    expect(screen.getByText('LoadingPane')).toBeVisible();
  });

  it('should write transaction id to the redux', () => {
    renderTransactionDetailContainer(commonProps);
    expect(mutatorMock.transactionId.replace).toHaveBeenLastCalledWith(transactionMock.id);
  });

  it('should write service point id to the redux', () => {
    renderTransactionDetailContainer({ ...commonProps, stripes });
    expect(mutatorMock.servicePointId.replace).toHaveBeenCalledWith(servicePointId);
  });

  describe('closing the current page', () => {
    it('should navigate to the page with a list of transactions', () => {
      const history = createMemoryHistory();

      renderTransactionDetailContainer({
        ...commonProps,
        history,
      });
      TransactionDetail.mock.calls[0][0].onClose();
      expect(history.location.pathname).toBe('/innreach/transactions');
    });
  });

  describe('receive unshipped item', () => {
    beforeEach(async () => {
      ReceiveUnshippedItemModal.mockClear();
      InTransitModal.mockClear();
      HoldModal.mockClear();
      AugmentedBarcodeModal.mockClear();
    });

    const renderForReceiveUnshippedItem = async () => {
      renderTransactionDetailContainer(commonProps);
      await act(async () => { TransactionDetail.mock.calls[0][0].onReceiveUnshippedItem(); });
      await act(async () => { ReceiveUnshippedItemModal.mock.calls[0][0].onSubmit({ itemBarcode }); });
    };

    it('should display "In Transit" modal', async () => {
      jest.spyOn(hooks, 'useReceiveItemModals').mockReturnValue({
        ...useReceiveItemModalMockData,
        isOpenInTransitModal: true,
      });
      await renderForReceiveUnshippedItem();
      expect(screen.getByText('InTransitModal')).toBeVisible();
    });

    it('should display "Augmented Barcode" modal', async () => {
      jest.spyOn(hooks, 'useReceiveItemModals').mockReturnValue({
        ...useReceiveItemModalMockData,
        isOpenAugmentedBarcodeModal: true,
      });
      await renderForReceiveUnshippedItem();
      expect(screen.getByText('AugmentedBarcodeModal')).toBeVisible();
    });

    it('should display "Hold" modal', async () => {
      jest.spyOn(hooks, 'useReceiveItemModals').mockReturnValue({
        ...useReceiveItemModalMockData,
        isOpenItemHoldModal: true,
      });
      await renderForReceiveUnshippedItem();
      expect(screen.getByText('HoldModal')).toBeVisible();
    });

    it('should write item barcode to the redux', async () => {
      await renderForReceiveUnshippedItem();
      expect(mutatorMock.itemBarcode.replace).toHaveBeenCalledWith(itemBarcode);
    });

    it('should update the transaction state', async () => {
      await renderForReceiveUnshippedItem();
      expect(mutatorMock.receiveUnshippedItem.POST).toHaveBeenCalled();
    });

    it('should close the "unshipped item" modal', async () => {
      await renderForReceiveUnshippedItem();
      expect(screen.queryByText('ReceiveUnshippedItemModal')).toBeNull();
    });

    it('should pass the unshipped item data', async () => {
      await renderForReceiveUnshippedItem();
      expect(onSetCheckinData).toHaveBeenLastCalledWith(receiveUnshippedItemMock);
    });

    it('should update the transaction list', async () => {
      await renderForReceiveUnshippedItem();
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });

    it('should process the response for modals', async () => {
      await renderForReceiveUnshippedItem();
      expect(onProcessModals).toHaveBeenLastCalledWith(receiveUnshippedItemMock);
    });
  });

  describe('receive item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onReceiveItem();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.receiveItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });

    it('should pass the "receive item" data', () => {
      expect(onSetCheckinData).toHaveBeenLastCalledWith(receiveItemMock);
    });

    it('should process the response for modals', () => {
      expect(onProcessModals).toHaveBeenLastCalledWith(receiveItemMock);
    });
  });

  describe('recall item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onRecallItem();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.recallItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('checkout to borrowing site item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCheckOutBorrowingSite();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.checkoutBorroingSiteItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('final check in item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onFinalCheckInItem();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.finalCheckInItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('return patron hold item', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onReturnItem();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.returnPatronHoldItem.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('checkout to patron', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCheckOutToPatron();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.checkOutToPatron.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('checkout to local patron', () => {
    beforeEach(() => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCheckOutToLocalPatron();
    });

    it('should update the transaction state', () => {
      expect(mutatorMock.checkOutToLocalPatron.POST).toHaveBeenCalled();
    });

    it('should update the transaction list', () => {
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('cancel patron hold', () => {
    it('should cause cancellation reasons', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelPatronHold();
      expect(mutatorMock.cancellationReasons.GET).toHaveBeenCalled();
    });

    it('should update the transaction state', async () => {
      renderTransactionDetailContainer(commonProps);
      await act(async () => { TransactionDetail.mock.calls[0][0].onCancelPatronHold(); });
      expect(mutatorMock.cancelPatronHold.POST).toHaveBeenCalledWith({
        cancellationReasonId: 'b548b182-55c2-4741-b169-616d9cd995a8',
        cancellationAdditionalInformation: 'Cancelled by staff',
      });
    });

    it('should not update the transaction state if the response has more than one reason', () => {
      const newMutator = {
        ...mutatorMock,
        cancellationReasons: {
          GET: jest.fn(() => Promise.resolve([
            { id: 'b548b182-55c2-4741-b169-616d9cd995a8' },
            { id: 'p248b182-87v2-8442-c149-616d9cd995m4' },
          ])),
        },
      };

      renderTransactionDetailContainer({
        ...commonProps,
        mutator: newMutator,
      });
      TransactionDetail.mock.calls[0][0].onCancelPatronHold();
      expect(mutatorMock.cancelPatronHold.POST).not.toBeCalled();
    });

    it('should update the transaction list', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelPatronHold();
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('cancel local hold', () => {
    it('should cause cancellation reasons', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelLocalHold();
      expect(mutatorMock.cancellationReasons.GET).toHaveBeenCalled();
    });

    it('should update the transaction state', async () => {
      renderTransactionDetailContainer(commonProps);
      await act(async () => { TransactionDetail.mock.calls[0][0].onCancelLocalHold(); });
      expect(mutatorMock.cancelLocalHold.POST).toHaveBeenCalledWith({
        cancellationReasonId: 'b548b182-55c2-4741-b169-616d9cd995a8',
        cancellationAdditionalInformation: 'Owning site cancels request',
      });
    });

    it('should not update the transaction state if the response has more than one reason', () => {
      const newMutator = {
        ...mutatorMock,
        cancellationReasons: {
          GET: jest.fn(() => Promise.resolve([
            { id: 'b548b182-55c2-4741-b169-616d9cd995a8' },
            { id: 'p248b182-87v2-8442-c149-616d9cd995m4' },
          ])),
        },
      };

      renderTransactionDetailContainer({
        ...commonProps,
        mutator: newMutator,
      });
      TransactionDetail.mock.calls[0][0].onCancelLocalHold();
      expect(mutatorMock.cancelLocalHold.POST).not.toBeCalled();
    });

    it('should update the transaction list', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelLocalHold();
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('cancel item hold', () => {
    it('should cause cancellation reasons', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelItemHold();
      expect(mutatorMock.cancellationReasons.GET).toHaveBeenCalled();
    });

    it('should update the transaction state', async () => {
      renderTransactionDetailContainer(commonProps);
      await act(async () => { TransactionDetail.mock.calls[0][0].onCancelItemHold(); });
      expect(mutatorMock.cancelItemHold.POST).toHaveBeenCalledWith({
        cancellationReasonId: 'b548b182-55c2-4741-b169-616d9cd995a8',
        cancellationAdditionalInformation: 'Owning site cancels request',
      });
    });

    it('should not update the transaction state if the response has more than one reason', () => {
      const newMutator = {
        ...mutatorMock,
        cancellationReasons: {
          GET: jest.fn(() => Promise.resolve([
            { id: 'b548b182-55c2-4741-b169-616d9cd995a8' },
            { id: 'p248b182-87v2-8442-c149-616d9cd995m4' },
          ])),
        },
      };

      renderTransactionDetailContainer({
        ...commonProps,
        mutator: newMutator,
      });
      TransactionDetail.mock.calls[0][0].onCancelItemHold();
      expect(mutatorMock.cancelItemHold.POST).not.toBeCalled();
    });

    it('should update the transaction list', () => {
      renderTransactionDetailContainer(commonProps);
      TransactionDetail.mock.calls[0][0].onCancelItemHold();
      expect(onUpdateTransactionList).toHaveBeenCalled();
    });
  });

  describe('transfer item', () => {
    it('should write folioItemId to the redux', () => {
      renderTransactionDetailContainer(commonProps);
      expect(mutatorMock.folioItemId.replace).toHaveBeenCalledWith(transactionMock.hold.folioItemId);
    });

    describe('list item selection', () => {
      beforeEach(async () => {
        TransferHoldModal.mockClear();
        renderTransactionDetailContainer(commonProps);
        await act(async () => { TransactionDetail.mock.calls[0][0].onTransferHold(); });
        await act(async () => { TransferHoldModal.mock.calls[0][0].onRowClick(); });
      });

      it('should close the "Transfer hold" modal', () => {
        expect(screen.queryByText('TransferHoldModal')).toBeNull();
      });

      it('should update the transaction', () => {
        expect(mutatorMock.transferItem.POST).toHaveBeenCalled();
      });

      it('should update the transaction list', () => {
        expect(onUpdateTransactionList).toHaveBeenCalled();
      });
    });
  });
});
