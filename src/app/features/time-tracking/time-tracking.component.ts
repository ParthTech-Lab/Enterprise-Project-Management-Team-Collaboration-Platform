import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { TimerService } from '../../core/services/timer.service';
import { NotificationService } from '../../core/services/notification.service';
import { TimeEntry } from '../../core/models/time-entry.model';

@Component({
  selector: 'app-time-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent, BadgeComponent],
  template: `
    <div class="time-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Management</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Time Tracking</span>
          </div>
          <h1 class="page-title">Enterprise Timesheet & Billing Hub</h1>
          <p class="page-subtitle">
            Precision engineering hours logging, live task timers, and client billing reconciliation
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-secondary"
            (click)="submitTimesheet()"
          >
            <app-icon name="check" [size]="14"></app-icon>
            <span>Submit Weekly Timesheet</span>
          </button>
        </div>
      </header>

      <!-- Live Interactive Timer Hero Widget -->
      <section class="timer-hero-card">
        <div class="th-left">
          <div class="th-state-badge">
            <span class="live-pulse" *ngIf="timerService.isRunning()"></span>
            <span class="th-status-text">{{ timerService.isRunning() ? 'ACTIVE TIMER TRACKING' : 'TIMER PAUSED' }}</span>
          </div>
          <div class="timer-digits-large">{{ timerService.formattedTime() }}</div>
          <div class="active-task-inputs">
            <div class="active-proj-pill">
              <app-icon name="folder" [size]="14"></app-icon>
              <span>{{ timerService.activeProject() }}</span>
            </div>
            <div class="active-task-pill">
              <app-icon name="check-square" [size]="14"></app-icon>
              <span>{{ timerService.activeTask() }}</span>
            </div>
          </div>
        </div>

        <div class="th-right-controls">
          <button
            type="button"
            class="timer-action-btn primary"
            (click)="timerService.toggle()"
          >
            <app-icon [name]="timerService.isRunning() ? 'pause' : 'play'" [size]="20"></app-icon>
            <span>{{ timerService.isRunning() ? 'Pause Timer' : 'Start Timer' }}</span>
          </button>
          <button
            type="button"
            class="timer-action-btn secondary"
            (click)="timerService.reset()"
          >
            <app-icon name="refresh-cw" [size]="16"></app-icon>
            <span>Reset</span>
          </button>
        </div>
      </section>

      <!-- Manual Log Form & Timesheet Split -->
      <div class="time-main-grid">
        <!-- Left: Manual Entry Form -->
        <div class="orbit-card log-form-card">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="clock" [size]="16"></app-icon>
              <span>Manual Time Log Entry</span>
            </h3>
          </div>

          <form [formGroup]="timeForm" (ngSubmit)="onLogSubmit()" class="orbit-card-body">
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Project</span></label>
              <select class="orbit-select" formControlName="projectId">
                <option *ngFor="let p of dataService.projects()" [value]="p.id">
                  {{ p.key }} - {{ p.name }}
                </option>
              </select>
            </div>

            <div class="orbit-form-group">
              <label class="orbit-label"><span>Task (Optional)</span></label>
              <select class="orbit-select" formControlName="taskId">
                <option value="">No specific ticket</option>
                <option *ngFor="let t of dataService.tasks().slice(0, 8)" [value]="t.id">
                  {{ t.key }}: {{ t.title | slice:0:30 }}...
                </option>
              </select>
            </div>

            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Date</span></label>
                <input type="date" class="orbit-input" formControlName="date" />
              </div>
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Duration (Hours)</span></label>
                <input type="number" step="0.25" class="orbit-input" formControlName="hours" />
              </div>
            </div>

            <div class="orbit-form-group">
              <label class="orbit-label"><span>Work Description</span></label>
              <textarea
                class="orbit-textarea"
                rows="2"
                placeholder="What architectural, engineering or design work did you accomplish?"
                formControlName="description"
              ></textarea>
            </div>

            <div class="billable-toggle-row">
              <label class="billable-label">
                <input type="checkbox" formControlName="billable" class="billable-checkbox" />
                <span>Client Billable Hour</span>
              </label>
            </div>

            <button
              type="submit"
              class="orbit-btn orbit-btn-primary"
              [disabled]="timeForm.invalid"
              style="width: 100%; margin-top: 10px;"
            >
              <app-icon name="plus" [size]="15"></app-icon>
              <span>Log Time Entry</span>
            </button>
          </form>
        </div>

        <!-- Right: Recent Time Logs Table -->
        <div class="orbit-card timesheet-table-card">
          <div class="orbit-card-header">
            <div>
              <h3 class="orbit-card-title">
                <app-icon name="list" [size]="16"></app-icon>
                <span>Logged Work Entries</span>
              </h3>
              <span class="orbit-card-subtitle">Sprint 42 audit trail</span>
            </div>
            <span class="total-hrs-pill">Total: {{ getTotalLoggedHours() }} Hours</span>
          </div>

          <div class="orbit-card-body p-0">
            <div class="orbit-table-container">
              <table class="orbit-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Initiative & Task</th>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Billable</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let te of dataService.timeEntries()">
                    <td><span class="te-date">{{ te.date }}</span></td>
                    <td>
                      <div class="te-proj-cell">
                        <span class="te-p-name">{{ te.projectName }}</span>
                        <span class="te-t-title" *ngIf="te.taskTitle">{{ te.taskTitle }}</span>
                      </div>
                    </td>
                    <td><span class="te-desc">{{ te.description }}</span></td>
                    <td>
                      <span class="te-hours">{{ (te.durationMinutes / 60).toFixed(1) }}h</span>
                    </td>
                    <td>
                      <app-badge [variant]="te.billable ? 'emerald' : 'graphite'" size="sm">
                        {{ te.billable ? 'YES' : 'NO' }}
                      </app-badge>
                    </td>
                    <td>
                      <app-badge [variant]="te.status === 'approved' ? 'emerald' : 'amber'" size="sm">
                        {{ te.status | uppercase }}
                      </app-badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .time-viewport {
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

    /* Timer Hero Card */
    .timer-hero-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow-sm);
      gap: 24px;
    }

    @media (max-width: 800px) {
      .timer-hero-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .th-left {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .th-state-badge {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .live-pulse {
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background-color: var(--accent-emerald);
      animation: pulse 1.5s infinite;
    }

    .th-status-text {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--accent-emerald);
    }

    .timer-digits-large {
      font-family: monospace;
      font-size: 40px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.06em;
      line-height: 1;
    }

    .active-task-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .active-proj-pill, .active-task-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
    }

    .th-right-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .timer-action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }

    .timer-action-btn.primary {
      background: var(--accent-emerald);
      color: #ffffff;
      border-color: var(--accent-emerald);
    }
    .timer-action-btn.primary:hover {
      background: var(--accent-emerald-hover);
    }

    .timer-action-btn.secondary {
      background: var(--surface-secondary);
      border-color: var(--border-default);
      color: var(--text-primary);
    }
    .timer-action-btn.secondary:hover {
      background: var(--surface-tertiary);
    }

    /* Main Grid */
    .time-main-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 20px;
    }

    @media (max-width: 1000px) {
      .time-main-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .billable-toggle-row {
      margin: 8px 0;
    }

    .billable-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .billable-checkbox {
      accent-color: var(--accent-emerald);
    }

    .p-0 { padding: 0; }

    .total-hrs-pill {
      font-size: 12px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 4px 10px;
      border-radius: 9999px;
    }

    .te-date {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .te-proj-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .te-p-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .te-t-title {
      font-size: 10px;
      color: var(--text-muted);
    }

    .te-desc {
      font-size: 12px;
      color: var(--text-secondary);
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .te-hours {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }
  `]
})
export class TimeTrackingComponent {
  public dataService = inject(DataService);
  public timerService = inject(TimerService);
  public notifService = inject(NotificationService);

  public timeForm: FormGroup;

  constructor() {
    this.timeForm = new FormGroup({
      projectId: new FormControl(this.dataService.projects()[0]?.id || '', [Validators.required]),
      taskId: new FormControl(''),
      date: new FormControl('2026-11-05', [Validators.required]),
      hours: new FormControl(3.5, [Validators.required, Validators.min(0.25)]),
      description: new FormControl('Multi-region mTLS certificate integration benchmarks', [Validators.required]),
      billable: new FormControl(true)
    });
  }

  getTotalLoggedHours(): string {
    const totalMin = this.dataService.timeEntries().reduce((acc, curr) => acc + curr.durationMinutes, 0);
    return (totalMin / 60).toFixed(1);
  }

  onLogSubmit(): void {
    if (this.timeForm.invalid) return;

    const vals = this.timeForm.value;
    const proj = this.dataService.projects().find(p => p.id === vals.projectId);
    const task = this.dataService.tasks().find(t => t.id === vals.taskId);
    const user = this.dataService.currentUser();

    this.dataService.addTimeEntry({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      projectId: vals.projectId,
      projectName: proj ? proj.name : 'Platform',
      taskId: vals.taskId,
      taskTitle: task ? task.title : undefined,
      description: vals.description,
      date: vals.date,
      durationMinutes: Math.round(vals.hours * 60),
      billable: vals.billable,
      status: 'submitted'
    });

    this.notifService.success('Hours Logged', `${vals.hours}h added to ${proj ? proj.key : 'Project'}`);
    this.timeForm.patchValue({
      description: '',
      hours: 2
    });
  }

  submitTimesheet(): void {
    this.notifService.success('Timesheet Submitted', 'Submitted for manager approval');
  }
}

