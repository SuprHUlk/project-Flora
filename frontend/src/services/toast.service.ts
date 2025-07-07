import { Injectable, signal } from '@angular/core';
import { Toast } from 'src/models/toast.model';
import { SocketService } from './shared/socket.service';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  constructor(socketService: SocketService) {
    const socket = socketService.getSocket();

    // socket.on('connect', () => {
    //   console.log(socket.id);
    // });
    // 'bg-danger text-light'

    socket.on('letterReceived', (res) => {
      this.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });

    socket.on('letterAccepted', (res) => {
      this.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });

    socket.on('messageReceived', (res) => {
      this.show({
        classname: 'bg-success text-light',
        delay: 15000,
        message: res,
        autohide: true,
      });
    });
  }

  show(toast: Toast) {
    this._toasts.update((toasts) => [...toasts, toast]);
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }
}
