import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { PriorityLevel } from '../../core/models/project.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    AvatarComponent,
    BadgeComponent,
    ProgressBarComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="tasks-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Task Management</span>
          </div>
          <h1 class="page-title">Enterprise Task Hub</h1>
          <p class="page-subtitle">
            55+ active engineering, infrastructure, design, and compliance work items
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openTaskModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Create Task</span>
          </button>
        </div>
      </header>

      <!-- Filter & Controls Toolbar -->
      <section class="toolbar-card">
        <!-- Search -->
        <div class="search-input-box">
          <app-icon name="search" [size]="15" customClass="tb-search-icon"></app-icon>
          <input
            type="text"
            class="tb-input"
            placeholder="Search tasks by title, key, tags, or assignee..."
            [(ngModel)]="searchQuery"
          />
        </div>

        <!-- Status Filter Pills -->
        <div class="filter-pills-row">
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'all'"
            (click)="selectedStatus = 'all'"
          >
            All ({{ dataService.tasks().length }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'in_progress'"
            (click)="selectedStatus = 'in_progress'"
          >
            In Progress ({{ countByStatus('in_progress') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'blocked'"
            (click)="selectedStatus = 'blocked'"
          >
            Blocked ({{ countByStatus('blocked') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'review'"
            (click)="selectedStatus = 'review'"
          >
            Review ({{ countByStatus('review') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'todo'"
            (click)="selectedStatus = 'todo'"
          >
            To Do ({{ countByStatus('todo') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'completed'"
            (click)="selectedStatus = 'completed'"
          >
            Completed ({{ countByStatus('completed') }})
          </button>
        </div>

        <!-- Project & Priority Dropdown Selectors -->
        <div class="toolbar-dropdowns">
          <select class="orbit-select" [(ngModel)]="selectedPriority">
            <option value="all">Priority: All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select class="orbit-select" [(ngModel)]="selectedProjectId">
            <option value="all">Project: All</option>
            <option *ngFor="let p of dataService.projects()" [value]="p.id">
              {{ p.key }} - {{ p.name | slice:0:22 }}...
            </option>
          </select>
        </div>
      </section>

      <!-- Advanced Data Table -->
      <div class="orbit-table-container">
        <table class="orbit-table">
          <thead>
            <tr>
              <th style="width: 100px;">Key</th>
              <th>Task Title & Context</th>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Subtasks</th>
              <th>Due Date</th>
              <th>Effort</th>
              <th style="width: 60px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let t of filteredTasks()"
              class="task-table-row"
              (click)="modalService.openTaskDrawer(t)"
            >
              <td>
                <span class="t-key-tag">{{ t.key }}</span>
              </td>
              <td>
                <div class="task-title-cell">
                  <span class="t-main-title">{{ t.title }}</span>
                  <div class="t-tags-row">
                    <span *ngFor="let tag of t.tags" class="t-tag">{{ tag }}</span>
                    <span *ngIf="t.status === 'blocked'" class="blocked-badge">
                      <app-icon name="alert-triangle" [size]="11"></app-icon>
                      Blocked
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <span class="t-proj-name">{{ t.projectName }}</span>
              </td>
              <td (click)="$event.stopPropagation()">
                <select
                  class="table-status-select"
                  [ngModel]="t.status"
                  (ngModelChange)="onStatusChange(t.id, $event)"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td>
                <app-badge
                  [variant]="t.priority === 'critical' ? 'crimson' : t.priority === 'high' ? 'amber' : 'graphite'"
                  size="sm"
                >
                  {{ t.priority | uppercase }}
                </app-badge>
              </td>
              <td>
                <div class="assignee-cell">
                  <app-avatar [src]="t.assigneeAvatar" [name]="t.assigneeName" size="xs"></app-avatar>
                  <span>{{ t.assigneeName }}</span>
                </div>
              </td>
              <td>
                <div class="subtask-progress-cell" *ngIf="t.subtasks && t.subtasks.length > 0; else noSubs">
                  <app-progress-bar [value]="getSubtasksPercentage(t)" [height]="4"></app-progress-bar>
                  <span class="sub-count">{{ getCompletedSubsCount(t) }}/{{ t.subtasks.length }}</span>
                </div>
                <ng-template #noSubs>
                  <span class="sub-count muted">—</span>
                </ng-template>
              </td>
              <td>
                <span class="due-date-cell" [class.overdue]="isOverdue(t)">
                  {{ t.dueDate }}
                </span>
              </td>
              <td>
                <span class="effort-cell">{{ t.actualHours }}h / {{ t.estimatedHours }}h</span>
              </td>
              <td (click)="$event.stopPropagation()">
                <button
                  type="button"
                  class="row-action-btn"
                  (click)="modalService.openTaskModal(t)"
                  title="Edit Task"
                >
                  <app-icon name="edit-2" [size]="13"></app-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <app-empty-state
        *ngIf="filteredTasks().length === 0"
        icon="check-square"
        title="No tasks match the selected criteria"
        description="Try clearing your search query or switching your status/priority filters."
        actionLabel="Create Task"
        actionIcon="plus"
        (action)="modalService.openTaskModal()"
      ></app-empty-state>
    </div>
  `,
  styles: [`
    .tasks-viewport {
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

    /* Toolbar */
    .toolbar-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
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
      width: 260px;
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
    .tb-input::placeholder { color: var(--text-muted); }

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

    .toolbar-dropdowns {
      display: flex;
      gap: 10px;
    }

    .toolbar-dropdowns .orbit-select {
      height: 32px;
      font-size: 12px;
    }

    /* Table */
    .task-table-row {
      cursor: pointer;
      transition: background 0.12s ease;
    }

    .t-key-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-emerald);
      letter-spacing: 0.04em;
    }

    .task-title-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .t-main-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .t-tags-row {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }

    .t-tag {
      font-size: 10px;
      font-weight: 500;
      color: #D4D4D8;
      background: #27272A;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .blocked-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      color: var(--accent-crimson);
      background: var(--accent-crimson-subtle);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .t-proj-name {
      font-size: 12px;
      color: var(--text-secondary);
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    .table-status-select {
      height: 26px;
      padding: 0 6px;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      outline: none;
      cursor: pointer;
    }

    .assignee-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      font-size: 12px;
    }

    .subtask-progress-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 100px;
    }

    .sub-count {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .sub-count.muted {
      color: var(--border-strong);
    }

    .due-date-cell {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .due-date-cell.overdue {
      color: var(--accent-crimson);
      font-weight: 600;
    }

    .effort-cell {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .row-action-btn {
      width: 26px;
      height: 26px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.12s ease;
    }
    .row-action-btn:hover {
      background: var(--surface-tertiary);
      color: var(--text-primary);
    }
  `]
})
export class TasksComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public searchQuery = '';
  public selectedStatus: string = 'all';
  public selectedPriority: string = 'all';
  public selectedProjectId: string = 'all';

  countByStatus(status: TaskStatus): number {
    return this.dataService.tasks().filter(t => t.status === status).length;
  }

  public filteredTasks = computed(() => {
    let list = this.dataService.tasks();

    // Status filter
    if (this.selectedStatus !== 'all') {
      list = list.filter(t => t.status === this.selectedStatus);
    }

    // Priority filter
    if (this.selectedPriority !== 'all') {
      list = list.filter(t => t.priority === this.selectedPriority);
    }

    // Project filter
    if (this.selectedProjectId !== 'all') {
      list = list.filter(t => t.projectId === this.selectedProjectId);
    }

    // Search query
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.key.toLowerCase().includes(q) ||
          t.assigneeName.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return list;
  });

  onStatusChange(taskId: string, newStatus: TaskStatus): void {
    this.dataService.updateTaskStatus(taskId, newStatus);
    this.notifService.success('Task Status Updated', `Moved to ${newStatus.replace('_', ' ').toUpperCase()}`);
  }

  getSubtasksPercentage(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(s => s.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }

  getCompletedSubsCount(task: Task): number {
    return task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date('2026-11-05');
  }
}

