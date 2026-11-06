import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MemberWorkload } from '../../core/models/resource.model';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, ProgressBarComponent],
  template: `
    <div class="resources-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Management</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Resource Management</span>
          </div>
          <h1 class="page-title">Workload Allocation & Capacity Heatmap</h1>
          <p class="page-subtitle">
            Prevent engineering burnout, identify available talent, and optimize sprint utilization
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-secondary"
            (click)="notifService.success('Rebalance Triggered', 'Predictive ML algorithm recommended 2 task transfers')"
          >
            <app-icon name="zap" [size]="15"></app-icon>
            <span>Auto-Rebalance Workload</span>
          </button>
        </div>
      </header>

      <!-- Heatmap Summary Warning Banner -->
      <div class="warning-banner">
        <app-icon name="alert-triangle" [size]="18" customClass="w-icon"></app-icon>
        <div class="w-text">
          <strong>2 Engineers Over-Allocated (&gt;100%):</strong> Pooja Sundaram (105%) and Priya Sharma (110%) are exceeding 40h standard weekly velocity. Consider delegating sharding tasks to available team members.
        </div>
      </div>

      <!-- Heatmap Grid Card -->
      <div class="orbit-card">
        <div class="orbit-card-header">
          <div>
            <h3 class="orbit-card-title">
              <app-icon name="layers" [size]="16"></app-icon>
              <span>Weekly Engineering Capacity Matrix</span>
            </h3>
            <span class="orbit-card-subtitle">Week of Nov 3 – Nov 7, 2026 (Sprint 42)</span>
          </div>
          <div class="heatmap-legend">
            <span class="hl-item"><span class="hl-swatch under"></span> Under (&lt;70%)</span>
            <span class="hl-item"><span class="hl-swatch optimal"></span> Optimal (70–90%)</span>
            <span class="hl-item"><span class="hl-swatch over"></span> Overloaded (&gt;90%)</span>
          </div>
        </div>

        <div class="orbit-card-body p-0">
          <div class="orbit-table-container">
            <table class="orbit-table heatmap-table">
              <thead>
                <tr>
                  <th style="width: 260px;">Engineer</th>
                  <th>Weekly Load</th>
                  <th class="text-center">Mon (11/03)</th>
                  <th class="text-center">Tue (11/04)</th>
                  <th class="text-center">Wed (11/05)</th>
                  <th class="text-center">Thu (11/06)</th>
                  <th class="text-center">Fri (11/07)</th>
                  <th>Allocated Initiatives</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let w of dataService.memberWorkloads()">
                  <td>
                    <div class="engineer-cell">
                      <app-avatar [src]="w.userAvatar" [name]="w.userName" size="sm"></app-avatar>
                      <div class="eng-info">
                        <span class="eng-name">{{ w.userName }}</span>
                        <span class="eng-role">{{ w.roleTitle }}</span>
                      </div>
                    </div>
                  </td>
                  <td style="min-width: 140px;">
                    <div class="load-cell-wrap">
                      <div class="load-top-txt">
                        <span>{{ w.assignedHours }}h / {{ w.weeklyCapacity }}h</span>
                        <span [class.overload-txt]="w.utilizationPercentage > 90">{{ w.utilizationPercentage }}%</span>
                      </div>
                      <app-progress-bar
                        [value]="w.utilizationPercentage"
                        [height]="4"
                        [variant]="w.utilizationPercentage > 90 ? 'crimson' : w.utilizationPercentage > 75 ? 'amber' : 'emerald'"
                      ></app-progress-bar>
                    </div>
                  </td>
                  <td *ngFor="let day of w.days" class="text-center">
                    <div
                      class="heat-cell"
                      [ngClass]="day.status"
                    >
                      <span class="h-hours">{{ day.assignedHours }}h</span>
                    </div>
                  </td>
                  <td>
                    <div class="proj-chips-list">
                      <span *ngFor="let p of w.assignedProjects" class="proj-chip">
                        {{ p.projectName }} ({{ p.hours }}h)
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resources-viewport {
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

    .warning-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      background: var(--accent-amber-subtle);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: var(--text-primary);
      font-size: 13px;
      line-height: 1.45;
    }

    .w-icon {
      color: var(--accent-amber);
      flex-shrink: 0;
    }

    .p-0 { padding: 0; }

    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .hl-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .hl-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .hl-swatch.under { background: var(--surface-tertiary); border: 1px solid var(--border-default); }
    .hl-swatch.optimal { background: rgba(16, 185, 129, 0.4); border: 1px solid var(--accent-emerald); }
    .hl-swatch.over { background: rgba(239, 68, 68, 0.4); border: 1px solid var(--accent-crimson); }

    .heatmap-table th, .heatmap-table td {
      vertical-align: middle;
    }

    .text-center { text-align: center; }

    .engineer-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .eng-info {
      display: flex;
      flex-direction: column;
    }

    .eng-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .eng-role {
      font-size: 10px;
      color: var(--text-muted);
    }

    .load-cell-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .load-top-txt {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }

    .overload-txt {
      color: var(--accent-crimson);
      font-weight: 700;
    }

    /* Heat cells */
    .heat-cell {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 32px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 600;
    }

    .heat-cell.normal {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-emerald);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .heat-cell.overloaded {
      background: rgba(239, 68, 68, 0.18);
      color: var(--accent-crimson);
      border: 1px solid rgba(239, 68, 68, 0.35);
    }

    .heat-cell.underutilized {
      background: var(--surface-tertiary);
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
    }

    .proj-chips-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .proj-chip {
      font-size: 10px;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }
  `]
})
export class ResourcesComponent {
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);
}

