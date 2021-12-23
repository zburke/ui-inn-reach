import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../../test/jest/helpers';
import CheckIn from './CheckIn';
import {
  ItemForm,
  ListCheckInItems,
} from './components';
import { NavigationMenu } from '../../../common';

jest.mock('../../../common', () => ({
  NavigationMenu: jest.fn(() => <div>NavigationMenu</div>),
}));
jest.mock('./components', () => ({
  ItemForm: jest.fn(() => <div>ItemForm</div>),
  ListCheckInItems: jest.fn(() => <div>ListCheckInItems</div>),
}));

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Icon: jest.fn(() => <div>spinner</div>),
}));

const scannedItemsMock = [{
  isHoldItem: true,
}];

const historyMock = createMemoryHistory();

const renderCheckin = ({
  history = historyMock,
  stripes = {},
  isLoading = false,
  scannedItems = scannedItemsMock,
  onGetSlipTemplate,
  onSessionEnd,
  onSubmit,
} = {}) => {
  return renderWithIntl(
    <CheckIn
      history={history}
      location={{ pathname: '/', hash: '', search: '' }}
      stripes={stripes}
      isLoading={isLoading}
      intl={{}}
      itemFormRef={{ current: null }}
      barcodeRef={{ current: null }}
      scannedItems={scannedItems}
      onGetSlipTemplate={onGetSlipTemplate}
      onSessionEnd={onSessionEnd}
      onSubmit={onSubmit}
    />,
    translationsProperties,
  );
};

describe('CheckIn', () => {
  const onGetSlipTemplate = jest.fn();
  const onSessionEnd = jest.fn();
  const onSubmit = jest.fn();
  const commonProps = {
    onGetSlipTemplate,
    onSessionEnd,
    onSubmit,
  };

  beforeEach(() => {
    NavigationMenu.mockClear();
    ItemForm.mockClear();
    ListCheckInItems.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderCheckin(commonProps);

    expect(container).toBeVisible();
  });

  it('should display a spinner', () => {
    renderCheckin({ isLoading: true });
    expect(screen.getByText('spinner')).toBeVisible();
  });
});
