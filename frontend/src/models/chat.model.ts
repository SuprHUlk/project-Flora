export class ChatMessage {
  _id: string;
  message: string;
  receiver: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  message: string;
  receiver: string;
}

export interface ChatResponse {
  _id: string;
  messages: ChatMessage[];
}
