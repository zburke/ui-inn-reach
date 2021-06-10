import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { translationsProperties } from '../../../../test/jest/helpers';
import ContributionCriteriaSelectionRoute from './ContributionCriteriaSelectionRoute';
import { SettingsContext } from '../../../contexts';
import ContributionCriteriaCreateEditRoute from './ContributionCriteriaCreateEditRoute';
import { CONTRIBUTION_CRITERIA } from '../../../constants';

jest.mock('./ContributionCriteriaCreateEditRoute', () => {
  return jest.fn(() => 'ContributionCriteriaCreateEditRoute');
});

const centralServers = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    name: 'testName',
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    name: 'testName2',
  },
];

const centralServersOptions = [
  {
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    value: 'testName',
    label: 'testName'
  },
  {
    id: '0b3a1862-ef3c-4ef4-beba-f6444069a5f5',
    value: 'testName2',
    label: 'testName2'
  }
];

const pagePath = 'settings/innreach/contribution-criteria';
const pathWithId = `${pagePath}/0b3a1862-ef3c-4ef4-beba-f6444069a5f5`;

const renderContributionSelectionRoute = ({
  history,
  path = pagePath,
  pathname = pagePath,
  newPath,
} = {}) => {
  if (newPath) history.push(newPath);

  return renderWithIntl(
    <SettingsContext.Provider value={{ centralServers }}>
      <Router history={history}>
        <ContributionCriteriaSelectionRoute
          match={{ path }}
          location={{ pathname }}
          history={history}
        />
      </Router>
    </SettingsContext.Provider>,
    translationsProperties,
  );
};

describe('ContributionCriteriaSelectionRoute component', () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();

    renderContributionSelectionRoute({ history });
  });

  it('should be rendered', () => {
    expect(screen.getByTestId('selection-pane')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Central server Select central server' })).toBeVisible();
  });

  describe('Selection', () => {
    it('should redirect to the contribution criteria configuration page', () => {
      const historyPushSpy = jest.spyOn(history, 'push');

      document.getElementById(`option-${CONTRIBUTION_CRITERIA.CENTRAL_SERVER_ID}-1-testName2`).click();
      expect(historyPushSpy.mock.calls[0][0]).toEqual(`/${pathWithId}`);
      historyPushSpy.mockClear();
    });
  });

  describe('ContributionCriteriaCreateEditRoute', () => {
    beforeEach(() => {
      renderContributionSelectionRoute({ newPath: pathWithId, history });
    });

    it('should be rendered', () => {
      expect(screen.getByText('ContributionCriteriaCreateEditRoute')).toBeVisible();
    });

    it('should have the corresponding props values', () => {
      expect(ContributionCriteriaCreateEditRoute.mock.calls[0][0].isPristine).toBeTruthy();
      expect(ContributionCriteriaCreateEditRoute.mock.calls[0][0].prevServerName).toEqual('');
      expect(ContributionCriteriaCreateEditRoute.mock.calls[0][0].centralServersOptions).toEqual(centralServersOptions);
    });
  });
});
