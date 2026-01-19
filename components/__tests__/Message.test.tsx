import { render, screen } from '@testing-library/react';
import Message from '../Message';
import type { Message as MessageType } from '@/types';

const mockMessage: MessageType = {
  _id: '1',
  message: 'Hello world',
  author: 'John',
  createdAt: '2024-01-15T10:30:00.000Z',
};

describe('Message', () => {
  it('should render message content', () => {
    render(<Message message={mockMessage} currentUser="Alice" />);
    
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display formatted timestamp', () => {
    render(<Message message={mockMessage} currentUser="Alice" />);
    
    expect(screen.getByText(/15 Jan 2024/)).toBeInTheDocument();
  });

  it('should decode HTML entities in message', () => {
    const messageWithEntities: MessageType = {
      ...mockMessage,
      message: 'It&#39;s cool',
    };
    
    render(<Message message={messageWithEntities} currentUser="Alice" />);
    
    expect(screen.getByText("It's cool")).toBeInTheDocument();
  });

  it('should apply own message styles when author matches currentUser', () => {
    const { container } = render(
      <Message message={mockMessage} currentUser="John" />
    );
    
    const messageDiv = container.firstChild as HTMLElement;
    expect(messageDiv.className).toContain('messageOwn');
  });

  it('should apply other message styles when author does not match', () => {
    const { container } = render(
      <Message message={mockMessage} currentUser="Alice" />
    );
    
    const messageDiv = container.firstChild as HTMLElement;
    expect(messageDiv.className).toContain('messageOther');
  });

  it('should handle invalid date gracefully', () => {
    const invalidDateMessage: MessageType = {
      ...mockMessage,
      createdAt: 'invalid-date',
    };
    
    render(<Message message={invalidDateMessage} currentUser="Alice" />);
    
    // Should still render message content
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
});
