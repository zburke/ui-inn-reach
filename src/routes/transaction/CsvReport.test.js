import React from 'react';
import {
  exportToCsv,
} from '@folio/stripes-components';
import CsvReport from './CsvReport';

const scvReport = new CsvReport({
  intl: {
    formatMessage: jest.fn(({ id }) => id),
    formatTime: jest.fn(({ id }) => id),
  },
});

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  exportToCsv: jest.fn(),
}));

const setUpSpy = jest.spyOn(scvReport, 'setUp');
const toCSVSpy = jest.spyOn(scvReport, 'toCSV');
const parseSpy = jest.spyOn(scvReport, 'parse');
const parseDatesSpy = jest.spyOn(scvReport, 'parseDates');

const transactionsMock = {
  transactions: [
    {
      id: 'b42629b5-738b-4054-9764-3b4380c0b10f',
      centralServerCode: 'd2ir',
      hold: {
        folioItemBarcode: 'A14811392645',
        patronAgencyCode: 'moag1',
        folioItemId: 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
      }
    }
  ]
};

const loansMock = [
  {
    'callNumber': 'K1 .M44',
    'centralServerCode': 'd2ir',
    'effectiveLocation': 'Main Library',
    'hold': {
      'folioItemBarcode': 'A14811392645',
      'folioItemId': 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
      'patronAgencyCode': 'moag1'
    },
    'id': 'b42629b5-738b-4054-9764-3b4380c0b10f',
    'patronAgencyCode': 'Mobi Mobius Agency 1 (moag1)'
  },
];

const csvColumnsForOverdue = [
  'hold.patronId',
  'effectiveLocation',
  'callNumber',
  'hold.folioItemBarcode',
  'hold.title',
  'patronAgencyCode',
  'hold.dueDateTime',
];

const paramsForOverdue = {
  createdDateOp: 'less',
  sortBy: 'transactionTime',
  sortOrder: 'asc',
  state: ['ITEM_RECEIVED', 'BORROWER_RENEW', 'OWNER_RENEW', 'ITEM_IN_TRANSIT', 'ITEM_SHIPPED'],
  type: 'ITEM',
  updatedDate: '2022-03-12T10:00:00.000Z',
};

const mutatorMock = {
  transactionRecords: {
    GET: jest.fn(() => Promise.resolve(transactionsMock)),
    reset: jest.fn(),
  },
};

describe('CsvReport', () => {
  beforeEach(() => {
    exportToCsv.mockClear();
    setUpSpy.mockClear();
    toCSVSpy.mockClear();
    parseSpy.mockClear();
    parseDatesSpy.mockClear();
  });

  describe('generate method', () => {
    const getLoansToCsv = jest.fn(() => Promise.resolve(loansMock));

    describe('overdue', () => {
      beforeEach(async () => {
        await scvReport.generate(mutatorMock, getLoansToCsv, paramsForOverdue, csvColumnsForOverdue);
      });

      it('should call the setUp method', () => {
        expect(setUpSpy).toHaveBeenCalledWith(paramsForOverdue, csvColumnsForOverdue);
      });

      it('should call the transactions', () => {
        expect(mutatorMock.transactionRecords.GET).toHaveBeenCalled();
      });

      it('should call the getLoansToCsv method', () => {
        expect(getLoansToCsv).toHaveBeenCalled();
      });

      it('should call the toCSV method', () => {
        expect(toCSVSpy).toHaveBeenCalledWith(loansMock);
      });

      it('should call the parse method', () => {
        expect(parseSpy).toHaveBeenCalledWith([
          {
            'callNumber': 'K1 .M44',
            'centralServerCode': 'd2ir',
            'effectiveLocation': 'Main Library',
            'hold': {
              'folioItemBarcode': 'A14811392645',
              'folioItemId': 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
              'patronAgencyCode': 'moag1'
            },
            'id': 'b42629b5-738b-4054-9764-3b4380c0b10f',
            'patronAgencyCode': 'Mobi Mobius Agency 1 (moag1)'
          }]);
      });

      it('should call the parseDates method', () => {
        expect(parseDatesSpy).toHaveBeenCalledWith({
          'callNumber': 'K1 .M44',
          'centralServerCode': 'd2ir',
          'effectiveLocation': 'Main Library',
          'hold': {
            'folioItemBarcode': 'A14811392645',
            'folioItemId': 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
            'patronAgencyCode': 'moag1',
          },
          'id': 'b42629b5-738b-4054-9764-3b4380c0b10f',
          'patronAgencyCode': 'Mobi Mobius Agency 1 (moag1)',
        });
      });

      it('should call the exportToCsv function', () => {
        expect(exportToCsv).toHaveBeenCalledWith([
          {
            'callNumber': 'K1 .M44',
            'centralServerCode': 'd2ir',
            'effectiveLocation': 'Main Library',
            'hold': {
              'folioItemBarcode': 'A14811392645',
              'folioItemId': 'f8b6d973-60d4-41ce-a57b-a3884471a6d6',
              'patronAgencyCode': 'moag1'
            },
            'id': 'b42629b5-738b-4054-9764-3b4380c0b10f',
            'patronAgencyCode': 'Mobi Mobius Agency 1 (moag1)'
          }
        ],
        {
          'onlyFields': [{
            'label': 'ui-inn-reach.reports.hold.patronId',
            'value': 'hold.patronId',
          }, {
            'label': 'ui-inn-reach.reports.effectiveLocation',
            'value': 'effectiveLocation'
          }, {
            'label': 'ui-inn-reach.reports.callNumber',
            'value': 'callNumber'
          }, {
            'label': 'ui-inn-reach.reports.hold.folioItemBarcode',
            'value': 'hold.folioItemBarcode'
          }, {
            'label': 'ui-inn-reach.reports.hold.title',
            'value': 'hold.title'
          }, {
            'label': 'ui-inn-reach.reports.patronAgencyCode',
            'value': 'patronAgencyCode'
          }, {
            'label': 'ui-inn-reach.reports.hold.dueDateTime',
            'value': 'hold.dueDateTime'
          }
          ]
        });
      });
    });
  });
});
