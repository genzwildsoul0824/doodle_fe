import {
  truncate,
  isValidAuthorName,
  formatErrorMessage,
  isNearBottom,
  decodeHTML,
} from '../utils';

describe('utils', () => {
  describe('truncate', () => {
    it('should return original text if shorter than maxLength', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate text longer than maxLength', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('isValidAuthorName', () => {
    it('should return true for valid names', () => {
      expect(isValidAuthorName('John')).toBe(true);
      expect(isValidAuthorName('John Doe')).toBe(true);
      expect(isValidAuthorName('user-123')).toBe(true);
      expect(isValidAuthorName('user_123')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(isValidAuthorName('John@Doe')).toBe(false);
      expect(isValidAuthorName('John.Doe')).toBe(false);
      expect(isValidAuthorName('John!Doe')).toBe(false);
      expect(isValidAuthorName('')).toBe(false);
    });
  });

  describe('formatErrorMessage', () => {
    it('should extract message from error object', () => {
      const error = { message: 'Test error' };
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('should return default message for unknown error', () => {
      expect(formatErrorMessage(null)).toBe('An unexpected error occurred');
      expect(formatErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(formatErrorMessage({})).toBe('An unexpected error occurred');
    });

    it('should handle error with non-string message', () => {
      const error = { message: 123 };
      expect(formatErrorMessage(error)).toBe('An unexpected error occurred');
    });
  });

  describe('isNearBottom', () => {
    it('should return true when near bottom', () => {
      const element = {
        scrollHeight: 1000,
        scrollTop: 950,
        clientHeight: 100,
      } as HTMLElement;

      expect(isNearBottom(element, 100)).toBe(true);
    });

    it('should return false when far from bottom', () => {
      const element = {
        scrollHeight: 1000,
        scrollTop: 100,
        clientHeight: 100,
      } as HTMLElement;

      expect(isNearBottom(element, 100)).toBe(false);
    });

    it('should use custom threshold', () => {
      const element = {
        scrollHeight: 1000,
        scrollTop: 800,
        clientHeight: 100,
      } as HTMLElement;

      expect(isNearBottom(element, 200)).toBe(true);
      expect(isNearBottom(element, 50)).toBe(false);
    });
  });

  describe('decodeHTML', () => {
    it('should decode HTML entities', () => {
      expect(decodeHTML('&#39;')).toBe("'");
      expect(decodeHTML('&amp;')).toBe('&');
      expect(decodeHTML('&quot;')).toBe('"');
      expect(decodeHTML('&lt;')).toBe('<');
      expect(decodeHTML('&gt;')).toBe('>');
    });

    it('should handle multiple entities', () => {
      expect(decodeHTML('It&#39;s &amp; cool')).toBe("It's & cool");
    });

    it('should handle plain text', () => {
      expect(decodeHTML('Hello World')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(decodeHTML('')).toBe('');
    });
  });
});
