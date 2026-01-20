'use client';

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  onSendMessage: (message: string, author: string) => Promise<void>;
  currentUser: string;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_AUTHOR_LENGTH = 100;

export default function MessageInput({ 
  onSendMessage, 
  currentUser
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }

    if (!currentUser.trim()) {
      setError('Please set your username first');
      return;
    }

    setError('');
    setIsSending(true);

    try {
      await onSendMessage(message.trim(), currentUser.trim());
      setMessage('');
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
        <div className={styles.inputWrapper} style={{ flex: 1 }}>
          <textarea
            id="message-input"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            className={styles.textarea}
            placeholder="Message"
            rows={1}
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
          disabled={isSending || !message.trim() || isMessageTooLong}
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
