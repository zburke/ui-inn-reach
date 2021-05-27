import {
  validateRequired,
  validateLocalServerCode,
  validateLocalAgency,
} from './formValidation';

describe('formValidation utils', () => {
  describe('validateRequired', () => {
    it('should return the correct value', () => {
      expect(validateRequired('value')).toBeUndefined();
      expect(validateRequired()).toBeDefined();
    });
  });

  describe('validateLocalServerCode', () => {
    it('should return the correct value', () => {
      expect(validateLocalServerCode()).toBeDefined();
      expect(validateLocalServerCode('asdfg')).toBeUndefined();
      expect(validateLocalServerCode('1aSdfdge')).toBeDefined();
    });
  });

  describe('validateLocalAgency', () => {
    it('should return error if all fields are empty', () => {
      expect(validateLocalAgency().localAgencies[0].localAgency).toBeDefined();
      expect(validateLocalAgency().localAgencies[0].FOLIOLibraries).toBeDefined();
    });

    it('should return error if only "Local Agency" is empty', () => {
      const emptyLocalAgency = {
        localAgencies: [
          {
            localAgency: '',
            FOLIOLibraries: [{ label: 'Bostock', value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3' }],
          },
        ],
      };

      expect(validateLocalAgency(emptyLocalAgency).localAgencies[0].localAgency).toBeDefined();
    });

    it('should return error if only "FOLIO libraries is empty', () => {
      const emptyFolioLibraries = {
        localAgencies: [
          {
            localAgency: 'tgala',
            FOLIOLibraries: [],
          },
        ],
      };

      expect(validateLocalAgency(emptyFolioLibraries).localAgencies[0].FOLIOLibraries).toBeDefined();
    });

    it('should return error if the "Local Agency" field is not valid', () => {
      const invalidLocalAgency = {
        localAgencies: [
          {
            localAgency: '1aSdfdge',
            FOLIOLibraries: [{ label: 'Bostock', value: 'c3c85d4c-e6fc-4905-bd12-abfa730584e3' }],
          },
        ],
      };

      expect(validateLocalAgency(invalidLocalAgency).localAgencies[0].localAgency).toBeDefined();
    });
  });
});
