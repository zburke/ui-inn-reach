import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen, act } from '@testing-library/react';

import { useStripes } from '@folio/stripes/core';

import InnReach from './index';
import { translationsProperties } from '../test/jest/helpers';
import TransactionDetailContainer from './components/transaction/TransactionDetails';

jest.mock('./settings', () => () => 'InnReachSettings');
jest.mock('./components/transaction/TransactionDetails', () => jest.fn(() => <div>TransactionDetailContainer</div>));
jest.mock('@folio/stripes-smart-components/lib/SearchAndSort/components/MultiSelectionFilter', () => {
  return jest.fn(() => <div>MultiSelectionFilter</div>);
});

const renderRoutes = (props) => {
  return renderWithIntl(
    <Router history={props.history || createMemoryHistory()}>
      <InnReach
        match={{
          path: '/',
          params: {},
          url: '',
        }}
        {...props}
      />
    </Router>,
    translationsProperties,
  );
};

describe('InnReach', () => {
  let stripes;

  beforeEach(() => {
    TransactionDetailContainer.mockClear();
    stripes = useStripes();
  });

  describe('setting routes', () => {
    it('should be rendered', () => {
      const { container, getByText } = renderRoutes({ stripes, showSettings: true });

      expect(container).toBeVisible();
      expect(getByText('InnReachSettings')).toBeDefined();
    });
  });

  describe('application routes', () => {
    describe('TransactionDetailContainer route', () => {
      beforeEach(async () => {
        const history = createMemoryHistory();

        history.push('/innreach/transactions/388cd313-cc79-4b48-ba26-8ed84b306a7c/view');

        await act(async () => {
          renderRoutes({
            stripes,
            match: {
              path: '/innreach',
              params: {},
              url: '/innreach',
            },
            history,
          });
        });
      });

      it('should be rendered', () => {
        expect(screen.getByText('TransactionDetailContainer')).toBeVisible();
      });

      it('should have a callback to update the list of transactions', () => {
        expect(TransactionDetailContainer.mock.calls[3][0].onUpdateTransactionList).toBeDefined();
      });
    });
  });
});
