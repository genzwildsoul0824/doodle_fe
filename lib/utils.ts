/**
 * Utility functions for the chat application
 */

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate author name
 */
export function isValidAuthorName(name: string): boolean {
  return /^[\w\s-]+$/.test(name);
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
}

/**
 * Check if user is near the bottom of a scrollable container
 */
export function isNearBottom(
  element: HTMLElement,
  threshold: number = 100
): boolean {
  const { scrollHeight, scrollTop, clientHeight } = element;
  return scrollHeight - scrollTop - clientHeight < threshold;
}

/**
 * Decode HTML entities in text
 */
export function decodeHTML(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}
