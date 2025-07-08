import { Injectable } from '@angular/core';
import { ChatMessage, ChatRequest, ChatResponse } from 'src/models/chat.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SocketService } from './shared/socket.service';
import { Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseApiUrl = environment.baseApiUrl + '/chat';
  private socket: Socket;
  messages$ = new BehaviorSubject<ChatResponse[]>([]);

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.socket = socketService.getSocket();

    this.socket.on('chat:receive', (message: ChatMessage) => {
      this.setMessage(message);
    });
  }

  get(id: string) {
    this.http
      .get<ChatResponse[]>(this.baseApiUrl + '/get/' + id, {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.emptyMessages();
        this.setChat(res);
      });
  }

  emptyMessages() {
    this.messages$.next([]);
  }

  setChat(chats: ChatResponse[]) {
    this.messages$.next(chats);
  }

  send(chat: ChatRequest) {
    console.log(chat);
    this.socket.emit('chat:send', chat);
    const message: ChatMessage = {
      message: chat.message,
      receiver: chat.receiver,
      sender: '',
      _id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.setMessage(message);
  }

  setMessage(message: ChatMessage) {
    // if (Array.isArray(message)) {
    //   this.messages$.next(message);
    // } else {
    //   this.messages$.next([...this.messages$.getValue(), message]);
    // }
    this.messages$
      .getValue()
      [this.messages$.getValue().length - 1].messages.push(message);
    this.messages$.next(this.messages$.getValue());
  }

  getMessages$(): Observable<ChatResponse[]> {
    return this.messages$.asObservable();
  }
}
