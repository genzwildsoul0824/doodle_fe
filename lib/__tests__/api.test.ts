import { apiClient } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'super-secret-doodle-token';
  const originalConsoleError = console.error;

  beforeEach(() => {
    mockFetch.mockClear();
    // Suppress console.error for expected API errors in tests
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('getMessages', () => {
    it('should fetch messages without params', async () => {
      const mockMessages = [
        {
          _id: '1',
          message: 'Hello',
          author: 'John',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      } as Response);

      const result = await apiClient.getMessages();

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/api/v1/messages`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${API_TOKEN}`,
          }),
        })
      );
      expect(result).toEqual(mockMessages);
    });

    it('should fetch messages with query params', async () => {
      const mockMessages: any[] = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      } as Response);

      await apiClient.getMessages({ limit: 10, after: '2024-01-01T00:00:00.000Z' });

      // URLSearchParams encodes colons as %3A
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`${API_URL}/api/v1/messages?limit=10&after=2024-01-01T00`),
        expect.any(Object)
      );
      // Verify the encoded version is used
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/after=2024-01-01T00%3A00%3A00\.000Z/),
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized', statusCode: 401 }),
      } as Response);

      await expect(apiClient.getMessages()).rejects.toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const mockMessage = {
        _id: '1',
        message: 'Hello',
        author: 'John',
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      } as Response);

      const result = await apiClient.createMessage({
        message: 'Hello',
        author: 'John',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/api/v1/messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'Hello', author: 'John' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
          }),
        })
      );
      expect(result).toEqual(mockMessage);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        apiClient.createMessage({ message: 'Hello', author: 'John' })
      ).rejects.toThrow('Network error');
    });
  });
});
