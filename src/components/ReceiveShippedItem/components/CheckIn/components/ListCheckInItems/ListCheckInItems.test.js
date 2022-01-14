import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import ListCheckInItems from './ListCheckInItems';
import { translationsProperties } from '../../../../../../../test/jest/helpers';
import {
  ItemActions,
} from './components';

jest.mock('./components', () => ({
  ItemActions: jest.fn(() => <div>ItemActions</div>),
}));

const scannedItemsMock = [
  {
    barcodeAugmented: false,
    isTransitItem: false,
    folioCheckIn: {
      item: {
        title: 'God Emperor of Dune: Sianoq!',
        barcode: '5465657801',
      },
    },
    transaction: {
      hold: {
        pickupLocation: 'cd2:Circ Desk 2:Circulation Desk -- Back Entrance:Circ Desk',
      },
    },
  }
];

const intlMock = {
  formatNumber: jest.fn(),
  formatMessage: jest.fn(),
};

const renderListCheckInItems = ({
  scannedItems = scannedItemsMock,
  stripes,
  onGetSlipTemplate,
} = {}) => {
  return renderWithIntl(
    <ListCheckInItems
      scannedItems={scannedItems}
      intl={intlMock}
      stripes={stripes}
      onGetSlipTemplate={onGetSlipTemplate}
    />,
    translationsProperties,
  );
};

describe('ListCheckInItems', () => {
  let commonProps;
  const onGetSlipTemplate = jest.fn(() => '');

  beforeEach(() => {
    ItemActions.mockClear();
    commonProps = {
      stripes: useStripes(),
      onGetSlipTemplate,
    };
  });

  it('should be rendered', () => {
    const { container } = renderListCheckInItems(commonProps);

    expect(container).toBeVisible();
  });

  it('should display barcode', () => {
    renderListCheckInItems(commonProps);
    screen.getByText(scannedItemsMock[0].folioCheckIn.item.barcode);
  });

  it('should display title', () => {
    renderListCheckInItems(commonProps);
    screen.getByText(scannedItemsMock[0].folioCheckIn.item.title);
  });

  it('should display the  pickup location', () => {
    renderListCheckInItems(commonProps);
    screen.getByText(scannedItemsMock[0].transaction.hold.pickupLocation);
  });
});
