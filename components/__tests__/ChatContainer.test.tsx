import { render, screen, waitFor, act } from '@testing-library/react';
import ChatContainer from '../ChatContainer';
import { apiClient } from '@/lib/api';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    getMessages: jest.fn(),
    createMessage: jest.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ChatContainer', () => {
  const mockGetMessages = apiClient.getMessages as jest.MockedFunction<
    typeof apiClient.getMessages
  >;
  const mockCreateMessage = apiClient.createMessage as jest.MockedFunction<
    typeof apiClient.createMessage
  >;

  beforeEach(() => {
    localStorageMock.clear();
    mockGetMessages.mockClear();
    mockCreateMessage.mockClear();
  });

  it('should render chat container', async () => {
    mockGetMessages.mockResolvedValueOnce([]);

    await act(async () => {
      render(<ChatContainer />);
    });

    expect(screen.getByText(/chat application/i)).toBeInTheDocument();
    expect(screen.getByText(/send and receive messages/i)).toBeInTheDocument();
  });

  it('should display loading state initially', async () => {
    mockGetMessages.mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<ChatContainer />);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display messages when loaded', async () => {
    const mockMessages = [
      {
        _id: '1',
        message: 'Hello',
        author: 'John',
        createdAt: '2024-01-15T10:30:00.000Z',
      },
      {
        _id: '2',
        message: 'Hi there',
        author: 'Alice',
        createdAt: '2024-01-15T10:31:00.000Z',
      },
    ];

    mockGetMessages.mockResolvedValueOnce(mockMessages);

    await act(async () => {
      render(<ChatContainer />);
    });

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    mockGetMessages.mockRejectedValueOnce({ message: 'Failed to load' });

    await act(async () => {
      render(<ChatContainer />);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should display empty state when no messages', async () => {
    mockGetMessages.mockResolvedValueOnce([]);

    await act(async () => {
      render(<ChatContainer />);
    });

    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    });
  });

  it('should load username from localStorage', async () => {
    localStorageMock.setItem('chat_app_user', 'TestUser');
    mockGetMessages.mockResolvedValueOnce([]);

    await act(async () => {
      render(<ChatContainer />);
    });

    await waitFor(() => {
      expect(screen.getByText('TestUser')).toBeInTheDocument();
    });
  });

  it('should default to anonymous if no saved username', async () => {
    mockGetMessages.mockResolvedValueOnce([]);

    await act(async () => {
      render(<ChatContainer />);
    });

    await waitFor(() => {
      expect(screen.getByText('anonymous')).toBeInTheDocument();
    });
  });
});
