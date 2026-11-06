import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { User, MemberStatus } from '../../core/models/user.model';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="members-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Collaboration</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Member Directory</span>
          </div>
          <h1 class="page-title">Enterprise Personnel & Talent Directory</h1>
          <p class="page-subtitle">
            20 global staff engineers, architects, designers, and leadership across Bengaluru, Mumbai, Pune & Hyderabad
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="notifService.info('Invite Member', 'SSO invitation link generated for new team members')"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Invite Member</span>
          </button>
        </div>
      </header>

      <!-- Search & Status Filters -->
      <section class="toolbar-card">
        <div class="search-input-box">
          <app-icon name="search" [size]="15" customClass="tb-search-icon"></app-icon>
          <input
            type="text"
            class="tb-input"
            placeholder="Search by name, role, department, or skill..."
            [(ngModel)]="searchQuery"
          />
        </div>

        <div class="filter-pills-row">
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'all'"
            (click)="selectedStatus = 'all'"
          >
            All Members ({{ dataService.users().length }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'online'"
            (click)="selectedStatus = 'online'"
          >
            Online ({{ countStatus('online') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'busy'"
            (click)="selectedStatus = 'busy'"
          >
            Busy ({{ countStatus('busy') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'away'"
            (click)="selectedStatus = 'away'"
          >
            Away ({{ countStatus('away') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'offline'"
            (click)="selectedStatus = 'offline'"
          >
            Offline ({{ countStatus('offline') }})
          </button>
        </div>
      </section>

      <!-- Members Grid Cards -->
      <div class="members-grid">
        <div
          *ngFor="let u of filteredUsers()"
          class="member-card"
          (click)="modalService.openMemberDrawer(u)"
        >
          <div class="member-card-top">
            <app-avatar
              [src]="u.avatar"
              [name]="u.name"
              [status]="u.status"
              size="lg"
            ></app-avatar>
            <div class="member-meta">
              <div class="name-status-row">
                <h3 class="m-name">{{ u.name }}</h3>
                <app-badge [variant]="u.status === 'online' ? 'emerald' : u.status === 'busy' ? 'crimson' : u.status === 'away' ? 'amber' : 'graphite'" size="sm" [dot]="true">
                  {{ u.status | uppercase }}
                </app-badge>
              </div>
              <span class="m-role">{{ u.roleTitle }}</span>
              <span class="m-dept">{{ u.department }}</span>
            </div>
          </div>

          <div class="location-tz-row">
            <span class="loc-txt">{{ u.location }}</span>
            <span class="tz-txt">{{ u.timezone }}</span>
          </div>

          <!-- Capacity Bar -->
          <div class="workload-section">
            <div class="wl-label-row">
              <span>Workload Allocation</span>
              <span [class.overload-txt]="u.workloadPercentage > 90">{{ u.workloadPercentage }}%</span>
            </div>
            <app-progress-bar
              [value]="u.workloadPercentage"
              [height]="4"
              [variant]="u.workloadPercentage > 90 ? 'crimson' : u.workloadPercentage > 75 ? 'amber' : 'emerald'"
            ></app-progress-bar>
          </div>

          <!-- Member Stats & Footer -->
          <div class="member-stats-row">
            <div class="stat-mini">
              <span class="s-val">{{ u.activeProjectsCount }}</span>
              <span class="s-lbl">Projects</span>
            </div>
            <div class="stat-mini">
              <span class="s-val">{{ u.openTasksCount }}</span>
              <span class="s-lbl">Open Tasks</span>
            </div>
            <div class="stat-mini">
              <span class="s-val">{{ u.completedTasksCount }}</span>
              <span class="s-lbl">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .members-viewport {
      padding: 24px;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 16px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
    }

    .search-input-box {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 300px;
      height: 34px;
      padding: 0 10px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
    }
    .tb-search-icon { color: var(--text-muted); }
    .tb-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 13px;
      color: var(--text-primary);
    }

    .filter-pills-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      height: 28px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 9999px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
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

    /* Members Grid */
    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .member-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--shadow-sm);
    }

    .member-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .member-card-top {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .member-meta {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .name-status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .m-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .m-role {
      font-size: 12px;
      font-weight: 500;
      color: var(--accent-emerald);
      margin-top: 1px;
    }

    .m-dept {
      font-size: 11px;
      color: var(--text-muted);
    }

    .location-tz-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
      padding: 6px 10px;
      background: var(--surface-secondary);
      border-radius: var(--radius-sm);
    }

    .workload-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .wl-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .overload-txt {
      color: var(--accent-crimson);
      font-weight: 700;
    }

    .member-stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      border-top: 1px solid var(--border-subtle);
      padding-top: 12px;
      text-align: center;
    }

    .stat-mini {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .s-val {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .s-lbl {
      font-size: 10px;
      color: var(--text-muted);
    }
  `]
})
export class MembersComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public searchQuery = '';
  public selectedStatus: string = 'all';

  countStatus(status: MemberStatus): number {
    return this.dataService.users().filter(u => u.status === status).length;
  }

  public filteredUsers = computed(() => {
    let list = this.dataService.users();
    if (this.selectedStatus !== 'all') {
      list = list.filter(u => u.status === this.selectedStatus);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.roleTitle.toLowerCase().includes(q) ||
          u.skills.some(s => s.name.toLowerCase().includes(q))
      );
    }
    return list;
  });
}

