import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ProgressBarComponent],
  template: `
    <div class="analytics-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Management</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Analytics & Telemetry</span>
          </div>
          <h1 class="page-title">Engineering Velocity & Predictive Analytics</h1>
          <p class="page-subtitle">
            Deep statistical models analyzing sprint cycle time, pull request throughput, and risk forecasting
          </p>
        </div>

        <div class="header-right">
          <div class="period-toggle-group">
            <button
              type="button"
              class="p-btn"
              [class.active]="selectedPeriod === 'week'"
              (click)="selectedPeriod = 'week'"
            >
              This Week
            </button>
            <button
              type="button"
              class="p-btn"
              [class.active]="selectedPeriod === 'month'"
              (click)="selectedPeriod = 'month'"
            >
              This Month
            </button>
            <button
              type="button"
              class="p-btn"
              [class.active]="selectedPeriod === 'quarter'"
              (click)="selectedPeriod = 'quarter'"
            >
              This Quarter
            </button>
          </div>
        </div>
      </header>

      <!-- Stat Badges Row -->
      <section class="stat-badges-row">
        <div class="stat-banner">
          <div class="sb-top">
            <span class="sb-label">MEAN CYCLE TIME</span>
            <app-icon name="clock" [size]="15" customClass="emerald"></app-icon>
          </div>
          <span class="sb-val">3.2 Days</span>
          <span class="sb-trend positive">↓ 18% vs Q3 baseline (Faster)</span>
        </div>

        <div class="stat-banner">
          <div class="sb-top">
            <span class="sb-label">PULL REQUEST THROUGHPUT</span>
            <app-icon name="check-square" [size]="15" customClass="amber"></app-icon>
          </div>
          <span class="sb-val">142 Merges</span>
          <span class="sb-trend positive">↑ 24% sprint cadence</span>
        </div>

        <div class="stat-banner">
          <div class="sb-top">
            <span class="sb-label">CHANGE FAILURE RATE</span>
            <app-icon name="shield" [size]="15" customClass="crimson"></app-icon>
          </div>
          <span class="sb-val">0.04%</span>
          <span class="sb-trend positive">DORA Elite Threshold</span>
        </div>

        <div class="stat-banner">
          <div class="sb-top">
            <span class="sb-label">PREDICTIVE HEALTH INDEX</span>
            <app-icon name="trending-up" [size]="15" customClass="purple"></app-icon>
          </div>
          <span class="sb-val">96.2 / 100</span>
          <span class="sb-trend positive">94% forecast precision</span>
        </div>
      </section>

      <!-- Charts 2-Column Grid -->
      <div class="analytics-charts-grid">
        <!-- Chart 1: Donut Distribution of Task Workloads -->
        <div class="orbit-card">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="target" [size]="16"></app-icon>
              <span>Task Distribution by State</span>
            </h3>
            <span class="orbit-card-subtitle">55 enterprise tickets</span>
          </div>

          <div class="orbit-card-body donut-chart-layout">
            <!-- SVG Donut Chart -->
            <div class="donut-svg-wrap">
              <svg width="180" height="180" viewBox="0 0 180 180" class="donut-svg">
                <!-- Donut segments -->
                <circle cx="90" cy="90" r="70" fill="transparent" stroke="var(--surface-tertiary)" stroke-width="22"/>
                <!-- Completed (Emerald) 42% -->
                <circle cx="90" cy="90" r="70" fill="transparent" stroke="#10B981" stroke-width="22" stroke-dasharray="184 440" stroke-dashoffset="0"/>
                <!-- In Progress (Amber) 28% -->
                <circle cx="90" cy="90" r="70" fill="transparent" stroke="#F59E0B" stroke-width="22" stroke-dasharray="123 440" stroke-dashoffset="-184"/>
                <!-- Review (Purple) 15% -->
                <circle cx="90" cy="90" r="70" fill="transparent" stroke="#8B5CF6" stroke-width="22" stroke-dasharray="66 440" stroke-dashoffset="-307"/>
                <!-- Blocked (Crimson) 5% -->
                <circle cx="90" cy="90" r="70" fill="transparent" stroke="#EF4444" stroke-width="22" stroke-dasharray="22 440" stroke-dashoffset="-373"/>
              </svg>
              <div class="donut-center-label">
                <span class="c-val">55</span>
                <span class="c-txt">Tasks</span>
              </div>
            </div>

            <!-- Donut Legend Breakdown -->
            <div class="donut-legend-list">
              <div class="dl-item">
                <span class="dl-dot emerald"></span>
                <span class="dl-name">Completed</span>
                <span class="dl-count">23 (42%)</span>
              </div>
              <div class="dl-item">
                <span class="dl-dot amber"></span>
                <span class="dl-name">In Progress</span>
                <span class="dl-count">15 (28%)</span>
              </div>
              <div class="dl-item">
                <span class="dl-dot purple"></span>
                <span class="dl-name">Review</span>
                <span class="dl-count">8 (15%)</span>
              </div>
              <div class="dl-item">
                <span class="dl-dot crimson"></span>
                <span class="dl-name">Blocked</span>
                <span class="dl-count">3 (5%)</span>
              </div>
              <div class="dl-item">
                <span class="dl-dot graphite"></span>
                <span class="dl-name">Backlog & To Do</span>
                <span class="dl-count">6 (10%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart 2: Team Capacity Distribution -->
        <div class="orbit-card">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="layers" [size]="16"></app-icon>
              <span>Capacity by Department</span>
            </h3>
            <span class="orbit-card-subtitle">Sprint 42 active engineering hours</span>
          </div>

          <div class="orbit-card-body">
            <div class="dept-bars-stack">
              <div class="d-bar-row">
                <div class="d-info">
                  <span class="d-name">Core Platform & Architecture</span>
                  <span class="d-hours">152h / 160h (95%)</span>
                </div>
                <app-progress-bar [value]="95" [height]="6" variant="emerald"></app-progress-bar>
              </div>

              <div class="d-bar-row">
                <div class="d-info">
                  <span class="d-name">Design Systems & UX</span>
                  <span class="d-hours">168h / 160h (105%)</span>
                </div>
                <app-progress-bar [value]="105" [height]="6" variant="crimson"></app-progress-bar>
              </div>

              <div class="d-bar-row">
                <div class="d-info">
                  <span class="d-name">Cloud & Infrastructure SRE</span>
                  <span class="d-hours">128h / 160h (80%)</span>
                </div>
                <app-progress-bar [value]="80" [height]="6" variant="emerald"></app-progress-bar>
              </div>

              <div class="d-bar-row">
                <div class="d-info">
                  <span class="d-name">Data Intelligence & ML</span>
                  <span class="d-hours">118h / 160h (74%)</span>
                </div>
                <app-progress-bar [value]="74" [height]="6" variant="emerald"></app-progress-bar>
              </div>

              <div class="d-bar-row">
                <div class="d-info">
                  <span class="d-name">Enterprise Security</span>
                  <span class="d-hours">140h / 160h (88%)</span>
                </div>
                <app-progress-bar [value]="88" [height]="6" variant="amber"></app-progress-bar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-viewport {
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

    .period-toggle-group {
      display: flex;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .p-btn {
      height: 32px;
      padding: 0 14px;
      font-size: 12px;
      font-weight: 500;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .p-btn.active {
      background: var(--surface-tertiary);
      color: var(--accent-emerald);
      font-weight: 600;
    }

    /* Stat Badges */
    .stat-badges-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .stat-badges-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .stat-badges-row {
        grid-template-columns: 1fr;
      }
    }

    .stat-banner {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: var(--shadow-sm);
    }

    .sb-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sb-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
    }

    .sb-val {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .sb-trend {
      font-size: 11px;
      font-weight: 600;
    }
    .sb-trend.positive {
      color: var(--accent-emerald);
    }

    .emerald { color: var(--accent-emerald); }
    .amber { color: var(--accent-amber); }
    .crimson { color: var(--accent-crimson); }
    .purple { color: var(--accent-purple); }

    /* Analytics Grid */
    .analytics-charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 900px) {
      .analytics-charts-grid {
        grid-template-columns: 1fr;
      }
    }

    .donut-chart-layout {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 20px;
      padding: 24px;
    }

    .donut-svg-wrap {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .donut-svg {
      transform: rotate(-90deg);
    }

    .donut-center-label {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .c-val {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .c-txt {
      font-size: 11px;
      color: var(--text-muted);
    }

    .donut-legend-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .dl-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
    }

    .dl-dot {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .dl-dot.emerald { background: #10B981; }
    .dl-dot.amber { background: #F59E0B; }
    .dl-dot.purple { background: #8B5CF6; }
    .dl-dot.crimson { background: #EF4444; }
    .dl-dot.graphite { background: #525252; }

    .dl-name {
      color: var(--text-secondary);
      min-width: 110px;
    }

    .dl-count {
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Capacity Stack */
    .dept-bars-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .d-bar-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .d-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .d-hours {
      color: var(--text-muted);
      font-size: 11px;
    }
  `]
})
export class AnalyticsComponent {
  public dataService = inject(DataService);
  public selectedPeriod = 'quarter';
}

