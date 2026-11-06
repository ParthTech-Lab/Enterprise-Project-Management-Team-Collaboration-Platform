import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { formatINR } from '../../core/utils/currency.util';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="reports-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Management</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Reports</span>
          </div>
          <h1 class="page-title">Executive Performance & Delivery Reports</h1>
          <p class="page-subtitle">
            Cross-portfolio financial audit, sprint completion velocity, and deadline adherence
          </p>
        </div>

        <div class="header-right">
          <select class="orbit-select" [(ngModel)]="dateRange" style="width: 170px;">
            <option value="q4">Current Quarter (Q4 2026)</option>
            <option value="last30">Last 30 Days</option>
            <option value="ytd">Year to Date (2026)</option>
          </select>

          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="exportReport()"
          >
            <app-icon name="download" [size]="15"></app-icon>
            <span>Export Executive PDF</span>
          </button>
        </div>
      </header>

      <!-- Executive Scorecards Row -->
      <section class="scorecards-grid">
        <div class="sc-card">
          <span class="sc-label">TOTAL ALLOCATED BUDGET</span>
          <span class="sc-value">₹34.66 Cr</span>
          <div class="sc-meta">
            <span class="sc-spent">₹24.39 Cr spent (70.4%)</span>
            <app-badge variant="emerald" size="sm">+16% under budget</app-badge>
          </div>
        </div>

        <div class="sc-card">
          <span class="sc-label">SPRINT VELOCITY RATE</span>
          <span class="sc-value">91.4%</span>
          <div class="sc-meta">
            <span class="sc-sub">48 avg points / sprint</span>
            <app-badge variant="emerald" size="sm">Top Tier Pacing</app-badge>
          </div>
        </div>

        <div class="sc-card">
          <span class="sc-label">DEADLINE ADHERENCE</span>
          <span class="sc-value">94.8%</span>
          <div class="sc-meta">
            <span class="sc-sub">98 on-time milestone cuts</span>
            <app-badge variant="emerald" size="sm">+3.2% vs Q3</app-badge>
          </div>
        </div>

        <div class="sc-card">
          <span class="sc-label">TEAM CAPACITY UTILIZATION</span>
          <span class="sc-value">84.2%</span>
          <div class="sc-meta">
            <span class="sc-sub">Optimal sustainable load</span>
            <app-badge variant="amber" size="sm">2 Overallocated</app-badge>
          </div>
        </div>
      </section>

      <!-- Project Delivery Performance Report Table -->
      <div class="orbit-card">
        <div class="orbit-card-header">
          <div>
            <h3 class="orbit-card-title">
              <app-icon name="bar-chart" [size]="16"></app-icon>
              <span>Project Delivery Performance Breakdown</span>
            </h3>
            <span class="orbit-card-subtitle">Budget utilization, milestone adherence, and health indicators</span>
          </div>
          <button type="button" class="orbit-btn orbit-btn-secondary orbit-btn-sm" (click)="notifService.success('Filtered Report', 'Showing all 11 active portfolios')">
            Filter View
          </button>
        </div>

        <div class="orbit-card-body p-0">
          <div class="orbit-table-container">
            <table class="orbit-table">
              <thead>
                <tr>
                  <th>Initiative</th>
                  <th>Owning Team</th>
                  <th>Budget Allocated (INR)</th>
                  <th>Budget Spent (INR)</th>
                  <th>Progress</th>
                  <th>Milestones</th>
                  <th>Health Index</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of dataService.projects()">
                  <td>
                    <div class="proj-cell">
                      <span class="p-key">{{ p.key }}</span>
                      <span class="p-name">{{ p.name }}</span>
                    </div>
                  </td>
                  <td><span class="p-team">{{ p.teamName }}</span></td>
                  <td><strong>{{ formatBudget(p.budget.allocated) }}</strong></td>
                  <td>{{ formatBudget(p.budget.spent) }}</td>
                  <td style="min-width: 140px;">
                    <div class="prog-wrap">
                      <app-progress-bar [value]="p.progress" [height]="5"></app-progress-bar>
                      <span class="prog-txt">{{ p.progress }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="ms-pill">{{ p.milestones.length }} Phase Milestones</span>
                  </td>
                  <td>
                    <app-badge
                      [variant]="p.health === 'healthy' ? 'emerald' : p.health === 'needs_attention' ? 'amber' : 'crimson'"
                      size="sm"
                      [dot]="true"
                    >
                      {{ p.healthScore }}% Score
                    </app-badge>
                  </td>
                  <td>
                    <app-badge [variant]="p.status === 'active' ? 'emerald' : p.status === 'at_risk' ? 'crimson' : 'graphite'" size="sm">
                      {{ p.status | uppercase }}
                    </app-badge>
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
    .reports-viewport {
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

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Scorecards */
    .scorecards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .scorecards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .scorecards-grid {
        grid-template-columns: 1fr;
      }
    }

    .sc-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: var(--shadow-sm);
    }

    .sc-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .sc-value {
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .sc-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .sc-spent, .sc-sub {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .p-0 { padding: 0; }

    .proj-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .p-key {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .p-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .p-team {
      font-size: 11px;
      color: var(--text-muted);
    }

    .prog-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .prog-txt {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .ms-pill {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class ReportsComponent {
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public dateRange = 'q4';

  formatBudget(amount: number): string {
    return formatINR(amount, { compact: true });
  }

  exportReport(): void {
    this.notifService.success('Report Exported', 'Executive briefing package downloaded (PDF format)');
  }
}

