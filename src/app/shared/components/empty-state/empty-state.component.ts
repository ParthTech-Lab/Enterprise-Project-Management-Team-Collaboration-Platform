import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="empty-state-box">
      <div class="empty-icon-wrap">
        <app-icon [name]="icon" [size]="28"></app-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-desc">{{ description }}</p>
      <div *ngIf="actionLabel" class="empty-action">
        <button type="button" class="orbit-btn orbit-btn-primary" (click)="action.emit()">
          <app-icon *ngIf="actionIcon" [name]="actionIcon" [size]="15"></app-icon>
          <span>{{ actionLabel }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .empty-state-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      border: 1px dashed var(--border-default);
      border-radius: var(--radius-lg);
      background: var(--surface-secondary);
      margin: 16px 0;
    }
    .empty-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 9999px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 6px 0;
    }
    .empty-desc {
      font-size: 13px;
      color: var(--text-secondary);
      max-width: 380px;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    .empty-action {
      display: flex;
      gap: 8px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'folder';
  @Input() title: string = 'No items found';
  @Input() description: string = 'There are currently no items matching your criteria in this workspace.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() action = new EventEmitter<void>();
}

