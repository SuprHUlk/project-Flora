export class ChatMessage {
  $key?: string;
  email?: string;
  userName?: string;
  message?: string;
  timeSent?: Date = new Date();
}

export interface ChatRequest {
  message: string;
  receiver: string;
}

export interface ChatResponse {
  _id: string;
  message: string;
  receiver: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}
