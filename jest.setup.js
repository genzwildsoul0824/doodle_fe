// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Suppress console.error for expected errors in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress React act() warnings and expected API errors
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
       args[0].includes('API request failed:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  // Suppress punycode deprecation warnings from Node.js dependencies
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('punycode')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
