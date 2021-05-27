import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import GeneralInformation from './GeneralInformation';

import { translationsProperties } from '../../../../../../../test/jest/helpers';

import {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
} from '../../../../../../constants';

import CentralServersConfigurationContext from '../../../../../../contexts/CentralServersConfigurationContext';

const folioLibraries = [
  {
    name: 'Online',
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
  },
  {
    name: 'Welcome',
    id: 'c2549bb4-19c7-4fcc-8b52-39e612fpgfkj',
  },
];

const loanTypes = [
  {
    name: 'Reading room',
    id: 'ac19815e-1d8e-473f-bd5a-3193cb301b8b',
  },
  {
    name: 'mics',
    id: 'e17acc08-b8ca-469a-a984-d9249faad178',
  },
];

const centralServer = {
  CENTRAL_SERVER_CONFIGURATION_FIELDS,
};

const RenderGeneralInformation = () => (
  <CentralServersConfigurationContext.Provider
    value={{
      loanTypes,
      folioLibraries,
    }}
  >
    <GeneralInformation
      centralServer={centralServer}
    />
  </CentralServersConfigurationContext.Provider>
);

describe('GeneralInformation component', () => {
  beforeEach(() => (
    renderWithIntl(
      RenderGeneralInformation(),
      translationsProperties,
    )
  ));

  it('should be rendered', () => {
    const component = () => renderWithIntl(
      RenderGeneralInformation(),
      translationsProperties,
    );

    expect(component()).toBeDefined();
  });

  it('should display `General information` section title', () => {
    expect(screen.getByText('General information')).toBeInTheDocument();
  });

  describe('main accordion', () => {
    it('should be collapsed after click', () => {
      const generalInformationBtn = document.querySelector('#accordion-toggle-button-centralServerGeneralAccordion');

      userEvent.click(generalInformationBtn);
      expect(generalInformationBtn.getAttribute('aria-expanded')).toBe('false');
      userEvent.click(generalInformationBtn);
      expect(generalInformationBtn.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('metadata accordion', () => {
    it('should be collapsed after click', () => {
      const lastUpdatedBtn = document.querySelector('.metaHeaderButton');

      userEvent.click(lastUpdatedBtn);
      expect(lastUpdatedBtn.getAttribute('aria-expanded')).toBe('true');
      userEvent.click(lastUpdatedBtn);
      expect(lastUpdatedBtn.getAttribute('aria-expanded')).toBe('false');
    });
  });

  it('should contain `Name` sub title', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should contain `Description` sub title', () => {
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should contain `Local server code` sub title', () => {
    expect(screen.getByText('Local server code')).toBeInTheDocument();
  });

  it('should contain `Local agency` sub title', () => {
    expect(screen.getByText('Local agency')).toBeInTheDocument();
  });

  it('should contain `FOLIO libraries` sub title', () => {
    expect(screen.getByText('FOLIO libraries')).toBeInTheDocument();
  });

  it('should contain `Borrowed item loan type` sub title', () => {
    expect(screen.getByText('Borrowed item loan type')).toBeInTheDocument();
  });
});
