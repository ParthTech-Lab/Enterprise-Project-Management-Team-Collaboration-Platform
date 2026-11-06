import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { SparklineComponent } from '../../shared/components/sparkline/sparkline.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { TimerService } from '../../core/services/timer.service';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    AvatarComponent,
    BadgeComponent,
    ProgressBarComponent,
    SparklineComponent
  ],
  template: `
    <div class="dashboard-viewport">
      <!-- Enterprise Executive Welcome Bar -->
      <section class="dashboard-hero">
        <div class="hero-left">
          <div class="greeting-row">
            <h1 class="hero-title">Good morning, {{ dataService.currentUser().name }}</h1>
            <app-badge variant="emerald" size="sm" [dot]="true">Live Architecture Core</app-badge>
          </div>
          <p class="hero-sub">
            Global Tech Enterprise • Q4 Sprint 42 • {{ currentDateStr }} • 
            <span class="health-highlight">System Status: 99.99% Nominal</span>
          </p>
        </div>

        <div class="hero-actions">
          <button type="button" class="orbit-btn orbit-btn-secondary" (click)="openQuickTimer()">
            <app-icon name="clock" [size]="14"></app-icon>
            <span>{{ timerService.isRunning() ? 'Timer: ' + timerService.formattedTime() : 'Track Time' }}</span>
          </button>
          <button type="button" class="orbit-btn orbit-btn-primary" (click)="modalService.openTaskModal()">
            <app-icon name="plus" [size]="15"></app-icon>
            <span>New Task</span>
          </button>
          <button type="button" class="orbit-btn orbit-btn-outline" (click)="modalService.openProjectModal()">
            <app-icon name="folder" [size]="15"></app-icon>
            <span>New Project</span>
          </button>
        </div>
      </section>

      <!-- Key KPI Statistics Cards -->
      <section class="kpi-grid">
        <!-- Active Projects -->
        <div class="kpi-card" routerLink="/projects">
          <div class="kpi-top">
            <span class="kpi-label">ACTIVE PROJECTS</span>
            <div class="kpi-icon-box emerald">
              <app-icon name="folder" [size]="16"></app-icon>
            </div>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">{{ dataService.dashboardStats().activeProjects }}</span>
            <span class="kpi-total">/ {{ dataService.dashboardStats().totalProjects }} Total</span>
          </div>
          <div class="kpi-trend">
            <app-sparkline
              [data]="[4, 6, 8, 7, 9, 10, 11]"
              strokeColor="#10B981"
              [width]="72"
              [height]="20"
            ></app-sparkline>
            <span class="trend-text positive">+2 this quarter</span>
          </div>
        </div>

        <!-- Tasks Completed -->
        <div class="kpi-card" routerLink="/tasks">
          <div class="kpi-top">
            <span class="kpi-label">TASKS COMPLETED</span>
            <div class="kpi-icon-box amber">
              <app-icon name="check-square" [size]="16"></app-icon>
            </div>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">{{ dataService.dashboardStats().completedTasks }}</span>
            <span class="kpi-total">/ {{ dataService.dashboardStats().totalTasks }} Closed</span>
          </div>
          <div class="kpi-trend">
            <app-sparkline
              [data]="[12, 19, 15, 24, 28, 35, 42]"
              strokeColor="#F59E0B"
              [width]="72"
              [height]="20"
            ></app-sparkline>
            <span class="trend-text positive">88.4% velocity</span>
          </div>
        </div>

        <!-- Overdue & At Risk -->
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">ITEMS AT RISK</span>
            <div class="kpi-icon-box crimson">
              <app-icon name="alert-triangle" [size]="16"></app-icon>
            </div>
          </div>
          <div class="kpi-main">
            <span class="kpi-value warning-text">{{ dataService.dashboardStats().atRiskProjects }}</span>
            <span class="kpi-total">Projects At Risk</span>
          </div>
          <div class="kpi-trend">
            <span class="risk-badge">1 Critical Blocked</span>
            <span class="trend-text muted">Vendor cert delay</span>
          </div>
        </div>

        <!-- Productivity Score -->
        <div class="kpi-card" routerLink="/analytics">
          <div class="kpi-top">
            <span class="kpi-label">PRODUCTIVITY SCORE</span>
            <div class="kpi-icon-box purple">
              <app-icon name="trending-up" [size]="16"></app-icon>
            </div>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">{{ dataService.dashboardStats().productivityScore }}%</span>
            <span class="kpi-total">Enterprise Index</span>
          </div>
          <div class="kpi-trend">
            <app-sparkline
              [data]="[86, 88, 87, 89, 90, 91.4]"
              strokeColor="#8B5CF6"
              [width]="72"
              [height]="20"
            ></app-sparkline>
            <span class="trend-text positive">Top 5% org tier</span>
          </div>
        </div>
      </section>

      <!-- Main Two-Column Enterprise Dashboard Layout -->
      <div class="dashboard-main-grid">
        <!-- Left Column: Project Health, Priority Tasks, Velocity Graph -->
        <div class="dashboard-col left-col">
          <!-- Active Strategic Projects Card -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <div>
                <h3 class="orbit-card-title">
                  <app-icon name="folder" [size]="17"></app-icon>
                  <span>Active Strategic Initiatives</span>
                </h3>
                <span class="orbit-card-subtitle">Real-time progress, health scores and milestone pacing</span>
              </div>
              <a routerLink="/projects" class="card-action-link">View All (11) →</a>
            </div>

            <div class="orbit-card-body p-0">
              <div class="table-compact-wrap">
                <table class="compact-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Owner</th>
                      <th>Progress</th>
                      <th>Health</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let p of dataService.projects().slice(0, 5)" [routerLink]="['/projects', p.id]" class="clickable-row">
                      <td class="proj-name-cell">
                        <span class="key-tag">{{ p.key }}</span>
                        <div class="title-sub">
                          <span class="p-title">{{ p.name }}</span>
                          <span class="p-team">{{ p.teamName }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="owner-cell">
                          <app-avatar [src]="p.ownerAvatar" [name]="p.ownerName" size="xs"></app-avatar>
                          <span>{{ p.ownerName }}</span>
                        </div>
                      </td>
                      <td class="progress-cell">
                        <div class="prog-bar-wrap">
                          <app-progress-bar [value]="p.progress" [height]="5"></app-progress-bar>
                          <span class="prog-num">{{ p.progress }}%</span>
                        </div>
                      </td>
                      <td>
                        <app-badge
                          [variant]="p.health === 'healthy' ? 'emerald' : p.health === 'needs_attention' ? 'amber' : 'crimson'"
                          size="sm"
                          [dot]="true"
                        >
                          {{ p.healthScore }}% {{ p.health === 'healthy' ? 'Nominal' : p.health === 'needs_attention' ? 'Watch' : 'At Risk' }}
                        </app-badge>
                      </td>
                      <td class="deadline-cell">{{ p.deadline }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Priority Engineering Tasks Card -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <div>
                <h3 class="orbit-card-title">
                  <app-icon name="check-square" [size]="17"></app-icon>
                  <span>Critical & High Priority Tasks</span>
                </h3>
                <span class="orbit-card-subtitle">Requires architectural signoff and sprint attention</span>
              </div>
              <a routerLink="/tasks" class="card-action-link">Open Backlog →</a>
            </div>

            <div class="orbit-card-body p-0">
              <div class="task-rows-list">
                <div
                  *ngFor="let t of getHighPriorityTasks()"
                  class="task-item-row"
                  (click)="modalService.openTaskDrawer(t)"
                >
                  <div class="task-status-dot" [ngClass]="t.status"></div>
                  <div class="task-info">
                    <div class="task-title-line">
                      <span class="t-key">{{ t.key }}</span>
                      <span class="t-title">{{ t.title }}</span>
                    </div>
                    <div class="task-meta-line">
                      <span class="t-proj">{{ t.projectName }}</span>
                      <span>•</span>
                      <span class="t-due">Due {{ t.dueDate }}</span>
                    </div>
                  </div>
                  <app-badge
                    [variant]="t.priority === 'critical' ? 'crimson' : 'amber'"
                    size="sm"
                  >
                    {{ t.priority | uppercase }}
                  </app-badge>
                  <app-avatar [src]="t.assigneeAvatar" [name]="t.assigneeName" size="xs"></app-avatar>
                </div>
              </div>
            </div>
          </div>

          <!-- Enterprise Velocity & Completion Trends -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <div>
                <h3 class="orbit-card-title">
                  <app-icon name="bar-chart" [size]="17"></app-icon>
                  <span>Sprint Velocity & Burn-Up Trajectory</span>
                </h3>
                <span class="orbit-card-subtitle">Aggregated story points completed across engineering teams</span>
              </div>
              <span class="velocity-badge">Average: 48 pts/sprint</span>
            </div>

            <div class="orbit-card-body">
              <!-- Visual Multi-Bar Chart -->
              <div class="velocity-chart-wrapper">
                <div *ngFor="let s of sprintVelocityData" class="sprint-bar-col">
                  <div class="bar-pair">
                    <div class="bar planned" [style.height.%]="s.planned" title="Planned: {{ s.planned }} pts"></div>
                    <div class="bar actual" [style.height.%]="s.actual" title="Completed: {{ s.actual }} pts"></div>
                  </div>
                  <span class="sprint-label">{{ s.label }}</span>
                </div>
              </div>

              <div class="chart-legend-row">
                <div class="legend-item">
                  <span class="legend-box planned"></span>
                  <span>Committed Velocity</span>
                </div>
                <div class="legend-item">
                  <span class="legend-box actual"></span>
                  <span>Actual Delivery (Emerald)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Resource Allocation, Deadlines, Activity Stream -->
        <div class="dashboard-col right-col">
          <!-- Upcoming Critical Deadlines -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="calendar" [size]="17"></app-icon>
                <span>Upcoming Milestones</span>
              </h3>
              <a routerLink="/calendar" class="card-action-link">Calendar →</a>
            </div>

            <div class="orbit-card-body p-0">
              <div class="events-compact-list">
                <div *ngFor="let evt of dataService.events().slice(0, 4)" class="event-row">
                  <div class="event-date-box">
                    <span class="e-month">{{ evt.startDate | slice:5:7 }}/{{ evt.startDate | slice:8:10 }}</span>
                    <span class="e-type">{{ evt.type | slice:0:3 | uppercase }}</span>
                  </div>
                  <div class="event-details">
                    <span class="e-title">{{ evt.title }}</span>
                    <span class="e-sub" *ngIf="evt.projectName">{{ evt.projectName }}</span>
                    <span class="e-time">{{ evt.startDate | slice:11:16 }} • {{ evt.location || 'Virtual' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Resource Capacity Meters -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="layers" [size]="17"></app-icon>
                <span>Team Resource Load</span>
              </h3>
              <a routerLink="/resources" class="card-action-link">Heatmap →</a>
            </div>

            <div class="orbit-card-body">
              <div class="workload-mini-list">
                <div *ngFor="let w of dataService.memberWorkloads().slice(0, 4)" class="workload-row">
                  <div class="workload-user">
                    <app-avatar [src]="w.userAvatar" [name]="w.userName" size="xs"></app-avatar>
                    <div class="w-user-meta">
                      <span class="w-name">{{ w.userName }}</span>
                      <span class="w-role">{{ w.roleTitle }}</span>
                    </div>
                  </div>
                  <div class="workload-meter">
                    <div class="w-meter-top">
                      <span>{{ w.assignedHours }}h / 40h</span>
                      <span [class.overload-txt]="w.utilizationPercentage > 90">{{ w.utilizationPercentage }}%</span>
                    </div>
                    <app-progress-bar
                      [value]="w.utilizationPercentage"
                      [height]="4"
                      [variant]="w.utilizationPercentage > 90 ? 'crimson' : w.utilizationPercentage > 75 ? 'amber' : 'emerald'"
                    ></app-progress-bar>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-Time Activity Audit Feed -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="activity" [size]="17"></app-icon>
                <span>Activity Audit Stream</span>
              </h3>
              <a routerLink="/activity" class="card-action-link">Full Log →</a>
            </div>

            <div class="orbit-card-body p-0">
              <div class="activity-stream">
                <div *ngFor="let act of dataService.activities().slice(0, 5)" class="act-stream-item">
                  <app-avatar [src]="act.actorAvatar" [name]="act.actorName" size="xs"></app-avatar>
                  <div class="act-text">
                    <div class="act-line">
                      <strong>{{ act.actorName }}</strong>
                      <span class="act-action">{{ act.action }}</span>
                      <span class="act-target">{{ act.targetTitle }}</span>
                    </div>
                    <span class="act-meta" *ngIf="act.details">{{ act.details }}</span>
                    <span class="act-time">{{ act.timestamp | slice:11:16 }} IST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Hero Welcome */
    .dashboard-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    @media (max-width: 850px) {
      .dashboard-hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }

    .greeting-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hero-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .hero-sub {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .health-highlight {
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }
    }

    .kpi-card {
      background: var(--surface-primary);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
      transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 180ms ease,
                  box-shadow 180ms ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
    }

    .kpi-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
    }

    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kpi-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .kpi-icon-box {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-icon-box.emerald {
      background: var(--accent-emerald-subtle);
      color: var(--accent-emerald);
    }
    .kpi-icon-box.amber {
      background: var(--accent-amber-subtle);
      color: var(--accent-amber);
    }
    .kpi-icon-box.crimson {
      background: var(--accent-crimson-subtle);
      color: var(--accent-crimson);
    }
    .kpi-icon-box.purple {
      background: var(--accent-purple-subtle);
      color: var(--accent-purple);
    }

    .kpi-main {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .kpi-value {
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .kpi-value.warning-text {
      color: var(--accent-crimson);
    }

    .kpi-total {
      font-size: 12px;
      color: var(--text-muted);
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 8px;
    }

    .trend-text {
      font-size: 11px;
      font-weight: 600;
    }

    .trend-text.positive {
      color: var(--accent-emerald);
    }

    .trend-text.muted {
      color: var(--text-muted);
    }

    .risk-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-crimson);
    }

    /* Main Dashboard Grid */
    .dashboard-main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    @media (max-width: 1100px) {
      .dashboard-main-grid {
        grid-template-columns: 1fr;
      }
    }

    .dashboard-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card-action-link {
      font-size: 12px;
      font-weight: 500;
      color: var(--accent-emerald);
      text-decoration: none;
    }

    .card-action-link:hover {
      text-decoration: underline;
    }

    .p-0 {
      padding: 0;
    }

    /* Compact Table */
    .table-compact-wrap {
      overflow-x: auto;
    }

    .compact-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }

    .compact-table th {
      padding: 10px 16px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .compact-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
      color: var(--text-primary);
    }

    .clickable-row {
      cursor: pointer;
      transition: background 0.12s ease;
    }

    .clickable-row:hover {
      background-color: var(--surface-secondary);
    }

    .proj-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .key-tag {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .title-sub {
      display: flex;
      flex-direction: column;
    }

    .p-title {
      font-weight: 600;
      color: var(--text-primary);
    }

    .p-team {
      font-size: 10px;
      color: var(--text-muted);
    }

    .owner-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      white-space: nowrap;
    }

    .progress-cell {
      min-width: 120px;
    }

    .prog-bar-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .prog-num {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 32px;
    }

    .deadline-cell {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* Task Rows List */
    .task-rows-list {
      display: flex;
      flex-direction: column;
    }

    .task-item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background 0.12s ease;
    }

    .task-item-row:hover {
      background-color: var(--surface-secondary);
    }

    .task-item-row:last-child {
      border-bottom: none;
    }

    .task-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      flex-shrink: 0;
    }
    .task-status-dot.in_progress { background: var(--accent-emerald); }
    .task-status-dot.blocked { background: var(--accent-crimson); }
    .task-status-dot.review { background: var(--accent-purple); }
    .task-status-dot.todo { background: var(--accent-amber); }
    .task-status-dot.completed { background: var(--accent-emerald); }
    .task-status-dot.backlog { background: var(--text-muted); }

    .task-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .task-title-line {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .t-key {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .t-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-meta-line {
      font-size: 11px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Velocity Chart */
    .velocity-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 3px 8px;
      border-radius: 9999px;
    }

    .velocity-chart-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 160px;
      padding: 16px 8px 8px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .sprint-bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
      height: 100%;
      justify-content: flex-end;
    }

    .bar-pair {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 120px;
      width: 24px;
    }

    .bar {
      flex: 1;
      border-radius: 3px 3px 0 0;
      transition: height 0.3s ease;
    }

    .bar.planned {
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
    }

    .bar.actual {
      background: var(--accent-emerald);
    }

    .sprint-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .chart-legend-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 12px;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-box {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .legend-box.planned {
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
    }
    .legend-box.actual {
      background: var(--accent-emerald);
    }

    /* Events List */
    .events-compact-list {
      display: flex;
      flex-direction: column;
    }

    .event-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .event-row:last-child {
      border-bottom: none;
    }

    .event-date-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .e-month {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .e-type {
      font-size: 9px;
      font-weight: 700;
      color: var(--accent-emerald);
    }

    .event-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .e-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .e-sub {
      font-size: 10px;
      color: var(--accent-emerald);
    }

    .e-time {
      font-size: 10px;
      color: var(--text-muted);
    }

    /* Workload Rows */
    .workload-mini-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .workload-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .workload-user {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .w-user-meta {
      display: flex;
      flex-direction: column;
    }

    .w-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .w-role {
      font-size: 10px;
      color: var(--text-muted);
    }

    .workload-meter {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .w-meter-top {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }

    .overload-txt {
      color: var(--accent-crimson);
      font-weight: 700;
    }

    /* Activity Stream */
    .activity-stream {
      display: flex;
      flex-direction: column;
    }

    .act-stream-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .act-stream-item:last-child {
      border-bottom: none;
    }

    .act-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .act-line {
      font-size: 12px;
      color: var(--text-primary);
    }

    .act-action {
      color: var(--text-muted);
      margin: 0 4px;
    }

    .act-target {
      color: var(--accent-emerald);
      font-weight: 500;
    }

    .act-meta {
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.3;
    }

    .act-time {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 2px;
    }
  `]
})
export class DashboardComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public timerService = inject(TimerService);

  public currentDateStr = 'Thursday, 05 Nov 2026';

  public sprintVelocityData = [
    { label: 'Sprint 37', planned: 60, actual: 65 },
    { label: 'Sprint 38', planned: 70, actual: 72 },
    { label: 'Sprint 39', planned: 75, actual: 70 },
    { label: 'Sprint 40', planned: 80, actual: 88 },
    { label: 'Sprint 41', planned: 85, actual: 92 },
    { label: 'Sprint 42 (Current)', planned: 90, actual: 84 }
  ];

  getHighPriorityTasks(): Task[] {
    return this.dataService
      .tasks()
      .filter(t => t.priority === 'critical' || t.priority === 'high')
      .slice(0, 5);
  }

  openQuickTimer(): void {
    this.timerService.toggle();
  }
}

