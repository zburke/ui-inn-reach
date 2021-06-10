import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import { useStripes } from '@folio/stripes/core';

import InnReach from './index';

jest.mock('./settings', () => () => 'InnReachSettings');

const renderPrimeRoutes = (props) => {
  const history = createMemoryHistory();

  return render(
    <Router history={history}>
      <InnReach
        {...props}
        showSettings
        match={{
          path: '/',
          params: {},
          url: '',
        }}
      />
    </Router>
  );
};

describe('InnReach component', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  it('should be rendered', () => {
    const { container, getByText } = renderPrimeRoutes({ stripes });

    expect(container).toBeVisible();
    expect(getByText('InnReachSettings')).toBeDefined();
  });
});
