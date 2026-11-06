import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="timeline-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Gantt & Roadmap Timeline</span>
          </div>
          <h1 class="page-title">Enterprise Roadmap & Timeline</h1>
          <p class="page-subtitle">
            Cross-project chronological tracking, milestone pacing, and dependency paths
          </p>
        </div>

        <div class="header-right">
          <div class="scale-mode-selector">
            <button
              type="button"
              class="scale-btn"
              [class.active]="timeScale === 'month'"
              (click)="timeScale = 'month'"
            >
              Month View
            </button>
            <button
              type="button"
              class="scale-btn"
              [class.active]="timeScale === 'week'"
              (click)="timeScale = 'week'"
            >
              Week View
            </button>
          </div>

          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openProjectModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Add Initiative</span>
          </button>
        </div>
      </header>

      <!-- Main Gantt Timeline Container -->
      <div class="gantt-board-card">
        <!-- Date Header Grid -->
        <div class="gantt-header-row">
          <div class="gantt-sidebar-head">
            <span>INITIATIVE / TICKET</span>
          </div>
          <div class="gantt-timeline-head">
            <div *ngFor="let month of months" class="month-col-head">
              <span class="m-head-label">{{ month.label }}</span>
              <div class="weeks-sub-row">
                <span *ngFor="let w of month.weeks" class="w-head-label">{{ w }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gantt Rows Container -->
        <div class="gantt-body-scroll">
          <div *ngFor="let p of dataService.projects()" class="gantt-project-group">
            <!-- Project Main Bar Row -->
            <div class="gantt-row project-row">
              <div class="gantt-label-col">
                <div class="proj-name-wrap">
                  <span class="key-tag">{{ p.key }}</span>
                  <span class="p-title-txt">{{ p.name }}</span>
                </div>
                <div class="proj-sub-meta">
                  <span>{{ p.teamName }}</span>
                  <span>•</span>
                  <span>{{ p.progress }}%</span>
                </div>
              </div>

              <div class="gantt-track-col">
                <!-- Timeline Grid Background Lines -->
                <div class="grid-lines-bg">
                  <div *ngFor="let m of months" class="grid-month-cell"></div>
                </div>

                <!-- Project Range Bar -->
                <div
                  class="gantt-bar project-bar"
                  [style.left.%]="calculateLeft(p.startDate)"
                  [style.width.%]="calculateWidth(p.startDate, p.deadline)"
                  (click)="onProjectClick(p)"
                >
                  <div class="bar-fill" [style.width.%]="p.progress"></div>
                  <div class="bar-content">
                    <span class="bar-title">{{ p.name }}</span>
                    <span class="bar-perc">{{ p.progress }}%</span>
                  </div>
                </div>

                <!-- Milestone Pin Markers -->
                <div
                  *ngFor="let m of p.milestones"
                  class="milestone-diamond-marker"
                  [class.completed]="m.completed"
                  [style.left.%]="calculateLeft(m.dueDate)"
                  [attr.title]="m.title + ' (Due ' + m.dueDate + ')'"
                >
                  <div class="diamond-pin"></div>
                </div>
              </div>
            </div>

            <!-- Nested Child Tasks for Project -->
            <div
              *ngFor="let t of getTasksForProject(p.id)"
              class="gantt-row task-row"
              (click)="modalService.openTaskDrawer(t)"
            >
              <div class="gantt-label-col task-label-col">
                <span class="t-bullet">↳</span>
                <span class="t-key">{{ t.key }}</span>
                <span class="t-title">{{ t.title }}</span>
              </div>

              <div class="gantt-track-col">
                <div class="grid-lines-bg">
                  <div *ngFor="let m of months" class="grid-month-cell"></div>
                </div>

                <div
                  class="gantt-bar task-bar"
                  [ngClass]="t.status"
                  [style.left.%]="calculateLeft(t.startDate || '2026-10-15')"
                  [style.width.%]="calculateWidth(t.startDate || '2026-10-15', t.dueDate)"
                >
                  <span class="task-bar-text">{{ t.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      overflow: hidden;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
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

    .scale-mode-selector {
      display: flex;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .scale-btn {
      height: 32px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 500;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .scale-btn.active {
      background: var(--surface-tertiary);
      color: var(--accent-emerald);
      font-weight: 600;
    }

    /* Gantt Card */
    .gantt-board-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .gantt-header-row {
      display: flex;
      border-bottom: 1px solid var(--border-default);
      background: var(--surface-secondary);
      flex-shrink: 0;
    }

    .gantt-sidebar-head {
      width: 320px;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-right: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .gantt-timeline-head {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .month-col-head {
      flex: 1;
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
    }

    .m-head-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .weeks-sub-row {
      display: flex;
      width: 100%;
      justify-content: space-around;
      margin-top: 4px;
    }

    .w-head-label {
      font-size: 9px;
      color: var(--text-muted);
    }

    /* Gantt Body */
    .gantt-body-scroll {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .gantt-project-group {
      border-bottom: 1px solid var(--border-subtle);
    }

    .gantt-row {
      display: flex;
      min-height: 44px;
      border-bottom: 1px solid var(--border-subtle);
      transition: background 0.12s ease;
    }
    .gantt-row:hover {
      background: var(--surface-secondary);
    }

    .gantt-row.project-row {
      background: rgba(255, 255, 255, 0.02);
      min-height: 52px;
    }

    .gantt-label-col {
      width: 320px;
      padding: 8px 16px;
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .proj-name-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .key-tag {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .p-title-txt {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .proj-sub-meta {
      font-size: 10px;
      color: var(--text-muted);
      display: flex;
      gap: 6px;
    }

    .task-label-col {
      padding-left: 28px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      cursor: pointer;
    }

    .t-bullet {
      color: var(--text-muted);
    }

    .t-key {
      font-size: 10px;
      color: var(--text-muted);
    }

    .t-title {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Track Col */
    .gantt-track-col {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .grid-lines-bg {
      position: absolute;
      inset: 0;
      display: flex;
      pointer-events: none;
    }

    .grid-month-cell {
      flex: 1;
      border-right: 1px solid var(--border-subtle);
    }

    /* Gantt Bars */
    .gantt-bar {
      position: absolute;
      height: 24px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      z-index: 10;
      transition: all 0.15s ease;
    }

    .gantt-bar:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }

    .project-bar {
      background: var(--surface-tertiary);
      border: 1px solid var(--border-strong);
      overflow: hidden;
      height: 28px;
    }

    .project-bar .bar-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: var(--accent-emerald-subtle);
      border-right: 2px solid var(--accent-emerald);
      z-index: 1;
    }

    .bar-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .bar-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bar-perc {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      margin-left: 8px;
    }

    .task-bar {
      height: 18px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 500;
      color: #ffffff;
      background: var(--accent-amber);
    }
    .task-bar.in_progress { background: var(--accent-emerald); }
    .task-bar.completed { background: #059669; }
    .task-bar.blocked { background: var(--accent-crimson); }
    .task-bar.review { background: var(--accent-purple); }

    .task-bar-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Milestone diamond */
    .milestone-diamond-marker {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 20;
      cursor: pointer;
    }

    .diamond-pin {
      width: 14px;
      height: 14px;
      background: var(--accent-amber);
      transform: rotate(45deg);
      border: 2px solid var(--surface-primary);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    }

    .milestone-diamond-marker.completed .diamond-pin {
      background: var(--accent-emerald);
    }
  `]
})
export class TimelineComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);

  public timeScale: 'month' | 'week' = 'month';

  public months = [
    { label: 'Aug 2026', weeks: ['W1', 'W2', 'W3', 'W4'] },
    { label: 'Sep 2026', weeks: ['W1', 'W2', 'W3', 'W4'] },
    { label: 'Oct 2026', weeks: ['W1', 'W2', 'W3', 'W4'] },
    { label: 'Nov 2026 (Now)', weeks: ['W1', 'W2', 'W3', 'W4'] },
    { label: 'Dec 2026', weeks: ['W1', 'W2', 'W3', 'W4'] },
    { label: 'Jan 2027', weeks: ['W1', 'W2', 'W3', 'W4'] }
  ];

  // Timeline coordinate calculations (from Aug 1, 2026 to Jan 31, 2027 = 184 days)
  private timelineStart = new Date('2026-08-01').getTime();
  private timelineEnd = new Date('2027-01-31').getTime();
  private totalSpan = this.timelineEnd - this.timelineStart;

  calculateLeft(dateStr: string): number {
    const d = new Date(dateStr).getTime();
    const clamped = Math.max(this.timelineStart, Math.min(this.timelineEnd, d));
    return Math.round(((clamped - this.timelineStart) / this.totalSpan) * 100);
  }

  calculateWidth(startStr: string, endStr: string): number {
    const s = Math.max(this.timelineStart, new Date(startStr).getTime());
    const e = Math.min(this.timelineEnd, new Date(endStr).getTime());
    const span = Math.max(86400000 * 5, e - s); // min 5 days visual width
    return Math.max(4, Math.round((span / this.totalSpan) * 100));
  }

  getTasksForProject(projectId: string): Task[] {
    return this.dataService.tasks().filter(t => t.projectId === projectId).slice(0, 3);
  }

  onProjectClick(project: Project): void {
    // Open project or drawer
  }
}

