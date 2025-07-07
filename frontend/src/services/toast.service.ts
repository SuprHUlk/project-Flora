import { Injectable, signal, TemplateRef } from '@angular/core';
import { Toast } from 'src/models/toast.model';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private readonly socketBaseUrl = environment.socketBaseUrl;

  constructor() {
    const socket = io(this.socketBaseUrl, {
      withCredentials: true,
    });

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
