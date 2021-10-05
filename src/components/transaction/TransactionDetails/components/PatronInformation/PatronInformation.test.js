import React from 'react';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Router } from 'react-router';
import { translationsProperties } from '../../../../../../test/jest/helpers';
import PatronInformation from './PatronInformation';

const transactionMock = {
  patronId: '111222333',
  patronName: 'Brown, Adam',
  patronType: 'Jon (123)',
  patronAgency: 'Jane (234)',
};

const history = createMemoryHistory();

const renderPatronInformation = ({
  transaction = transactionMock,
} = {}) => {
  return renderWithIntl(
    <Router history={history}>
      <PatronInformation
        transaction={transaction}
      />
    </Router>,
    translationsProperties,
  );
};

describe('PatronInformation', () => {
  beforeEach(() => {
    renderPatronInformation();
  });

  it('should show the transaction patron id', () => {
    expect(screen.getByText('111222333')).toBeVisible();
  });

  it('should show the transaction patron name', () => {
    expect(screen.getByText('Brown, Adam')).toBeVisible();
  });

  it('should show the transaction patron type', () => {
    expect(screen.getByText('Jon (123)')).toBeVisible();
  });

  it('should show the transaction patron agency', () => {
    expect(screen.getByText('Jane (234)')).toBeVisible();
  });
});
