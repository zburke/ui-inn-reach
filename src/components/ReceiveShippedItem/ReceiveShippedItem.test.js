import { cloneDeep } from 'lodash';
import { createMemoryHistory } from 'history';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import { translationsProperties } from '../../../test/jest/helpers';
import ReceiveShippedItem from './ReceiveShippedItem';
import {
  CheckIn,
  ConfirmStatusModal,
} from './components';

jest.mock('./components', () => ({
  CheckIn: jest.fn(() => <div>CheckIn</div>),
  ConfirmStatusModal: jest.fn(() => <div>ConfirmStatusModal</div>),
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Icon: jest.fn(() => <div>spinner</div>),
}));

const transactionsMock = {
  transactions: [
    {
      id: 'c6f66467-b9b0-4165-8cde-ec6fe4cfb79d',
      hold: {
        pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
      },
      metadata: {
        updatedDate: '2021-10-19T07:12:50.858+00:00',
      },
    },
  ],
};

const receiveShippedItemMock = {
  barcodeAugmented: false,
  folioCheckIn: {
    item: {
      id: 'af9a98ca-82ad-4495-8cd0-e022527f4c16',
      title: 'God Emperor of Dune: Sianoq!',
      materialType: { 'name': 'electronic resource' },
      contributors: [{ 'name': 'INN-Reach author' }],
      holdingsRecordId: '16b3379e-74d9-45b0-9177-fbce478fa904',
      instanceId: 'f6166557-b18f-4959-8e71-cd27f4c6740e',
      barcode: '5465657801',
      location: { 'name': 'D2IR Virtual Location' },
      status: { 'name': 'Awaiting pickup' }
    },
    staffSlipContext: {
      'item': {
        'title': 'God Emperor of Dune: Sianoq!',
        'barcode': '5465657801',
        'status': 'Awaiting pickup',
        'allContributors': 'INN-Reach author',
        'yearCaption': '',
        'materialType': 'electronic resource',
        'loanType': 'INN-Reach items',
        'copy': '',
        'effectiveLocationSpecific': 'D2IR Virtual Location',
        'effectiveLocationLibrary': 'D2IR Library',
        'effectiveLocationCampus': 'D2IR All',
        'effectiveLocationInstitution': 'D2IR Sandbox',
        'lastCheckedInDateTime': '2021-12-19T12:41:12.780Z'
      },
      'request': {
        'requestID': '7e406bd2-e4fb-4fb0-be72-9131520477a2',
        'servicePointPickup': 'Circ Desk 2',
        'holdShelfExpirationDate': '2021-12-24T23:59:59.000Z',
        'patronComments': 'INN-Reach request: Patron Agency - fl1g1, Pickup Location - cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk'
      },
      'requester': {
        'firstName': 'psych',
        'lastName': 'rick',
        'barcode': '123'
      }
    },
  },
  transaction: {
    hold: {
      shippedItemBarcode: '5465657801',
      itemAgencyCode: 'moag1',
      folioItemBarcode: '5465657801',
      pickupLocation: 'cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk',
    },
  },
};

const requestsMock = [
  {
    patronComments: 'INN-Reach request: Patron Agency - fl1g1, Pickup Location - cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk',
    pickupServicePoint: {
      name: 'Circ Desk 2',
    },
  },
];

const resourcesMock = {
  transactionRecords: {
    isPending: false,
  },
  receiveShippedItem: {
    isPending: false,
  },
  transactionId: '',
  servicePoints: {
    records: [],
  },
  staffSlips: {
    records: [],
  },
};

const mutatorMock = {
  transactionId: {
    replace: jest.fn(),
  },
  servicePointId: {
    replace: jest.fn(),
  },
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
    reset: jest.fn(),
  },
  receiveShippedItem: {
    POST: jest.fn(() => Promise.resolve(receiveShippedItemMock)),
  },
  requests: {
    reset: jest.fn(),
    GET: jest.fn(() => Promise.resolve(requestsMock)),
  },
};

const itemBarcode = '5465657771';
const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';
const historyMock = createMemoryHistory();

const renderReceiveShippedItem = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history = historyMock,
  stripes,
} = {}) => {
  return renderWithIntl(
    <ReceiveShippedItem
      resources={resources}
      history={history}
      location={{ pathname: '/', hash: '', search: '' }}
      mutator={mutator}
      stripes={stripes}
    />,
    translationsProperties,
  );
};

const renderWithHoldItem = async (stripes) => {
  renderReceiveShippedItem({ stripes });
  await act(async () => { CheckIn.mock.calls[0][0].onSubmit({ itemBarcode }); });
};

const renderWithTransitItem = async (stripes) => {
  const newReceiveShippedItemMock = cloneDeep(receiveShippedItemMock);

  newReceiveShippedItemMock.folioCheckIn.item.status.name = 'In transit';

  const newMutator = {
    ...mutatorMock,
    receiveShippedItem: {
      POST: jest.fn(() => Promise.resolve(newReceiveShippedItemMock)),
    },
  };

  renderReceiveShippedItem({ stripes, mutator: newMutator });
  await act(async () => { CheckIn.mock.calls[0][0].onSubmit({ itemBarcode }); });
};

const renderWithAugmentedBarcode = async (stripes) => {
  const newReceiveShippedItemMock = cloneDeep(receiveShippedItemMock);

  newReceiveShippedItemMock.barcodeAugmented = true;

  const newMutator = {
    ...mutatorMock,
    receiveShippedItem: {
      POST: jest.fn(() => Promise.resolve(newReceiveShippedItemMock)),
    },
  };

  renderReceiveShippedItem({ stripes, mutator: newMutator });
  await act(async () => { CheckIn.mock.calls[0][0].onSubmit({ itemBarcode }); });
};

describe('ReceiveShippedItem', () => {
  let stripes;

  beforeEach(() => {
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };

    CheckIn.mockClear();
    ConfirmStatusModal.mockClear();
    mutatorMock.transactionRecords.reset.mockClear();
    mutatorMock.receiveShippedItem.POST.mockClear();
    mutatorMock.transactionId.replace.mockClear();
    mutatorMock.servicePointId.replace.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderReceiveShippedItem({ stripes });

    expect(container).toBeVisible();
  });

  describe('submit', () => {
    it('should reset the transactions data', async () => {
      await renderWithHoldItem(stripes);
      expect(mutatorMock.transactionRecords.reset).toHaveBeenCalled();
    });

    it('should request transactions with proper parameters', async () => {
      await renderWithHoldItem(stripes);
      expect(mutatorMock.transactionRecords.GET).toHaveBeenCalledWith({
        params: {
          itemBarcode,
          type: 'PATRON',
          state: 'ITEM_SHIPPED',
          sortBy: 'updatedDate',
          sortOrder: 'desc',
        },
      });
    });

    describe('transactions response processing', () => {
      it('should order the received transactions by date of modification, descending', async () => {
        await renderWithHoldItem(stripes);
        expect(mutatorMock.transactionId.replace).toHaveBeenLastCalledWith(transactionsMock.transactions[0].id);
      });

      it('should add the service point id to the redux', async () => {
        await renderWithHoldItem(stripes);
        expect(mutatorMock.servicePointId.replace).toHaveBeenLastCalledWith(servicePointId);
      });

      describe('receive shipped item call', () => {
        it('should should be called', async () => {
          await renderWithHoldItem(stripes);
          expect(mutatorMock.receiveShippedItem.POST).toBeCalled();
        });

        it('should pass the received hold item to the list', async () => {
          await renderWithHoldItem(stripes);
          expect(CheckIn.mock.calls[3][0].scannedItems).toEqual([{
            ...receiveShippedItemMock,
            isHoldItem: true,
          }]);
        });

        describe('received item', () => {
          it('should be hold', async () => {
            await renderWithHoldItem(stripes);
            expect(CheckIn.mock.calls[3][0].scannedItems).toEqual([{
              ...receiveShippedItemMock,
              isHoldItem: true,
            }]);
          });

          it('should be transit', async () => {
            await renderWithTransitItem(stripes);
            const newReceiveShippedItemMock = cloneDeep(receiveShippedItemMock);

            newReceiveShippedItemMock.folioCheckIn.item.status.name = 'In transit';
            expect(CheckIn.mock.calls[3][0].scannedItems).toEqual([{
              ...newReceiveShippedItemMock,
              isTransitItem: true,
            }]);
          });

          it('should be with augmented barcode', async () => {
            await renderWithAugmentedBarcode(stripes);
            expect(CheckIn.mock.calls[4][0].scannedItems).toEqual([{
              ...receiveShippedItemMock,
              isHoldItem: true,
              barcodeAugmented: true,
            }]);
          });
        });
      });
    });
  });

  describe('end session button', () => {
    it('should reset data', async () => {
      renderReceiveShippedItem({ stripes });
      await act(async () => { CheckIn.mock.calls[0][0].onSessionEnd(); });
      expect(CheckIn.mock.calls[1][0].scannedItems).toEqual([]);
    });
  });

  describe('modal window', () => {
    it('should be when no transaction found', async () => {
      const newMutator = {
        ...mutatorMock,
        transactionRecords: {
          GET: jest.fn(() => Promise.resolve({ transactions: [] })),
          reset: jest.fn(),
        },
      };

      renderReceiveShippedItem({ stripes, mutator: newMutator });
      await act(async () => { CheckIn.mock.calls[0][0].onSubmit({ itemBarcode }); });
      expect(screen.getByText('ConfirmStatusModal')).toBeVisible();
    });

    it('should be when barcode is augmented', async () => {
      await renderWithAugmentedBarcode(stripes);
      expect(screen.getByText('ConfirmStatusModal')).toBeVisible();
    });

    it('should be when the barcode is not augmented and the hold item', async () => {
      await renderWithHoldItem(stripes);
      expect(screen.getByText('ConfirmStatusModal')).toBeVisible();
    });

    it('should be when the transit item', async () => {
      await renderWithTransitItem(stripes);
      expect(screen.getByText('ConfirmStatusModal')).toBeVisible();
    });
  });
});
