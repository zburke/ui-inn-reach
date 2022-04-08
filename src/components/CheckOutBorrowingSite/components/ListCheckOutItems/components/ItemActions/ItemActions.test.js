import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ItemActions from './ItemActions';
import { translationsProperties } from '../../../../../../../test/jest/helpers';

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
} = {}) => {
  return renderWithIntl(
    <ItemActions
      loan={loan}
      intl={{ formatMessage: jest.fn() }}
    />,
    translationsProperties,
  );
};

describe('ItemActions', () => {
  it('should be rendered', () => {
    const { container } = renderItemActions();

    expect(container).toBeVisible();
  });
});
