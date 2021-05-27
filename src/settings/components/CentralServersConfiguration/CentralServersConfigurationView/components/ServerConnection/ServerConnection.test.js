import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import ServerConnection from './ServerConnection';

import { translationsProperties } from '../../../../../../../test/jest/helpers';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';

const centralServer = {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
};

const RenderServerConnection = (centralServerData) => {
  return (
    <ServerConnection
      centralServer={centralServerData}
    />
  );
};

describe('ServerConnection component', () => {
  beforeEach(() => (
    renderWithIntl(
      RenderServerConnection(centralServer),
      translationsProperties,
    )
  ));

  it('should be rendered', () => {
    const component = () => renderWithIntl(
      RenderServerConnection(centralServer),
      translationsProperties,
    );

    expect(component()).toBeDefined();
  });

  it('should display `Server connection` section title', () => {
    expect(screen.getByText('Server connection')).toBeInTheDocument();
  });

  it('should display `Central server address` sub title', () => {
    expect(screen.getByText('Central server address')).toBeInTheDocument();
  });

  it('should display correct central server address', () => {
    const centralServerAddress = centralServer.CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS;

    expect(screen.getByText(centralServerAddress)).toBeInTheDocument();
  });

  it('should not display central server address', () => {
    cleanup();

    const testCentralServer = {
      CENTRAL_SERVER_CONFIGURATION_FIELDS: {
        ID: 'id',
        NAME: 'name',
        METADATA: 'metadata',
        DESCRIPTION: 'description',
        LOCAL_SERVER_CODE: 'localServerCode',
        CENTRAL_SERVER_ADDRESS: '',
        LOAN_TYPE_ID: 'loanTypeId',
        LOCAL_AGENCIES: 'localAgencies',
        CENTRAL_SERVER_KEY: 'centralServerKey',
        CENTRAL_SERVER_SECRET: 'centralServerSecret',
        LOCAL_SERVER_KEY: 'localServerKey',
        LOCAL_SERVER_SECRET: 'localServerSecret',
      },
    };

    renderWithIntl(
      RenderServerConnection(testCentralServer),
      translationsProperties,
    );

    const centralServerAddress = centralServer.CENTRAL_SERVER_CONFIGURATION_FIELDS.CENTRAL_SERVER_ADDRESS;

    expect(screen.queryByText(centralServerAddress)).toBeNull();
  });

  describe('accordion', () => {
    it('should be collapsed after click', () => {
      const serverConnectionBtn = document.querySelector('#accordion-toggle-button-serverConnection');

      userEvent.click(serverConnectionBtn);
      expect(serverConnectionBtn.getAttribute('aria-expanded')).toBe('false');
      userEvent.click(serverConnectionBtn);
      expect(serverConnectionBtn.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
