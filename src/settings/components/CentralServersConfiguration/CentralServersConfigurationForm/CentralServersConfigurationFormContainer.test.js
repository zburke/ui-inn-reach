import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import {
  renderWithIntl,
} from '@folio/stripes-data-transfer-components/test/jest/helpers';
import {
  Route,
  Switch,
} from '@folio/stripes/core';

import CentralServersConfigurationFormContainer from './CentralServersConfigurationFormContainer';
import {
  translationsProperties,
} from '../../../../../test/jest/helpers';

const data = {
  folioLibraries: [
    {
      name: 'Online',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
    },
    {
      name: 'Welcome',
      id: 'c2549bb4-19c7-4fcc-8b52-39e612fpgfkj',
    },
  ],
  loanTypes: [
    {
      name: 'Reading room',
      id: 'ac19815e-1d8e-473f-bd5a-3193cb301b8b',
    },
    {
      name: 'mics',
      id: 'e17acc08-b8ca-469a-a984-d9249faad178',
    },
  ],
};

describe('CentralServerConfigurationFormContainer component', () => {
  const handleSubmit = {
    centralServerRecords: {
      POST: () => Promise.resolve(),
    },
  };

  beforeEach(() => (
    renderWithIntl(
      <MemoryRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={props => {
              return (
                <CentralServersConfigurationFormContainer
                  data={data}
                  mutator={handleSubmit}
                  {...props}
                />
              );
            }
            }
          />
        </Switch>
      </MemoryRouter>,
      translationsProperties,
    )
  ));

  it('should display title', () => {
    expect(screen.getByText('New central server configuration')).toBeDefined();
  });

  it('should have "Save & close" button enabled', () => {
    userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Andromeda');
    userEvent.type(screen.getByRole('textbox', { name: 'Local server code' }), 'tandr');
    userEvent.type(screen.getByRole('textbox', { name: 'Local agency' }), 'tgala');
    userEvent.type(document.querySelector('#FOLIOLibraries-input'), 'Online{enter}');
    userEvent.selectOptions(screen.getByTestId('borrowedItemLoanType'), 'e17acc08-b8ca-469a-a984-d9249faad178');
    userEvent.type(screen.getByRole('textbox', { name: 'Central server address' }), 'https://opentown-lib.edu/andromeda');
    userEvent.type(screen.getByRole('textbox', { name: 'Central server key' }), '1ecea4ca-9eef-4dc2-bc6c-73afc54d051d');
    userEvent.type(screen.getByRole('textbox', { name: 'Central server secret' }), '6ed636c9-eeff-4473-86bd-618430075c25');

    const saveButton = screen.getByTestId('save-button');

    expect(saveButton).toBeEnabled();
    userEvent.click(saveButton);
  });
});
