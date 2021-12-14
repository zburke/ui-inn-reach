import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Select } from '@folio/stripes/components';
import { translationsProperties } from '../../../../test/jest/helpers';
import NavigationMenu from './NavigationMenu';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Select: jest.fn(() => <div>Select</div>),
}));

const historyMock = createMemoryHistory();
const pushSpy = jest.spyOn(historyMock, 'push');

const transactionsPathname = '/innreach/transactions';
const receiveItemPathname = '/innreach/receive-shipped-item';
const search = '?state=PATRON_HOLD&type=PATRON';

const renderNavigationMenu = ({
  history = historyMock,
  location = { pathname: '/', hash: '', search: '' },
  value,
  dataOptions,
  separator,
} = {}) => {
  return renderWithIntl(
    <NavigationMenu
      history={history}
      location={location}
      value={value}
      dataOptions={dataOptions}
      separator={separator}
    />,
    translationsProperties,
  );
};

describe('NavigationMenu', () => {
  beforeEach(() => {
    Select.mockClear();
  });

  it('should be rendered', () => {
    const { container } = renderNavigationMenu();

    expect(container).toBeVisible();
  });

  describe('navigation', () => {
    it('should be to the /innreach/transactions page with previous search in URL', () => {
      renderNavigationMenu({
        location: {
          pathname: receiveItemPathname,
          hash: '',
          search,
          state: search,
        },
      });
      Select.mock.calls[0][0].onChange({ target: { value: transactionsPathname } });
      expect(pushSpy).toHaveBeenLastCalledWith({
        pathname: transactionsPathname,
        search,
        state: search,
      });
    });

    it('should navigate to the /innreach/receive-shipped-item with search in history state', () => {
      renderNavigationMenu({
        location: {
          pathname: transactionsPathname,
          hash: '',
          search,
          state: search,
        },
      });
      Select.mock.calls[0][0].onChange({ target: { value: receiveItemPathname } });
      expect(pushSpy).toHaveBeenLastCalledWith({
        pathname: receiveItemPathname,
        state: search,
      });
    });
  });

  describe('separator', () => {
    it('should be visible', () => {
      renderNavigationMenu({ separator: true });
      expect(screen.getByTestId('separator')).toBeVisible();
    });

    it('should not be visible', () => {
      renderNavigationMenu();
      expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
    });
  });

  describe('data options', () => {
    it('should be default', () => {
      renderNavigationMenu();
      expect(Select.mock.calls[0][0].dataOptions).toEqual([
        { label: 'INN-Reach transactions', value: '/innreach/transactions' },
        { label: 'Receive shipped items', value: '/innreach/receive-shipped-item' },
      ]);
    });

    it('should not be default', () => {
      const dataOptions = [
        { label: 'JavaScript', value: '/javascript' },
        { label: 'NodeJS', value: '/innreach/nodejs' },
      ];

      renderNavigationMenu({ dataOptions });
      expect(Select.mock.calls[0][0].dataOptions).toEqual(dataOptions);
    });
  });
});
