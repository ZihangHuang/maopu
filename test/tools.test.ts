import { getRandom, encrypt, check } from '../src/common/tools';

describe('common:tools', () => {
  describe('getRandom', () => {
    test('should return string which the length equal to parameter n', () => {
      const n = 5;
      expect(getRandom(n).length === n).toBeTruthy();
    });
  });

  describe('check', () => {
    test('should return true if two string is same', () => {
      expect(check('123456', encrypt('123456'))).toBeTruthy();
    });

    test('should return false if two string is different', () => {
      expect(check('123456', encrypt('12345'))).toBeFalsy();
    });
  });
});
