import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageInput from '../MessageInput';

const mockOnSendMessage = jest.fn();

// Suppress act() warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('MessageInput', () => {
  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('should render message input form', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    expect(screen.getByLabelText(/message text/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    mockOnSendMessage.mockResolvedValue(undefined);
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(textarea, 'Hello world');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Hello world', 'John');
    });
  });

  it('should clear message after successful send', async () => {
    const user = userEvent.setup();
    mockOnSendMessage.mockResolvedValue(undefined);
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i) as HTMLTextAreaElement;
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await act(async () => {
      await user.type(textarea, 'Hello world');
      await user.click(sendButton);
    });
    
    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('should show error for empty message', async () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    const form = textarea.closest('form');
    
    // Submit form directly - the validation happens in handleSubmit
    fireEvent.submit(form!);
    
    await waitFor(() => {
      const errorElement = screen.queryByRole('alert');
      expect(errorElement).toHaveTextContent(/please enter a message/i);
    });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should show error for message exceeding max length', async () => {
    const user = userEvent.setup();
    const longMessage = 'a'.repeat(1001);
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i) as HTMLTextAreaElement;
    // Use fireEvent to directly set value and trigger onChange
    fireEvent.change(textarea, { target: { value: longMessage } });
    
    // Wait for the change to be processed
    await waitFor(() => {
      expect(textarea.value).toBe(longMessage);
    });
    
    const form = textarea.closest('form');
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/too long/i);
    });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should show error when currentUser is empty', async () => {
    const user = userEvent.setup();
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(textarea, 'Hello');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/please set your username/i);
    });
  });

  it('should submit on Enter key', async () => {
    const user = userEvent.setup();
    mockOnSendMessage.mockResolvedValue(undefined);
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    await act(async () => {
      await user.type(textarea, 'Hello');
      await user.keyboard('{Enter}');
    });
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Hello', 'John');
    });
  });

  it('should not submit on Shift+Enter', async () => {
    const user = userEvent.setup();
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    await user.type(textarea, 'Hello{Shift>}{Enter}{/Shift}');
    
    // Should not call onSendMessage
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should display character count', async () => {
    const user = userEvent.setup();
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    await act(async () => {
      await user.type(textarea, 'Hello');
    });
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === '5/1000';
    })).toBeInTheDocument();
  });

  it('should disable send button when sending', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnSendMessage.mockReturnValue(promise);
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await act(async () => {
      await user.type(textarea, 'Hello');
      await user.click(sendButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
    expect(sendButton).toBeDisabled();
    
    await act(async () => {
      resolvePromise!();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/send/i)).toBeInTheDocument();
    });
  });

  it('should display error message on send failure', async () => {
    const user = userEvent.setup();
    mockOnSendMessage.mockRejectedValue({ message: 'Network error' });
    
    render(<MessageInput onSendMessage={mockOnSendMessage} currentUser="John" />);
    
    const textarea = screen.getByLabelText(/message text/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await act(async () => {
      await user.type(textarea, 'Hello');
      await user.click(sendButton);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
    });
  });
});
