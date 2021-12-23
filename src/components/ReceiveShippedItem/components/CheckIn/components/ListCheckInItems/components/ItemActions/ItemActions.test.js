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
  nextRequest: null,
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
      intl={{ formatMessage: () => null }}
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

  it('should display "Print INN-Reach barcode" button', () => {
    renderItemActions({
      ...commonProps,
      loan: {
        ...loanMock,
        barcodeAugmented: true,
      },
    });
    expect(PrintButton.mock.calls[0][0]['data-testid']).toBe('print-inn-reach-barcode');
  });

  it('should display "Print hold slip" button', () => {
    renderItemActions({
      ...commonProps,
      loan: {
        ...loanMock,
        nextRequest: {},
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
