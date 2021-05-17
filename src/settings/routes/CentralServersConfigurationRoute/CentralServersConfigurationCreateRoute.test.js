import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import {
  Route,
  Switch,
} from '@folio/stripes/core';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { translationsProperties } from '../../../../test/jest/helpers';

import CentralServersConfigurationCreateRoute from './CentralServersConfigurationCreateRoute';

const RenderCentralServersConfigurationCreateRoute = () => {
  return (
    <MemoryRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={CentralServersConfigurationCreateRoute}
        />
      </Switch>
    </MemoryRouter>
  );
};

describe('CentralServerConfigurationForm component', () => {
  beforeEach(() => (
    renderWithIntl(
      <MemoryRouter>
        <RenderCentralServersConfigurationCreateRoute />
      </MemoryRouter>,
      translationsProperties,
    )
  ));

  it('should display title', () => {
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });
});
