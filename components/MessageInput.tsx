'use client';

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  onSendMessage: (message: string, author: string) => Promise<void>;
  currentUser: string;
  onUserChange: (user: string) => void;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_AUTHOR_LENGTH = 100;

export default function MessageInput({ 
  onSendMessage, 
  currentUser, 
  onUserChange 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState(currentUser);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !author.trim()) {
      setError('Please enter both message and author name');
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }

    if (author.length > MAX_AUTHOR_LENGTH) {
      setError(`Author name is too long (max ${MAX_AUTHOR_LENGTH} characters)`);
      return;
    }

    setError('');
    setIsSending(true);

    try {
      await onSendMessage(message.trim(), author.trim());
      setMessage('');
      onUserChange(author.trim());
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? String(err.message) 
        : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError('');
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
    setError('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const messageLength = message.length;
  const isMessageTooLong = messageLength > MAX_MESSAGE_LENGTH;
  const isMessageWarning = messageLength > MAX_MESSAGE_LENGTH * 0.9;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="author-input" className={styles.label}>
            Your Name
          </label>
          <input
            id="author-input"
            type="text"
            value={author}
            onChange={handleAuthorChange}
            className={styles.input}
            placeholder="Enter your name"
            maxLength={MAX_AUTHOR_LENGTH}
            disabled={isSending}
            aria-label="Author name"
            aria-required="true"
          />
        </div>
        
        <div className={styles.inputWrapper} style={{ flex: 2 }}>
          <label htmlFor="message-input" className={styles.label}>
            Message
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            className={styles.textarea}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={isSending}
            aria-label="Message text"
            aria-required="true"
            aria-invalid={isMessageTooLong}
            aria-describedby={error ? "message-error" : undefined}
          />
          <div 
            className={`${styles.charCount} ${
              isMessageTooLong 
                ? styles.charCountError 
                : isMessageWarning 
                  ? styles.charCountWarning 
                  : ''
            }`}
          >
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={isSending || !message.trim() || !author.trim() || isMessageTooLong}
          aria-label="Send message"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      {error && (
        <div id="message-error" className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
