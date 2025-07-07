import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly socketBaseUrl = environment.socketBaseUrl;
  socket: Socket;

  constructor() {}

  initSocket() {
    this.socket = io(this.socketBaseUrl, {
      withCredentials: true,
    });
  }

  getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket not init');
    }
    return this.socket;
  }
}
