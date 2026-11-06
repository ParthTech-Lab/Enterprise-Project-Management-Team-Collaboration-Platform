import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-viewport" aria-live="polite">
      <div
        *ngFor="let toast of notifService.toasts()"
        [class]="'toast-item type-' + toast.type"
      >
        <div class="toast-icon">
          <app-icon
            [name]="getIconName(toast.type)"
            [size]="18"
          ></app-icon>
        </div>
        <div class="toast-body">
          <div class="toast-title">{{ toast.title }}</div>
          <div *ngIf="toast.message" class="toast-message">{{ toast.message }}</div>
        </div>
        <button
          type="button"
          class="toast-dismiss"
          (click)="notifService.dismiss(toast.id)"
          aria-label="Dismiss toast"
        >
          <app-icon name="x" [size]="14"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-viewport {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      color: var(--text-primary);
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .toast-icon {
      flex-shrink: 0;
      margin-top: 1px;
    }
    .type-success .toast-icon { color: var(--accent-emerald); }
    .type-warning .toast-icon { color: var(--accent-amber); }
    .type-error .toast-icon { color: var(--accent-crimson); }
    .type-info .toast-icon { color: var(--accent-purple); }

    .toast-body {
      flex: 1;
      min-width: 0;
    }
    .toast-title {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.3;
    }
    .toast-message {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
      line-height: 1.4;
    }
    .toast-dismiss {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 2px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }
    .toast-dismiss:hover {
      color: var(--text-primary);
    }
  `]
})
export class ToastContainerComponent {
  public notifService = inject(NotificationService);

  getIconName(type: string): string {
    switch (type) {
      case 'success': return 'check';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      case 'info': return 'zap';
      default: return 'bell';
    }
  }
}

