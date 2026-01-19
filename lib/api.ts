import type { Message, CreateMessagePayload, GetMessagesParams } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'super-secret-doodle-token';
const API_BASE = `${API_URL}/api/v1`;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred',
          statusCode: response.status,
        }));
        throw error;
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getMessages(params?: GetMessagesParams): Promise<Message[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.after) {
      queryParams.append('after', params.after);
    }
    if (params?.before) {
      queryParams.append('before', params.before);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/messages?${queryString}` : '/messages';

    return this.request<Message[]>(endpoint);
  }

  async createMessage(payload: CreateMessagePayload): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
