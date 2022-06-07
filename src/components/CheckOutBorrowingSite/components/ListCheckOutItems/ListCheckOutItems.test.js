import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ListCheckOutItems from './ListCheckOutItems';
import {
  ItemActions,
} from './components';
import { translationsProperties } from '../../../../../test/jest/helpers';

jest.mock('./components', () => ({
  ItemActions: jest.fn(() => <div>ItemActions</div>),
}));

const scannedItemsMock = [
  {
    item: {
      title: 'God Emperor of Dune: Sianoq!',
      barcode: '5465657801',
      location: { name: 'location name' },
    },
    loanDate: '2019-08-24T14:15:22Z',
    dueDate: '2019-08-24T14:15:22Z',
    loanPolicy: { name: 'loan policy name' },
    transactionId: 'testId',
  },
];

const intlMock = {
  formatNumber: jest.fn(),
  formatMessage: jest.fn(),
};

const setShowChangeDueDateDialogMock = jest.fn();
const setLoanToChangeDueDateMock = jest.fn();

const renderListCheckOutItems = ({
  scannedItems = scannedItemsMock,
} = {}) => {
  return renderWithIntl(
    <ListCheckOutItems
      scannedItems={scannedItems}
      intl={intlMock}
      setShowChangeDueDateDialog={setShowChangeDueDateDialogMock}
      setLoanToChangeDueDate={setLoanToChangeDueDateMock}
    />,
    translationsProperties,
  );
};

describe('ListCheckOutItems', () => {
  let commonProps;

  beforeEach(() => {
    ItemActions.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderListCheckOutItems(commonProps);

    expect(container).toBeVisible();
  });

  it('should display barcode', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText(scannedItemsMock[0].item.barcode)).toBeVisible();
  });

  it('should display title', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText(scannedItemsMock[0].item.title)).toBeVisible();
  });

  it('should display the loan policy', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText(scannedItemsMock[0].loanPolicy.name)).toBeVisible();
  });

  it('should display the due date', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText('8/24/2019')).toBeVisible();
  });

  it('should display the loan date', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText('2:15 PM')).toBeVisible();
  });

  it('should display the location', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText(scannedItemsMock[0].item.location.name)).toBeVisible();
  });

  it('should display the item actions', () => {
    renderListCheckOutItems(commonProps);
    expect(screen.getByText('ItemActions')).toBeVisible();
  });
});
