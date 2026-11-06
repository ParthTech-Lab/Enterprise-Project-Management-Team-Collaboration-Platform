import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number | string;
  badgeVariant?: 'emerald' | 'amber' | 'crimson' | 'purple' | 'graphite';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, AvatarComponent, BadgeComponent],
  template: `
    <aside
      class="orbit-sidebar"
      [class.collapsed]="collapsed"
      [class.mobile-open]="mobileOpen"
    >
      <!-- Brand & Workspace Header -->
      <div class="sidebar-header">
        <div class="brand-logo-area" routerLink="/dashboard">
          <div class="brand-mark">
            <div class="brand-inner-orb"></div>
          </div>
          <div class="brand-text" *ngIf="!collapsed">
            <span class="brand-name">VERTEX</span>
            <span class="brand-edition">Enterprise OS</span>
          </div>
        </div>

        <button
          type="button"
          class="collapse-toggle-btn"
          (click)="toggleCollapse.emit()"
          [attr.title]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <app-icon
            [name]="collapsed ? 'chevron-right' : 'chevron-left'"
            [size]="16"
          ></app-icon>
        </button>
      </div>

      <!-- Workspace Selector Dropdown -->
      <div class="workspace-selector-wrapper" *ngIf="!collapsed">
        <div class="workspace-pill" (click)="toggleWorkspaceMenu()">
          <div class="ws-avatar">VTX</div>
          <div class="ws-info">
            <span class="ws-name">Global Tech Enterprise</span>
            <span class="ws-tier">Enterprise Cloud · India Tech Hub</span>
          </div>
          <app-icon name="chevron-down" [size]="14" customClass="ws-caret"></app-icon>
        </div>
      </div>

      <!-- Navigation Sections Container -->
      <div class="sidebar-nav-scroll">
        <div *ngFor="let section of navSections" class="nav-section-group">
          <div class="nav-section-header" *ngIf="!collapsed">
            <span>{{ section.title }}</span>
          </div>

          <ul class="nav-list">
            <li *ngFor="let item of section.items" class="nav-item">
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                class="nav-link"
                [attr.title]="collapsed ? item.label : null"
                (click)="onLinkClick()"
              >
                <app-icon [name]="item.icon" [size]="18" customClass="nav-icon"></app-icon>
                <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span class="nav-badge-wrap" *ngIf="!collapsed && item.badge">
                  <app-badge [variant]="item.badgeVariant || 'graphite'" size="sm">
                    {{ item.badge }}
                  </app-badge>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom User Profile & Status Footer -->
      <div class="sidebar-footer">
        <div
          class="user-profile-tile"
          [attr.title]="collapsed ? dataService.currentUser().name : null"
          (click)="openProfileDrawer()"
        >
          <app-avatar
            [src]="dataService.currentUser().avatar"
            [name]="dataService.currentUser().name"
            [status]="dataService.currentUser().status"
            size="sm"
          ></app-avatar>
          <div class="user-meta" *ngIf="!collapsed">
            <span class="user-name">{{ dataService.currentUser().name }}</span>
            <span class="user-role">{{ dataService.currentUser().roleTitle }}</span>
          </div>
          <app-icon
            *ngIf="!collapsed"
            name="sliders"
            [size]="15"
            customClass="user-action-icon"
          ></app-icon>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .orbit-sidebar {
      width: 260px;
      height: 100vh;
      background-color: var(--surface-primary);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      z-index: 200;
    }

    .orbit-sidebar.collapsed {
      width: 68px;
    }

    /* Brand Header */
    .sidebar-header {
      height: 60px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
    }

    .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #262626 0%, #171717 100%);
      border: 1px solid #3f3f3f;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      position: relative;
    }

    .brand-inner-orb {
      width: 14px;
      height: 14px;
      border-radius: 9999px;
      background: radial-gradient(circle at 35% 35%, #34D399 0%, #10B981 70%, #047857 100%);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .brand-edition {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .collapse-toggle-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .collapse-toggle-btn:hover {
      background: var(--surface-tertiary);
      color: var(--text-primary);
      border-color: var(--border-subtle);
    }

    /* Workspace Selector */
    .workspace-selector-wrapper {
      padding: 10px 12px 6px;
    }

    .workspace-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .workspace-pill:hover {
      background: var(--surface-tertiary);
      border-color: var(--border-default);
    }

    .ws-avatar {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: #171717;
      border: 1px solid #333333;
      color: #10B981;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ws-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .ws-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.25;
    }

    .ws-tier {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .ws-caret {
      color: var(--text-muted);
    }

    /* Nav Scroll Container */
    .sidebar-nav-scroll {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 8px 16px;
    }

    .nav-section-group {
      margin-bottom: 14px;
    }

    .nav-section-header {
      padding: 6px 10px 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 36px;
      padding: 0 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 150ms ease-out;
      position: relative;
      border-left: 2px solid transparent;
    }

    .orbit-sidebar.collapsed .nav-link {
      justify-content: center;
      padding: 0;
    }

    .nav-link:hover {
      background-color: var(--surface-secondary);
      color: var(--text-primary);
    }

    .nav-link.active {
      background-color: var(--surface-elevated);
      color: var(--text-primary);
      font-weight: 600;
      border-left: 2px solid var(--accent-emerald);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .nav-link.active::before {
      display: none;
    }

    .nav-icon {
      color: var(--text-muted);
      transition: color 150ms ease-out, transform 150ms ease-out;
    }

    .nav-link:hover .nav-icon,
    .nav-link.active .nav-icon {
      color: var(--accent-emerald);
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-badge-wrap {
      margin-left: auto;
    }

    /* Bottom User Profile */
    .sidebar-footer {
      padding: 10px 10px;
      border-top: 1px solid var(--border-subtle);
      background-color: var(--surface-primary);
    }

    .user-profile-tile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .orbit-sidebar.collapsed .user-profile-tile {
      justify-content: center;
      padding: 6px 0;
    }

    .user-profile-tile:hover {
      background-color: var(--surface-secondary);
    }

    .user-meta {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .user-role {
      font-size: 10px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-action-icon {
      color: var(--text-muted);
      transition: color 0.15s ease;
    }

    .user-profile-tile:hover .user-action-icon {
      color: var(--text-primary);
    }

    /* Mobile Drawer */
    @media (max-width: 992px) {
      .orbit-sidebar {
        position: fixed;
        left: -260px;
        top: 0;
        bottom: 0;
        z-index: 1000;
      }
      .orbit-sidebar.mobile-open {
        transform: translateX(260px);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  public dataService = inject(DataService);
  public modalService = inject(ModalService);

  public navSections: NavSection[] = [
    {
      title: 'Workspace',
      items: [
        { label: 'Overview', route: '/dashboard', icon: 'dashboard' },
        { label: 'My Work', route: '/my-work', icon: 'check-square', badge: 14, badgeVariant: 'amber' },
        { label: 'Projects', route: '/projects', icon: 'folder', badge: 11, badgeVariant: 'graphite' },
        { label: 'Tasks', route: '/tasks', icon: 'list', badge: 55, badgeVariant: 'graphite' },
        { label: 'Calendar', route: '/calendar', icon: 'calendar', badge: '7 Evt', badgeVariant: 'purple' },
        { label: 'Timeline', route: '/timeline', icon: 'timeline' },
        { label: 'Kanban', route: '/kanban', icon: 'kanban' },
        { label: 'Goals & OKRs', route: '/goals', icon: 'target' }
      ]
    },
    {
      title: 'Collaboration',
      items: [
        { label: 'Teams', route: '/teams', icon: 'users', badge: 8, badgeVariant: 'graphite' },
        { label: 'Members', route: '/members', icon: 'user', badge: 20, badgeVariant: 'graphite' },
        { label: 'Chat', route: '/chat', icon: 'message-square', badge: 3, badgeVariant: 'emerald' },
        { label: 'Documents', route: '/documents', icon: 'file-text', badge: 12, badgeVariant: 'graphite' },
        { label: 'Activity', route: '/activity', icon: 'activity' }
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Reports', route: '/reports', icon: 'bar-chart' },
        { label: 'Analytics', route: '/analytics', icon: 'trending-up' },
        { label: 'Resources', route: '/resources', icon: 'layers', badge: 'Alert', badgeVariant: 'crimson' },
        { label: 'Time Tracking', route: '/time-tracking', icon: 'clock' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Organization', route: '/admin/organization', icon: 'server' },
        { label: 'Roles & Permissions', route: '/admin/roles', icon: 'shield' },
        { label: 'Integrations', route: '/admin/integrations', icon: 'zap' },
        { label: 'Billing', route: '/admin/billing', icon: 'credit-card' },
        { label: 'Settings', route: '/admin/settings', icon: 'settings' }
      ]
    }
  ];

  toggleWorkspaceMenu(): void {
    // Dropdown or modal can be invoked
  }

  openProfileDrawer(): void {
    this.modalService.openMemberDrawer(this.dataService.currentUser());
  }

  onLinkClick(): void {
    if (this.mobileOpen) {
      this.closeMobile.emit();
    }
  }
}

