import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public toasts = signal<Toast[]>([]);

  public show(type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, title, message, duration };
    this.toasts.update(list => [...list, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  public success(title: string, message?: string): void {
    this.show('success', title, message);
  }

  public warning(title: string, message?: string): void {
    this.show('warning', title, message);
  }

  public error(title: string, message?: string): void {
    this.show('error', title, message);
  }

  public info(title: string, message?: string): void {
    this.show('info', title, message);
  }

  public dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}

