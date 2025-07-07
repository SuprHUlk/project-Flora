import { Injectable } from '@angular/core';
import { ChatRequest, ChatResponse } from 'src/models/chat.model';
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

    this.socket.on('chat:receive', (message: ChatResponse) => {
      this.setMessages(message);
    });
  }

  get(id: string) {
    this.http
      .get<ChatResponse[]>(this.baseApiUrl + '/get/' + id, {
        withCredentials: true,
      })
      .subscribe((res) => {
        this.emptyMessages();
        this.setMessages(res);
      });
  }

  emptyMessages() {
    this.messages$.next([]);
  }

  setMessages(message: ChatResponse[] | ChatResponse) {
    if (Array.isArray(message)) {
      this.messages$.next(message);
    } else {
      this.messages$.next([...this.messages$.getValue(), message]);
    }
  }

  send(chat: ChatRequest) {
    console.log(chat);
    this.socket.emit('chat:send', chat);
    const message: ChatResponse = {
      message: chat.message,
      receiver: chat.receiver,
      sender: '',
      _id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.setMessages(message);
  }

  getMessages$(): Observable<ChatResponse[]> {
    return this.messages$.asObservable();
  }
}
