import {
  TOKEN_NAMES,
} from '../../../../constants';

const {
  INN_REACH_PATRON,
  INN_REACH_SERVER,
  INN_REACH_AGENCY,
  INN_REACH_PICKUP_LOCATIONS,
  ITEM,
  EFFECTIVE_LOCATION,
  STAFF_SLIP,
} = TOKEN_NAMES;

const getTokens = () => ({
  [INN_REACH_PATRON]: [
    {
      token: 'innReachTransaction.patronName',
      previewValue: 'Svoom, Liza',
    },
    {
      token: 'innReachTransaction.patronAgencyCode',
      previewValue: 'fl2g1',
    },
    {
      token: 'innReachTransaction.patronAgencyDescription',
      previewValue: 'FOLIO 2 Agency 1',
    },
    {
      token: 'innReachTransaction.patronTypeCode',
      previewValue: '200',
    },
    {
      token: 'innReachTransaction.patronTypeDescription',
      previewValue: 'Patron',
    },
  ],
  [INN_REACH_SERVER]: [
    {
      token: 'innReachTransaction.centralServerCode',
      previewValue: 'd2ir',
    },
    {
      token: 'innReachTransaction.localServerCode',
      previewValue: 'fli01',
    },
  ],
  [INN_REACH_AGENCY]: [
    {
      token: 'innReachTransaction.itemAgencyCode',
      previewValue: 'fl1g1',
    },
    {
      token: 'innReachTransaction.itemAgencyDescription',
      previewValue: 'FOLIO 1 Agency 1',
    },
  ],
  [INN_REACH_PICKUP_LOCATIONS]: [
    {
      token: 'innReachTransaction.pickupLocationCode',
      previewValue: 'fl2g1',
    },
    {
      token: 'innReachTransaction.pickupLocationDisplayName',
      previewValue: 'fli02 Agency 1',
    },
    {
      token: 'innReachTransaction.pickupLocationPrintName',
      previewValue: 'fl2g1 Delivery Stop',
    },
    {
      token: 'innReachTransaction.pickupLocationDeliveryStop',
      previewValue: 'Delivery Stop',
    },
  ],
  [ITEM]: [
    {
      token: 'item.title',
      previewValue: 'Fool moon / Jim Butcher.',
    },
    {
      token: 'item.barcode',
      previewValue: 'MOON2',
    },
    {
      token: 'item.author',
      previewValue: 'Butcher, Jim, 1971',
    },
    {
      token: 'item.effectiveCallNumber',
      previewValue: 'TK7871.15.F4 S67 1988',
    },
    {
      token: 'item.shelvingOrder',
      previewValue: 'shelving order',
    },
    {
      token: 'item.hrid',
      previewValue: 'it00000000029',
    },
  ],
  [EFFECTIVE_LOCATION]: [
    {
      token: 'item.effectiveLocationFolioName',
      previewValue: 'Main Library',
    },
  ],
  [STAFF_SLIP]: [
    {
      token: 'staffSlip.Name',
      previewValue: 'INN-Reach Paging Slip - D2IR',
    },
  ],
});

export default getTokens;
