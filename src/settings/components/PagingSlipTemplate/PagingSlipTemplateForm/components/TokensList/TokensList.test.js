import React from 'react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { TokensSection } from '@folio/stripes-template-editor';
import { translationsProperties } from '../../../../../../../test/jest/helpers';
import TokensList from './TokensList';

jest.mock('@folio/stripes-template-editor', () => ({
  ...jest.requireActual('@folio/stripes-template-editor'),
  TokensSection: jest.fn(() => <div>TokensSection</div>),
}));

const tokensMock = {
  'effectiveLocation': [
    { 'previewValue': 'Main Library', 'token': 'item.effectiveLocationFolioName' },
  ],
  'innReachAgency': [
    { 'previewValue': 'fl1g1', 'token': 'innReachTransaction.itemAgencyCode' },
    { 'previewValue': 'FOLIO 1 Agency 1', 'token': 'innReachTransaction.itemAgencyDescription' },
  ],
  'innReachPatron': [
    { 'previewValue': 'Svoom, Liza', 'token': 'innReachTransaction.patronName' },
    { 'previewValue': 'fl2g1', 'token': 'innReachTransaction.patronAgencyCode' },
    { 'previewValue': 'FOLIO 2 Agency 1', 'token': 'innReachTransaction.patronAgencyDescription' },
    { 'previewValue': '200', 'token': 'innReachTransaction.patronTypeCode' },
    { 'previewValue': 'Patron', 'token': 'innReachTransaction.patronTypeDescription' }
  ],
  'innReachPickupLocation': [
    { 'previewValue': 'fl2g1', 'token': 'innReachTransaction.pickupLocationCode' },
    { 'previewValue': 'fli02 Agency 1', 'token': 'innReachTransaction.pickupLocationDisplayName' },
    { 'previewValue': 'fl2g1 Delivery Stop', 'token': 'innReachTransaction.pickupLocationPrintName' },
    { 'previewValue': 'Delivery Stop', 'token': 'innReachTransaction.pickupLocationDeliveryStop' },
  ],
  'innReachServer': [
    { 'previewValue': 'd2ir', 'token': 'innReachTransaction.centralServerCode' },
    { 'previewValue': 'fli01', 'token': 'innReachTransaction.localServerCode' }
  ],
  'item': [
    { 'previewValue': 'Fool moon / Jim Butcher.', 'token': 'item.title' },
    { 'previewValue': 'MOON2', 'token': 'item.barcode' },
    { 'previewValue': 'Butcher, Jim, 1971', 'token': 'item.author' },
    { 'previewValue': 'TK7871.15.F4 S67 1988', 'token': 'item.effectiveCallNumber' },
    { 'previewValue': 'shelving order', 'token': 'item.shelvingOrder' },
    { 'previewValue': 'it00000000029', 'token': 'item.hrid' },
  ],
  'staffSlip': [
    { 'previewValue': 'INN-Reach Paging Slip - D2IR', 'token': 'staffSlip.Name' },
  ]
};

const renderTokensList = ({
  tokens = tokensMock,
  intl = { formatMessage: ({ id }) => id },
  onSectionInit,
  onTokenSelect,
} = {}) => {
  return renderWithIntl(
    <TokensList
      tokens={tokens}
      intl={intl}
      onSectionInit={onSectionInit}
      onTokenSelect={onTokenSelect}
    />,
    translationsProperties,
  );
};

describe('TokensList', () => {
  const onSectionInit = jest.fn();
  const onTokenSelect = jest.fn();

  const commonProps = {
    onSectionInit,
    onTokenSelect,
  };

  beforeEach(() => {
    TokensSection.mockClear();
    renderTokensList(commonProps);
  });

  it('should feature an `INN-Reach patron` token', () => {
    const expectedProps = {
      header: 'INN-Reach patron',
      tokens: tokensMock.innReachPatron,
      section: 'innReachPatron',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(1, expectedProps, {});
  });

  it('should feature an `INN-Reach server` token', () => {
    const expectedProps = {
      header: 'INN-Reach server',
      tokens: tokensMock.innReachServer,
      section: 'innReachServer',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(2, expectedProps, {});
  });

  it('should feature an `INN-Reach agency` token', () => {
    const expectedProps = {
      header: 'INN-Reach agency',
      tokens: tokensMock.innReachAgency,
      section: 'innReachAgency',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(3, expectedProps, {});
  });

  it('should feature an `INN-Reach pickup location` token', () => {
    const expectedProps = {
      header: 'INN-Reach pickup location',
      tokens: tokensMock.innReachPickupLocation,
      section: 'innReachPickupLocation',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(4, expectedProps, {});
  });

  it('should feature an `Item` token', () => {
    const expectedProps = {
      header: 'Item',
      tokens: tokensMock.item,
      section: 'item',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(5, expectedProps, {});
  });

  it('should feature an `Effective location` token', () => {
    const expectedProps = {
      header: 'Effective location',
      tokens: tokensMock.effectiveLocation,
      section: 'effectiveLocation',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(6, expectedProps, {});
  });

  it('should feature an `Staff slip` token', () => {
    const expectedProps = {
      header: 'Staff slip',
      tokens: tokensMock.staffSlip,
      section: 'staffSlip',
      onSectionInit,
      onTokenSelect,
    };

    expect(TokensSection).toHaveBeenNthCalledWith(7, expectedProps, {});
  });
});
