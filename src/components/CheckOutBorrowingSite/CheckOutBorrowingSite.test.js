import { cloneDeep } from 'lodash';
import { createMemoryHistory } from 'history';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import { translationsProperties } from '../../../test/jest/helpers';
import CheckOutBorrowingSite from './CheckOutBorrowingSite';
import {
  ItemForm,
  ListCheckOutItems,
} from './components';
import { NavigationMenu } from '../common';

jest.mock('../common', () => ({
  NavigationMenu: jest.fn(() => <div>NavigationMenu</div>),
}));
jest.mock('./components', () => ({
  ItemForm: jest.fn(() => <div>ItemForm</div>),
  ListCheckOutItems: jest.fn(() => <div>ListCheckOutItems</div>),
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  NavigationMenu: jest.fn(() => <div>NavigationMenu</div>),
  Icon: jest.fn(() => <div>spinner</div>),
  ItemForm: jest.fn(() => <div>ItemForm</div>),
  ListCheckOutItems: jest.fn(() => <div>ListCheckOutItems</div>),
}));

const transactionsMock = {
  transactions: [
    {
      id: 'c6f66467-b9b0-4165-8cde-ec6fe4cfb79d',
      hold: {
        pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
        folioItemBarcode: '1234567',
      },
      metadata: {
        updatedDate: '2021-10-19T07:12:50.858+00:00',
      },
    },
    {
      id: 'e6f66467-b9b0-4165-8cde-ec6fe4cfb79f',
      hold: {
        pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
        folioItemBarcode: '12345678',
      },
      metadata: {
        updatedDate: '2021-12-09T14:31:10.625+00:00',
      },
    },
  ],
};

const checkoutBorroingSiteItemMock = {
  folioCheckOut: {
    item: {
      barcode: '1234567',
      title: 'God Emperor of Dune: Sianoq!',
      location: {
        name: 'Meyer General Collection',
      },
    },
    loanDate: '2021-12-20T12:22:15.623+00:00',
    dueDate: '2022-03-21T23:59:59.000+00:00',
    loanPolicy: {
      name: 'INN-Reach Institutional Loan'
    },
  },
  transaction: {
    hold: {
      pickupLocation: 'cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk',
      folioItemBarcode: '1234567',
    },
  },
};

const resourcesMock = {
  transactionRecords: {
    records: [transactionsMock],
    isPending: false,
    hasLoaded: true,
  },
  checkoutBorroingSiteItem: {
    isPending: false,
  },
  itemBarcode: '',
};

const mutatorMock = {
  itemBarcode: {
    replace: jest.fn(),
  },
  servicePointId: {
    replace: jest.fn(),
  },
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
    reset: jest.fn(),
  },
  checkoutBorroingSiteItem: {
    POST: jest.fn(() => Promise.resolve(checkoutBorroingSiteItemMock)),
  },
};

const itemBarcode = '1234567';
const servicePointId = 'c4c90014-c8c9-4ade-8f24-b5e313319f4b';
const historyMock = createMemoryHistory();

const renderCheckOutBorrowingSite = ({
  resources = resourcesMock,
  mutator = mutatorMock,
  history = historyMock,
  stripes,
} = {}) => {
  return renderWithIntl(
    <CheckOutBorrowingSite
      resources={resources}
      history={history}
      location={{ pathname: '/', hash: '', search: '' }}
      mutator={mutator}
      stripes={stripes}
    />,
    translationsProperties,
  );
};

describe('CheckOutBorrowingSite', () => {
  let stripes;

  beforeEach(() => {
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };

    NavigationMenu.mockClear();
    ItemForm.mockClear();
    ListCheckOutItems.mockClear();
    mutatorMock.transactionRecords.reset.mockClear();
    mutatorMock.checkoutBorroingSiteItem.POST.mockClear();
    mutatorMock.itemBarcode.replace.mockClear();
    mutatorMock.servicePointId.replace.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderCheckOutBorrowingSite({ stripes });

    expect(container).toBeVisible();
  });

  describe('spinner display', () => {
    it('should be visible when loading "transactions"', () => {
      const newResources = cloneDeep(resourcesMock);

      newResources.transactionRecords.isPending = true;
      renderCheckOutBorrowingSite({ resources: newResources, stripes });
      expect(screen.getByText('spinner')).toBeVisible();
    });

    it('should be visible when loading "checked out item"', () => {
      const newResources = cloneDeep(resourcesMock);

      newResources.checkoutBorroingSiteItem.isPending = true;
      renderCheckOutBorrowingSite({ resources: newResources, stripes });
      expect(screen.getByText('spinner')).toBeVisible();
    });
  });

  describe('submit', () => {
    const renderReceiveItem = async (props) => {
      renderCheckOutBorrowingSite({ stripes, ...props });
      await act(async () => { ItemForm.mock.calls[0][0].onSubmit({ itemBarcode }); });
    };

    it('should reset the loanss data', () => {
      renderReceiveItem();
      expect(mutatorMock.transactionRecords.reset).toHaveBeenCalled();
    });

    it('should request transactions with proper parameters', () => {
      renderReceiveItem();
      expect(mutatorMock.transactionRecords.GET).toHaveBeenCalledWith({
        params: {
          itemBarcode,
          type: 'ITEM',
          state: ['ITEM_HOLD', 'TRANSFER'],
          sortBy: 'updatedDate',
          sortOrder: 'desc',
        },
      });
    });

    describe('transactions response processing', () => {
      it('should order the received transactions by date of modification, descending', async () => {
        await renderReceiveItem();
        expect(mutatorMock.itemBarcode.replace).toHaveBeenLastCalledWith(transactionsMock.transactions[0].hold.folioItemBarcode);
      });

      it('should add the service point id to the redux', async () => {
        await renderReceiveItem();
        expect(mutatorMock.servicePointId.replace).toHaveBeenLastCalledWith(servicePointId);
      });

      describe('receive shipped item call', () => {
        it('should return item', async () => {
          await renderReceiveItem();
          expect(mutatorMock.checkoutBorroingSiteItem.POST).toBeCalled();
        });

        it('should pass the received item to the list', async () => {
          await renderReceiveItem();
          expect(ListCheckOutItems.mock.calls[2][0].scannedItems).toEqual([{
            item: {
              barcode: '1234567',
              title: 'God Emperor of Dune: Sianoq!',
              location: {
                name: 'Meyer General Collection',
              },
            },
            loanDate: '2021-12-20T12:22:15.623+00:00',
            dueDate: '2022-03-21T23:59:59.000+00:00',
            loanPolicy: {
              name: 'INN-Reach Institutional Loan'
            },
          }]);
        });

        it('should not be called', async () => {
          const newMutator = cloneDeep(mutatorMock);

          newMutator.transactionRecords.GET = jest.fn(() => Promise.resolve());
          await renderReceiveItem({ mutator: newMutator });
          expect(mutatorMock.checkoutBorroingSiteItem.POST).not.toBeCalled();
        });
      });
    });
  });

  describe('end session button', () => {
    it('should reset data', async () => {
      renderCheckOutBorrowingSite({ stripes });
      await act(async () => { ItemForm.mock.calls[0][0].onSubmit({ itemBarcode }); });
      screen.getByRole('button', { name: 'End session' }).click();
      expect(ListCheckOutItems.mock.calls[3][0].scannedItems).toEqual([]);
    });
  });
});
