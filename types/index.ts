export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface CreateMessagePayload {
  message: string;
  author: string;
}

export interface GetMessagesParams {
  limit?: number;
  after?: string;
  before?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  name?: string;
}
