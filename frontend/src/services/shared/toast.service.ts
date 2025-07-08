import { Injectable, signal } from '@angular/core';
import { Toast } from 'src/models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  constructor() {}

  show(toast: Toast) {
    if (!toast.classname?.trim()) {
      toast.classname = 'bg-success text-light';
    }
    this._toasts.update((toasts) => [...toasts, toast]);
  }

  error(toast: Toast) {
    toast.classname = 'bg-danger text-light';
    this._toasts.update((toasts) => [...toasts, toast]);
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }
}
