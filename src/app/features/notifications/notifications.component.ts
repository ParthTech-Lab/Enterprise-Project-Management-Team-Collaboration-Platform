import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification, NotificationCategory } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="notif-viewport">
      <div class="notif-container-inner">
        <!-- Header -->
        <header class="page-header">
          <div class="header-left">
            <div class="breadcrumb-trail">
              <span>Workspace</span>
              <span class="bc-sep">/</span>
              <span class="bc-active">Notifications Center</span>
            </div>
            <h1 class="page-title">Notification Alerts & Incident Broadcasts</h1>
            <p class="page-subtitle">
              Critical assignments, milestone events, security alerts, and stakeholder mentions
            </p>
          </div>

          <div class="header-right">
            <button
              type="button"
              class="orbit-btn orbit-btn-secondary"
              (click)="markAllAsRead()"
              aria-label="Mark all notifications as read"
            >
              <app-icon name="check" [size]="14"></app-icon>
              <span>Mark All As Read</span>
            </button>
          </div>
        </header>

        <!-- Category Filter Pills -->
        <section class="toolbar-card">
          <div class="filter-pills-row">
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'all'"
              (click)="selectedCategory = 'all'"
            >
              All ({{ dataService.notifications().length }})
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'assignments'"
              (click)="selectedCategory = 'assignments'"
            >
              Assignments
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'projects'"
              (click)="selectedCategory = 'projects'"
            >
              Projects
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'tasks'"
              (click)="selectedCategory = 'tasks'"
            >
              Tasks
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'mentions'"
              (click)="selectedCategory = 'mentions'"
            >
              Mentions
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === 'system'"
              (click)="selectedCategory = 'system'"
            >
              System
            </button>
          </div>
        </section>

        <!-- Notifications Controlled-Width Card List -->
        <div class="orbit-card notif-card-wrapper">
          <div class="notif-card-header">
            <div class="header-status-indicator">
              <span class="notif-count-badge">{{ filteredNotifications().length }} Items</span>
              <span class="unread-sub-count">({{ unreadCount }} unread)</span>
            </div>
            <span class="auto-sync-label">
              <app-icon name="activity" [size]="12"></app-icon>
              Live Telemetry Sync Active
            </span>
          </div>

          <div class="notif-full-list">
            <div
              *ngFor="let notif of filteredNotifications()"
              class="notif-full-row"
              [class.unread]="!notif.read"
              (click)="toggleRead(notif)"
            >
              <!-- Left: Unread dot + Avatar / Icon -->
              <div class="notif-leading">
                <div class="notif-unread-dot" *ngIf="!notif.read" title="Unread notification"></div>
                <div class="notif-avatar-box">
                  <app-avatar [src]="notif.actorAvatar" [name]="notif.actorName || 'System'" size="sm"></app-avatar>
                </div>
              </div>

              <!-- Center: Title, category badge, message body -->
              <div class="notif-info-block">
                <div class="n-title-row">
                  <span class="n-title">{{ notif.title }}</span>
                  <app-badge
                    [variant]="notif.priority === 'urgent' ? 'crimson' : notif.category === 'projects' ? 'amber' : 'graphite'"
                    size="sm"
                  >
                    {{ notif.category | uppercase }}
                  </app-badge>
                </div>
                <p class="n-msg">{{ notif.message }}</p>
              </div>

              <!-- Right: Timestamp & Proximity Ghost Action -->
              <div class="notif-trailing">
                <span class="n-time">{{ notif.timestamp }}</span>
                <button
                  type="button"
                  class="notif-ghost-action"
                  [class.is-read]="notif.read"
                  (click)="$event.stopPropagation(); toggleRead(notif)"
                  [attr.aria-label]="notif.read ? 'Mark unread' : 'Mark as read'"
                  [attr.title]="notif.read ? 'Mark as unread' : 'Mark as read'"
                >
                  <app-icon [name]="notif.read ? 'rotate-ccw' : 'check'" [size]="13" customClass="ghost-icon"></app-icon>
                  <span class="ghost-action-text">{{ notif.read ? 'Unread' : 'Mark read' }}</span>
                </button>
              </div>
            </div>

            <!-- Empty State if no notifications in category -->
            <div *ngIf="filteredNotifications().length === 0" class="notif-empty-state">
              <app-icon name="bell" [size]="32" customClass="empty-bell-icon"></app-icon>
              <h3 class="empty-title">All Caught Up</h3>
              <p class="empty-desc">No notifications matching category '{{ selectedCategory }}'.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notif-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    /* Controlled maximum width to eliminate empty horizontal expanse */
    .notif-container-inner {
      width: 100%;
      max-width: 1100px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .bc-sep { color: var(--border-strong); }
    .bc-active { color: var(--text-secondary); font-weight: 500; }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .toolbar-card {
      padding: 10px 16px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .filter-pills-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      height: 28px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 9999px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 150ms ease;
    }
    .filter-pill:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }
    .filter-pill.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Notification Card Wrapper */
    .notif-card-wrapper {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
      background: var(--surface-primary);
    }

    .notif-card-header {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .header-status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notif-count-badge {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .unread-sub-count {
      font-size: 12px;
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .auto-sync-label {
      font-size: 11px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .notif-full-list {
      display: flex;
      flex-direction: column;
    }

    /* Strict [Icon] [Notification Content] [Timestamp] [Action] structure */
    .notif-full-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background-color 150ms ease, transform 150ms ease;
      position: relative;
    }

    .notif-full-row:hover {
      background-color: var(--surface-secondary);
    }

    .notif-full-row:hover .notif-ghost-action {
      opacity: 1;
      border-color: var(--border-default);
    }

    .notif-full-row:last-child {
      border-bottom: none;
    }

    .notif-full-row.unread {
      background: rgba(16, 185, 129, 0.035);
    }

    .notif-full-row.unread:hover {
      background: rgba(16, 185, 129, 0.06);
    }

    .notif-leading {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      position: relative;
    }

    .notif-unread-dot {
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      background-color: var(--accent-emerald);
      flex-shrink: 0;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
    }

    .notif-avatar-box {
      border: 1px solid #3F3F46;
      border-radius: 9999px;
      padding: 1px;
    }

    .notif-info-block {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .n-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .n-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .n-msg {
      font-size: 13px;
      color: #D4D4D8; /* High contrast WCAG AA readable text */
      line-height: 1.45;
      margin-top: 1px;
    }

    .notif-trailing {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }

    .n-time {
      font-size: 11px;
      color: #A1A1AA; /* High contrast WCAG AA readable metadata */
      white-space: nowrap;
    }

    /* Compact ghost action visually adjacent to notification */
    .notif-ghost-action {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 160ms ease;
      white-space: nowrap;
    }

    .notif-ghost-action:hover {
      background: var(--surface-tertiary);
      color: var(--text-primary);
      border-color: rgba(16, 185, 129, 0.35);
    }

    .notif-ghost-action:hover .ghost-icon {
      color: var(--accent-emerald);
      transform: scale(1.1);
    }

    .ghost-icon {
      color: var(--text-muted);
      transition: transform 160ms ease, color 160ms ease;
    }

    .notif-empty-state {
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 8px;
    }

    .empty-bell-icon {
      color: var(--text-muted);
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .empty-desc {
      font-size: 13px;
      color: var(--text-secondary);
    }

    @media (max-width: 680px) {
      .notif-full-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .notif-trailing {
        width: 100%;
        justify-content: space-between;
        margin-top: 4px;
      }
      .notif-ghost-action {
        border-color: var(--border-subtle);
      }
    }
  `]
})
export class NotificationsComponent {
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public selectedCategory: string = 'all';

  get unreadCount(): number {
    return this.dataService.notifications().filter(n => !n.read).length;
  }

  public filteredNotifications = computed(() => {
    let list = this.dataService.notifications();
    if (this.selectedCategory !== 'all') {
      list = list.filter(n => n.category === this.selectedCategory);
    }
    return list;
  });

  toggleRead(notif: AppNotification): void {
    if (notif.read) {
      notif.read = false;
    } else {
      this.dataService.markNotificationAsRead(notif.id);
    }
  }

  markAllAsRead(): void {
    this.dataService.markAllNotificationsAsRead();
    this.notifService.success('All notifications marked as read');
  }
}
