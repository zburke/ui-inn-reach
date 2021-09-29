import {
  validateServerCode,
  validateLocalAgency,
} from './formValidation';
import { DEFAULT_VALUES } from '../../../../routes/CentralServersConfigurationRoute/CentralServersConfigurationCreateEditContainer';

describe('formValidation utils', () => {
  describe('validateServerCode', () => {
    it('should return the correct value', () => {
      expect(validateServerCode()).toBeDefined();
      expect(validateServerCode('asdfg')).toBeUndefined();
      expect(validateServerCode('1aSdfdge')).toBeDefined();
    });
  });

  describe('validateLocalAgency', () => {
    it('should return error if all fields are empty', () => {
      expect(validateLocalAgency(DEFAULT_VALUES.localAgencies).localAgencies[0].localAgency).toBeDefined();
      expect(validateLocalAgency(DEFAULT_VALUES.localAgencies).localAgencies[0].FOLIOLibraries).toBeDefined();
    });

    it('should return error if only "Local Agency" is empty', () => {
      const valuesWithEmptyLocalAgency = [
        {
          localAgency: '',
          FOLIOLibraries: [{ label: 'Bostock', value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3' }],
        },
      ];

      expect(validateLocalAgency(valuesWithEmptyLocalAgency).localAgencies[0].localAgency).toBeDefined();
    });

    it('should return error if only "FOLIO libraries is empty', () => {
      const valuesWithEmptyFolioLibraries = [
        {
          localAgency: 'tgala',
          FOLIOLibraries: [],
        },
      ];

      expect(validateLocalAgency(valuesWithEmptyFolioLibraries).localAgencies[0].FOLIOLibraries).toBeDefined();
    });

    it('should return error if the "Local Agency" field is not valid', () => {
      const valuesWithInvalidLocalAgency = [
        {
          localAgency: '1aSdfdge',
          FOLIOLibraries: [{ label: 'Bostock', value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3' }],
        },
      ];

      expect(validateLocalAgency(valuesWithInvalidLocalAgency).localAgencies[0].localAgency).toBeDefined();
    });
  });
});
