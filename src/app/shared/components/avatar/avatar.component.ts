import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberStatus } from '../../../core/models/user.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'avatar-wrapper size-' + size">
      <img
        *ngIf="src && !hasError"
        [src]="src"
        [alt]="name || 'User'"
        (error)="onError()"
        class="avatar-img"
      />
      <div *ngIf="!src || hasError" class="avatar-initials">
        {{ getInitials() }}
      </div>
      <span
        *ngIf="status"
        [class]="'status-dot status-' + status"
        [attr.title]="status"
      ></span>
    </div>
  `,
  styles: [`
    .avatar-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      user-select: none;
      flex-shrink: 0;
      background-color: var(--surface-tertiary);
      border: 1px solid var(--border-subtle);
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 9999px;
      object-fit: cover;
    }
    .avatar-initials {
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    .status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 9999px;
      border: 2px solid var(--surface-primary);
    }
    .status-online { background-color: var(--accent-emerald); }
    .status-busy { background-color: var(--accent-crimson); }
    .status-away { background-color: var(--accent-amber); }
    .status-offline { background-color: var(--text-muted); }

    /* Sizes */
    .size-xs { width: 22px; height: 22px; font-size: 10px; }
    .size-xs .status-dot { width: 7px; height: 7px; }

    .size-sm { width: 28px; height: 28px; font-size: 11px; }
    .size-sm .status-dot { width: 8px; height: 8px; }

    .size-md { width: 36px; height: 36px; font-size: 13px; }
    .size-md .status-dot { width: 10px; height: 10px; }

    .size-lg { width: 44px; height: 44px; font-size: 15px; }
    .size-lg .status-dot { width: 12px; height: 12px; }

    .size-xl { width: 64px; height: 64px; font-size: 20px; }
    .size-xl .status-dot { width: 16px; height: 16px; }
  `]
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() name?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() status?: MemberStatus;

  hasError = false;

  onError(): void {
    this.hasError = true;
  }

  getInitials(): string {
    if (!this.name) return 'U';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}

