import { cloneDeep } from 'lodash';
import { createMemoryHistory } from 'history';
import { act, screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import { translationsProperties } from '../../../test/jest/helpers';
import ReceiveShippedItem from './ReceiveShippedItem';
import {
  ItemForm,
  ListCheckInItems,
} from './components';
import { NavigationMenu } from '../common';

jest.mock('../common', () => ({
  NavigationMenu: jest.fn(() => <div>NavigationMenu</div>),
}));
jest.mock('./components', () => ({
  ItemForm: jest.fn(() => <div>ItemForm</div>),
  ListCheckInItems: jest.fn(() => <div>ListCheckInItems</div>),
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  NavigationMenu: jest.fn(() => <div>NavigationMenu</div>),
  Icon: jest.fn(() => <div>spinner</div>),
  ItemForm: jest.fn(() => <div>ItemForm</div>),
  ListCheckInItems: jest.fn(() => <div>ListCheckInItems</div>),
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
    {
      id: 'e6f66467-b9b0-4165-8cde-ec6fe4cfb79f',
      hold: {
        pickupLocation: 'Pickup Loc Code 1:Display Name 1:Print Name 1:Delivery stop 1',
      },
      metadata: {
        updatedDate: '2021-12-09T14:31:10.625+00:00',
      },
    },
  ],
};

const receiveShippedItemMock = {
  folioCheckIn: {
    item: {
      barcode: '5465657766',
      title: 'God Emperor of Dune: Sianoq!',
    },
  },
  transaction: {
    hold: {
      pickupLocation: 'cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk',
    },
  },
};

const resourcesMock = {
  transactionRecords: {
    records: [transactionsMock],
    isPending: false,
    hasLoaded: true,
  },
  receiveShippedItem: {
    isPending: false,
  },
  transactionId: '',
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

describe('ReceiveShippedItem', () => {
  let stripes;

  beforeEach(() => {
    stripes = cloneDeep(useStripes());
    stripes.user.user.curServicePoint = { id: servicePointId };

    NavigationMenu.mockClear();
    ItemForm.mockClear();
    ListCheckInItems.mockClear();
    mutatorMock.transactionRecords.reset.mockClear();
    mutatorMock.receiveShippedItem.POST.mockClear();
    mutatorMock.transactionId.replace.mockClear();
    mutatorMock.servicePointId.replace.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderReceiveShippedItem({ stripes });

    expect(container).toBeVisible();
  });

  describe('spinner display', () => {
    it('should be visible when loading "transactions"', () => {
      const newResources = cloneDeep(resourcesMock);

      newResources.transactionRecords.isPending = true;
      renderReceiveShippedItem({ resources: newResources, stripes });
      expect(screen.getByText('spinner')).toBeVisible();
    });

    it('should be visible when loading "receive shipped item"', () => {
      const newResources = cloneDeep(resourcesMock);

      newResources.receiveShippedItem.isPending = true;
      renderReceiveShippedItem({ resources: newResources, stripes });
      expect(screen.getByText('spinner')).toBeVisible();
    });
  });

  describe('submit', () => {
    const renderReceiveItem = async (props) => {
      renderReceiveShippedItem({ stripes, ...props });
      await act(async () => { ItemForm.mock.calls[0][0].onSubmit({ itemBarcode }); });
    };

    it('should reset the transactions data', () => {
      renderReceiveItem();
      expect(mutatorMock.transactionRecords.reset).toHaveBeenCalled();
    });

    it('should request transactions with proper parameters', () => {
      renderReceiveItem();
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
        await renderReceiveItem();
        expect(mutatorMock.transactionId.replace).toHaveBeenLastCalledWith(transactionsMock.transactions[0].id);
      });

      it('should add the service point id to the redux', async () => {
        await renderReceiveItem();
        expect(mutatorMock.servicePointId.replace).toHaveBeenLastCalledWith(servicePointId);
      });

      describe('receive shipped item call', () => {
        it('should return item', async () => {
          await renderReceiveItem();
          expect(mutatorMock.receiveShippedItem.POST).toBeCalled();
        });

        it('should pass the received item to the list', async () => {
          await renderReceiveItem();
          expect(ListCheckInItems.mock.calls[2][0].scannedItems).toEqual([{
            item: { barcode: '5465657766', title: 'God Emperor of Dune: Sianoq!' },
            pickupLocation: 'cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk'
          }]);
        });

        it('should not be called', async () => {
          const newMutator = cloneDeep(mutatorMock);

          newMutator.transactionRecords.GET = jest.fn(() => Promise.resolve());
          await renderReceiveItem({ mutator: newMutator });
          expect(mutatorMock.receiveShippedItem.POST).not.toBeCalled();
        });
      });
    });
  });

  describe('end session button', () => {
    it('should reset data', async () => {
      renderReceiveShippedItem({ stripes });
      await act(async () => { ItemForm.mock.calls[0][0].onSubmit({ itemBarcode }); });
      screen.getByRole('button', { name: 'End session' }).click();
      expect(ListCheckInItems.mock.calls[3][0].scannedItems).toEqual([]);
    });
  });
});
