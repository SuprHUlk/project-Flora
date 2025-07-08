import { Injectable } from '@angular/core';
import { SocketService } from './shared/socket.service';
import { ToastService } from './shared/toast.service';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket;
  constructor(
    private toastService: ToastService,
    private socketService: SocketService
  ) {}

  listen() {
    this.socket = this.socketService.getSocket();

    this.socket.on('letterReceived', (res) => {
      this.toastService.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });

    this.socket.on('letterAccepted', (res) => {
      this.toastService.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });

    this.socket.on('messageReceived', (res) => {
      this.toastService.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });
  }
}
