'use client';

import { format } from 'date-fns';
import type { Message as MessageType } from '@/types';
import { decodeHTML } from '@/lib/utils';
import styles from './Message.module.css';

interface MessageProps {
  message: MessageType;
  currentUser: string;
}

export default function Message({ message, currentUser }: MessageProps) {
  const isOwn = message.author === currentUser;
  
  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMM yyyy HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <div className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}>
      <div className={`${styles.author} ${isOwn ? styles.authorOwn : ''}`}>
        {message.author}
      </div>
      <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}>
        <p className={styles.messageText}>{decodeHTML(message.message)}</p>
      </div>
      <div className={`${styles.timestamp} ${isOwn ? styles.timestampOwn : styles.timestampOther}`}>
        {formatTimestamp(message.createdAt)}
      </div>
    </div>
  );
}
