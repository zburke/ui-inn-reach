import React from 'react';

import {
  screen,
  render,
  waitFor,
} from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import InnReachSettings from './index';

import { Settings } from './components/Settings';
import { sections } from './components/Settings/constants';

jest.mock('./components/Settings/Settings', () => jest.fn(() => 'Settings'));

const centralServers = [
  {
    centralServerAddress: 'https://rssandbox-api.iii.com',
    centralServerKey: 'b55f2568-e03a-4cc2-8f30-5fb69aa14f5f',
    centralServerSecret: '0c3ae7f3-4e70-4d5d-b94d-5a6605166494',
    id: '5f552f82-91a8-4700-9814-988826d825c9',
    loanTypeId: 'b251de21-7f47-4cf5-82c6-3de6a16a1e05',
    localAgencies: [
      {
        code: 'jtydf',
        folioLibraryIds: ['9e3ccd90-8d64-4c52-8ee8-f09f5d4ebb56'],
        id: '25191092-c427-4c6a-a9c1-6720b97ab3d0',
      },
      {
        code: 'dghse',
        folioLibraryIds: ['0939ebc4-cf37-4968-841e-912c0c02eacf'],
        id: 'e57fbcd1-9b0b-49b4-a429-183d5a8d1ec7',
      },
    ],
    localServerCode: 'tyrea',
    localServerKey: 'ded55ccb-24e7-4d8a-95a1-a510d5fb8681',
    localServerSecret: '$2a$10$.pqjQEIN4ejnzcmYHbqY2eC/1Vqr4ILc5U/PXYkYhksPClbi74OD.',
    name: 'testName',
  },
];

const DEFAULT_MUTATOR = {
  centralServerRecords: {
    GET: jest.fn(() => Promise.resolve([])),
  },
};
const path = '/settings/innreach';

const renderInnReachSettings = (props) => render(
  <InnReachSettings
    match={{ path }}
    mutator={DEFAULT_MUTATOR}
    {...props}
  />
);

describe('InnReachSettings', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    Settings.mockClear();
  });

  it('should display Settings component', async () => {
    await waitFor(() => {
      renderInnReachSettings({ stripes });
    });

    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('should pass required props to Settings', async () => {
    await waitFor(() => {
      renderInnReachSettings({
        stripes,
        mutator: {
          centralServerRecords: {
            GET: jest.fn(() => Promise.resolve(centralServers)),
          },
        }
      });
    });

    expect(Settings.mock.calls[1][0].path).toEqual(path);
    expect(Settings.mock.calls[1][0].sections).toEqual(sections);
  });

  it('should filter sections when there is no central server', async () => {
    await waitFor(() => {
      renderInnReachSettings({ stripes });
    });

    expect(Settings.mock.calls[1][0].sections).not.toEqual(sections);
  });
});
