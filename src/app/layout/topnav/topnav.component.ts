import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { ThemeService } from '../../core/services/theme.service';
import { TimerService } from '../../core/services/timer.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, AvatarComponent, BadgeComponent],
  template: `
    <header class="orbit-topnav">
      <!-- Left side: Mobile menu toggle + Global Search bar -->
      <div class="topnav-left">
        <button
          type="button"
          class="mobile-menu-btn"
          (click)="toggleMobileSidebar.emit()"
          aria-label="Open mobile navigation"
        >
          <app-icon name="list" [size]="18"></app-icon>
        </button>

        <div class="search-trigger" (click)="openCommandPalette()">
          <app-icon name="search" [size]="15" customClass="search-icon"></app-icon>
          <span class="search-placeholder">Search projects, tasks, members, docs...</span>
          <div class="kbd-badge">
            <span class="kbd-key">Ctrl</span>
            <span class="kbd-key">K</span>
          </div>
        </div>
      </div>

      <!-- Right side: Live Stopwatch Timer, Quick Create, Notifications, Theme, Profile -->
      <div class="topnav-right">
        <!-- Live Stopwatch Timer Widget -->
        <div class="timer-pill" [class.running]="timerService.isRunning()">
          <button
            type="button"
            class="timer-toggle-btn"
            (click)="timerService.toggle()"
            [attr.title]="timerService.isRunning() ? 'Pause timer' : 'Start tracking time'"
          >
            <app-icon
              [name]="timerService.isRunning() ? 'pause' : 'play'"
              [size]="13"
            ></app-icon>
          </button>
          <div class="timer-display" routerLink="/time-tracking">
            <span class="timer-digits">{{ timerService.formattedTime() }}</span>
            <span class="timer-project-label" *ngIf="timerService.isRunning()">VTX-101</span>
          </div>
        </div>

        <!-- Quick Create (+) Button -->
        <div class="quick-create-dropdown-wrap">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary quick-create-btn"
            (click)="modalService.toggleQuickCreate()"
            aria-label="Quick create work item"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span class="quick-create-text">Create</span>
          </button>
        </div>

        <!-- Notification Bell Dropdown -->
        <div class="notif-wrapper">
          <button
            type="button"
            class="icon-nav-btn"
            (click)="toggleNotifications()"
            aria-label="View notifications"
          >
            <app-icon name="bell" [size]="18"></app-icon>
            <span *ngIf="unreadCount > 0" class="notif-dot-badge">{{ unreadCount }}</span>
          </button>

          <!-- Notifications Dropdown Panel -->
          <div *ngIf="isNotifOpen()" class="notif-flyout">
            <div class="notif-header">
              <div class="notif-title-wrap">
                <span class="notif-title">Notifications</span>
                <app-badge variant="emerald" size="sm">{{ unreadCount }} New</app-badge>
              </div>
              <button
                type="button"
                class="mark-all-read-btn"
                (click)="markAllAsRead()"
              >
                Mark all read
              </button>
            </div>

            <div class="notif-list">
              <div
                *ngFor="let notif of dataService.notifications().slice(0, 5)"
                class="notif-row"
                [class.unread]="!notif.read"
                (click)="onNotifClick(notif.id)"
              >
                <div class="notif-indicator" *ngIf="!notif.read"></div>
                <div class="notif-content">
                  <span class="notif-item-title">{{ notif.title }}</span>
                  <p class="notif-item-msg">{{ notif.message }}</p>
                  <span class="notif-item-time">{{ notif.timestamp }}</span>
                </div>
              </div>
            </div>

            <div class="notif-footer">
              <a routerLink="/notifications" (click)="isNotifOpen.set(false)" class="view-all-link">
                View all notifications →
              </a>
            </div>
          </div>
        </div>

        <!-- Theme Toggle Button (Strict NO BLUE: Graphite / Neutral) -->
        <button
          type="button"
          class="icon-nav-btn theme-toggle-btn"
          (click)="themeService.toggleTheme()"
          [attr.title]="themeService.isDark() ? 'Switch to warm light theme' : 'Switch to graphite dark theme'"
        >
          <app-icon
            [name]="themeService.isDark() ? 'sun' : 'moon'"
            [size]="18"
          ></app-icon>
        </button>

        <!-- User Profile Avatar & Menu -->
        <div class="user-menu-wrap">
          <button
            type="button"
            class="user-avatar-btn"
            (click)="modalService.openMemberDrawer(dataService.currentUser())"
            aria-label="User profile settings"
          >
            <app-avatar
              [src]="dataService.currentUser().avatar"
              [name]="dataService.currentUser().name"
              [status]="dataService.currentUser().status"
              size="sm"
            ></app-avatar>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .orbit-topnav {
      height: 60px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--surface-primary);
      border-bottom: 1px solid var(--border-subtle);
      z-index: 100;
      position: relative;
    }

    .topnav-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      max-width: 580px;
    }

    .mobile-menu-btn {
      display: none;
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 992px) {
      .mobile-menu-btn {
        display: flex;
      }
    }

    /* Global Search Box */
    .search-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 36px;
      padding: 0 12px;
      background-color: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-muted);
    }

    .search-trigger:hover {
      background-color: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-secondary);
    }

    .search-icon {
      color: var(--text-muted);
    }

    .search-placeholder {
      font-size: 13px;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .kbd-badge {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .kbd-key {
      font-size: 11px;
      font-weight: 600;
      padding: 1px 5px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-strong);
      border-radius: 4px;
      color: var(--text-secondary);
      line-height: 1.2;
    }

    /* Topnav Right */
    .topnav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Timer Pill */
    .timer-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px 4px 6px;
      border-radius: 9999px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      transition: all 0.2s ease;
    }

    .timer-pill.running {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.08);
    }

    .timer-toggle-btn {
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .timer-pill.running .timer-toggle-btn {
      background: var(--accent-emerald);
      color: #ffffff;
      border-color: var(--accent-emerald);
    }

    .timer-display {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      text-decoration: none;
    }

    .timer-digits {
      font-family: monospace;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: 0.04em;
    }

    .timer-project-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 1px 5px;
      border-radius: 4px;
    }

    .quick-create-btn {
      height: 34px;
      padding: 0 14px;
      font-size: 13px;
      font-weight: 600;
      background-color: #059669;
      border-color: #059669;
      color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.28);
      transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 160ms ease,
                  box-shadow 160ms ease;
    }

    .quick-create-btn:hover {
      background-color: #10B981;
      border-color: #10B981;
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(16, 185, 129, 0.25);
    }

    .quick-create-btn app-icon {
      transition: transform 160ms ease;
    }

    .quick-create-btn:hover app-icon {
      transform: scale(1.1);
    }

    @media (max-width: 640px) {
      .quick-create-text {
        display: none;
      }
      .quick-create-btn {
        width: 34px;
        padding: 0;
      }
      .timer-pill {
        display: none;
      }
    }

    /* Icon Nav Buttons */
    .icon-nav-btn {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .icon-nav-btn:hover {
      background-color: var(--surface-secondary);
      color: var(--text-primary);
      border-color: var(--border-subtle);
    }

    .notif-dot-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      border-radius: 9999px;
      background-color: var(--accent-emerald);
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--surface-primary);
    }

    /* Notification Flyout */
    .notif-wrapper {
      position: relative;
    }

    .notif-flyout {
      position: absolute;
      top: 44px;
      right: 0;
      width: 360px;
      background: var(--surface-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-modal);
      z-index: 1100;
      display: flex;
      flex-direction: column;
      animation: zoomIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .notif-header {
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .notif-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notif-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .mark-all-read-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .mark-all-read-btn:hover {
      color: var(--accent-emerald);
    }

    .notif-list {
      max-height: 320px;
      overflow-y: auto;
    }

    .notif-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background 0.12s ease;
      position: relative;
    }

    .notif-row:hover {
      background-color: var(--surface-secondary);
    }

    .notif-row.unread {
      background-color: rgba(16, 185, 129, 0.04);
    }

    .notif-indicator {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background-color: var(--accent-emerald);
      margin-top: 5px;
      flex-shrink: 0;
    }

    .notif-content {
      flex: 1;
      min-width: 0;
    }

    .notif-item-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      display: block;
      margin-bottom: 2px;
    }

    .notif-item-msg {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .notif-item-time {
      font-size: 10px;
      color: var(--text-muted);
    }

    .notif-footer {
      padding: 10px 16px;
      text-align: center;
      border-top: 1px solid var(--border-subtle);
      background-color: var(--surface-secondary);
    }

    .view-all-link {
      font-size: 12px;
      font-weight: 500;
      color: var(--accent-emerald);
      text-decoration: none;
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    .user-avatar-btn {
      background: transparent;
      border: 1px solid #3F3F46;
      padding: 2px;
      cursor: pointer;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 160ms ease, transform 160ms ease;
    }

    .user-avatar-btn:hover {
      border-color: #10B981;
      transform: translateY(-1px);
    }
  `]
})
export class TopnavComponent {
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  public dataService = inject(DataService);
  public themeService = inject(ThemeService);
  public timerService = inject(TimerService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public isNotifOpen = signal<boolean>(false);

  get unreadCount(): number {
    return this.dataService.notifications().filter(n => !n.read).length;
  }

  openCommandPalette(): void {
    this.modalService.openCommandPalette();
  }

  toggleNotifications(): void {
    this.isNotifOpen.update(v => !v);
  }

  markAllAsRead(): void {
    this.dataService.markAllNotificationsAsRead();
    this.notifService.success('Notifications marked as read');
  }

  onNotifClick(id: string): void {
    this.dataService.markNotificationAsRead(id);
    this.isNotifOpen.set(false);
  }
}

