'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { apiClient } from '@/lib/api';
import type { Message as MessageType } from '@/types';
import styles from './ChatContainer.module.css';

const POLL_INTERVAL = 3000; // Poll for new messages every 3 seconds
const STORAGE_KEY = 'chat_app_user';

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentUser, setCurrentUser] = useState('anonymous');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editUsernameValue, setEditUsernameValue] = useState('anonymous');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastFetchedTimestamp = useRef<string | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setCurrentUser(savedUser);
      setEditUsernameValue(savedUser);
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      const fetchedMessages = await apiClient.getMessages({ limit: 100 });
      setMessages(fetchedMessages);
      setError(null);
      
      if (fetchedMessages.length > 0) {
        lastFetchedTimestamp.current = fetchedMessages[fetchedMessages.length - 1].createdAt;
      }
      
      // Scroll to bottom on initial load
      setTimeout(() => scrollToBottom('auto'), 100);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? String(err.message) 
        : 'Failed to load messages';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  // Poll for new messages
  const pollNewMessages = useCallback(async () => {
    if (!lastFetchedTimestamp.current) return;

    try {
      const newMessages = await apiClient.getMessages({
        after: lastFetchedTimestamp.current,
        limit: 50,
      });

      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        lastFetchedTimestamp.current = newMessages[newMessages.length - 1].createdAt;
        
        // Auto-scroll if user is near bottom
        const container = messagesContainerRef.current;
        if (container) {
          const isNearBottom = 
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      }
    } catch (err) {
      // Silently fail polling errors to avoid disrupting the user experience
      console.error('Failed to poll new messages:', err);
    }
  }, [scrollToBottom]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up polling
  useEffect(() => {
    const interval = setInterval(pollNewMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [pollNewMessages]);

  // Handle sending a message
  const handleSendMessage = async (message: string, author: string) => {
    const newMessage = await apiClient.createMessage({ message, author });
    setMessages(prev => [...prev, newMessage]);
    lastFetchedTimestamp.current = newMessage.createdAt;
    scrollToBottom();
  };

  // Handle user change
  const handleUserChange = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, user);
  };

  // Handle username edit
  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setEditUsernameValue(currentUser);
    setTimeout(() => usernameInputRef.current?.focus(), 0);
  };

  const handleSaveUsername = () => {
    const trimmed = editUsernameValue.trim();
    if (trimmed && trimmed.length <= 100) {
      handleUserChange(trimmed);
      setIsEditingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setEditUsernameValue(currentUser);
    setIsEditingUsername(false);
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Chat Application</h1>
            <p>Send and receive messages in real-time</p>
          </div>
          <div className={styles.usernameSection}>
            {isEditingUsername ? (
              <div className={styles.usernameEdit}>
                <input
                  ref={usernameInputRef}
                  type="text"
                  value={editUsernameValue}
                  onChange={(e) => setEditUsernameValue(e.target.value)}
                  onKeyDown={handleUsernameKeyDown}
                  className={styles.usernameInput}
                  maxLength={100}
                  aria-label="Edit username"
                />
                <button
                  onClick={handleSaveUsername}
                  className={styles.usernameButton}
                  aria-label="Save username"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={styles.usernameButton}
                  aria-label="Cancel edit"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.usernameDisplay}>
                <span className={styles.usernameText}>{currentUser}</span>
                <button
                  onClick={handleEditUsername}
                  className={styles.editButton}
                  aria-label="Edit username"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div 
        className={styles.messagesContainer} 
        ref={messagesContainerRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} role="status" aria-label="Loading messages"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
            <button 
              onClick={fetchMessages} 
              className={styles.retryButton}
              aria-label="Retry loading messages"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <div className={styles.empty}>
            <p>No messages yet. Be the first to send one!</p>
          </div>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <>
            {messages.map((msg) => (
              <Message 
                key={msg._id} 
                message={msg} 
                currentUser={currentUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />
    </div>
  );
}
