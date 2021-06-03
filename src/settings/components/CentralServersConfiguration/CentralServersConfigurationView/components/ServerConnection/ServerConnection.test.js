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
  id: 'testId',
  name: 'testName',
  metadata: 'testMetadata',
  description: 'testDescription',
  localServerCode: 'testLocalServerCode',
  centralServerAddress: 'testCentralServerAddress',
  loanTypeId: 'testLoanTypeId',
  localAgencies: 'testLocalAgencies',
  centralServerKey: 'testCentralServerKey',
  centralServerSecret: 'testCentralServerSecret',
  localServerKey: 'testLocalServerKey',
  localServerSecret: 'testLocalServerSecret',
};

const RenderServerConnection = (centralServerData) => {
  return (
    <ServerConnection
      centralServer={centralServerData}
    />
  );
};

describe('ServerConnection component', () => {
  let renderedServerConnection;

  beforeEach(() => {
    renderedServerConnection = renderWithIntl(
      RenderServerConnection(centralServer),
      translationsProperties,
    );

    return renderedServerConnection;
  });

  it('should be rendered', () => {
    expect(renderedServerConnection).toBeDefined();
  });

  it('should display `Server connection` section title', () => {
    expect(screen.getByText('Server connection')).toBeInTheDocument();
  });

  it('should display `Central server address` sub title', () => {
    expect(screen.getByText('Central server address')).toBeInTheDocument();
  });

  it('should display correct central server address', () => {
    const centralServerAddress = centralServer.centralServerAddress;

    expect(screen.getByText(centralServerAddress)).toBeInTheDocument();
  });

  it('should not display central server address', () => {
    cleanup();

    const testCentralServer = {
      CENTRAL_SERVER_CONFIGURATION_FIELDS: {
        ...CENTRAL_SERVER_CONFIGURATION_FIELDS,
        CENTRAL_SERVER_ADDRESS: '',
      },
    };

    renderWithIntl(
      RenderServerConnection(testCentralServer),
      translationsProperties,
    );

    const centralServerAddress = centralServer.centralServerAddress;

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
