import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { useStripes } from '@folio/stripes/core';
import ItemActions from './ItemActions';
import { translationsProperties } from '../../../../../../../../../test/jest/helpers';
import {
  PrintButton,
} from '../../../../../../../common';

jest.mock('../../../../../../../common', () => ({
  PrintButton: jest.fn(() => <div>PrintButton</div>),
}));

const loanMock = {
  barcodeAugmented: false,
  isTransitItem: false,
  folioCheckIn: {
    staffSlipContext: {
      item: {},
      request: {},
      requester: {},
    },
  },
  transaction: {},
  rowIndex: 0,
};

const renderItemActions = ({
  loan = loanMock,
  stripes,
  onGetSlipTemplate,
} = {}) => {
  return renderWithIntl(
    <ItemActions
      loan={loan}
      intl={{ formatMessage: jest.fn() }}
      stripes={stripes}
      onGetSlipTemplate={onGetSlipTemplate}
    />,
    translationsProperties,
  );
};

describe('ItemActions', () => {
  let commonProps;
  const onGetSlipTemplate = jest.fn(() => '');

  beforeEach(() => {
    PrintButton.mockClear();
    commonProps = {
      stripes: useStripes(),
      onGetSlipTemplate,
    };
  });

  it('should be rendered', () => {
    const { container } = renderItemActions(commonProps);

    expect(container).toBeVisible();
  });

  describe('when barcode augmented', () => {
    it('should display the "Print INN-Reach barcode" button', () => {
      renderItemActions({
        ...commonProps,
        loan: {
          ...loanMock,
          barcodeAugmented: true,
          isHoldItem: true,
        },
      });
      expect(PrintButton.mock.calls[0][0]['data-testid']).toBe('print-inn-reach-barcode');
    });

    it('should display the "Print hold slip" button', () => {
      renderItemActions({
        ...commonProps,
        loan: {
          ...loanMock,
          barcodeAugmented: true,
          isHoldItem: true,
        },
      });
      expect(PrintButton.mock.calls[1][0]['data-testid']).toBe('print-hold-slip');
    });

    it('should display the "Print transit slip" button', () => {
      renderItemActions({
        ...commonProps,
        loan: {
          ...loanMock,
          barcodeAugmented: true,
          isTransitItem: true,
        },
      });
      expect(PrintButton.mock.calls[1][0]['data-testid']).toBe('print-transit-slip');
    });
  });

  it('should display "Print hold slip" button', () => {
    renderItemActions({
      ...commonProps,
      loan: {
        ...loanMock,
        isHoldItem: true,
      },
    });
    expect(PrintButton.mock.calls[0][0]['data-testid']).toBe('print-hold-slip');
  });

  it('should display "Print transit slip', () => {
    renderItemActions({
      ...commonProps,
      loan: {
        ...loanMock,
        isTransitItem: true,
      },
    });
    expect(PrintButton.mock.calls[0][0]['data-testid']).toBe('print-transit-slip');
  });
});
