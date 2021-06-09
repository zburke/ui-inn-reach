import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import { useStripes } from '@folio/stripes/core';

import InnReach from './index';
import InnReachSettings from './settings';

jest.mock('./settings', () => jest.fn(() => 'InnReachSettings'));

const path = '/settings/innreach';

const renderPrimeRoutes = (props) => {
  const history = createMemoryHistory();

  history.push(path);

  return render(
    <Router history={history}>
      <InnReach
        {...props}
        showSettings
        match={{
          path,
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
    InnReachSettings.mockClear();
  });

  it('should be rendered', () => {
    const { container, getByText } = renderPrimeRoutes({ stripes });

    expect(container).toBeVisible();
    expect(getByText('InnReachSettings')).toBeDefined();
  });
});
