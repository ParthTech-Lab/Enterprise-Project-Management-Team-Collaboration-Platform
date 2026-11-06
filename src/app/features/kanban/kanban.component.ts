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
import { Task, TaskStatus } from '../../core/models/task.model';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  badgeVariant: 'graphite' | 'amber' | 'emerald' | 'purple' | 'crimson';
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="kanban-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Sprint Kanban Board</span>
          </div>
          <h1 class="page-title">Interactive Kanban Board</h1>
          <p class="page-subtitle">
            Sprint 42 execution flow with drag-and-drop column transitions
          </p>
        </div>

        <div class="header-right">
          <div class="search-input-box">
            <app-icon name="search" [size]="14" customClass="tb-search-icon"></app-icon>
            <input
              type="text"
              class="tb-input"
              placeholder="Filter board..."
              [(ngModel)]="searchQuery"
            />
          </div>

          <select class="orbit-select" [(ngModel)]="selectedProjectId" style="width: 180px;">
            <option value="all">All Projects</option>
            <option *ngFor="let p of dataService.projects()" [value]="p.id">
              {{ p.key }} - {{ p.name | slice:0:18 }}...
            </option>
          </select>

          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openTaskModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>New Card</span>
          </button>
        </div>
      </header>

      <!-- Horizontal Scrollable Kanban Columns Container -->
      <div class="kanban-board-scroll">
        <div class="columns-track">
          <div
            *ngFor="let col of columns"
            class="kanban-column"
            [class.drag-over]="dragOverColumnId === col.id"
            (dragover)="onDragOver($event, col.id)"
            (dragleave)="onDragLeave($event, col.id)"
            (drop)="onDrop($event, col.id)"
          >
            <!-- Column Header -->
            <div class="column-header">
              <div class="col-title-wrap">
                <span class="col-title">{{ col.title }}</span>
                <span class="col-count-badge">{{ getTasksForColumn(col.id).length }}</span>
              </div>
              <button
                type="button"
                class="col-add-btn"
                (click)="quickAddTask(col.id)"
                title="Add card to {{ col.title }}"
              >
                <app-icon name="plus" [size]="14"></app-icon>
              </button>
            </div>

            <!-- Cards Container -->
            <div class="column-cards-container">
              <div
                *ngFor="let t of getTasksForColumn(col.id)"
                class="kanban-card"
                [class.is-dragging]="draggedTaskId === t.id"
                draggable="true"
                (dragstart)="onDragStart($event, t.id)"
                (dragend)="onDragEnd()"
                (click)="modalService.openTaskDrawer(t)"
              >
                <!-- Card Header -->
                <div class="card-head-row">
                  <span class="card-key">{{ t.key }}</span>
                  <app-badge
                    [variant]="t.priority === 'critical' ? 'crimson' : t.priority === 'high' ? 'amber' : 'graphite'"
                    size="sm"
                  >
                    {{ t.priority | uppercase }}
                  </app-badge>
                </div>

                <!-- Card Title -->
                <h4 class="card-title">{{ t.title }}</h4>

                <!-- Project Key & Tags -->
                <div class="card-tags-wrap">
                  <span class="proj-badge">{{ t.projectKey }}</span>
                  <span *ngFor="let tag of t.tags.slice(0, 2)" class="tag-badge">{{ tag }}</span>
                </div>

                <!-- Blocked Reason Callout -->
                <div *ngIf="t.status === 'blocked' && t.blockedReason" class="blocked-callout">
                  <app-icon name="alert-triangle" [size]="12"></app-icon>
                  <span>{{ t.blockedReason }}</span>
                </div>

                <!-- Subtask Progress -->
                <div class="card-subtask-progress" *ngIf="t.subtasks && t.subtasks.length > 0">
                  <div class="progress-sub-header">
                    <span>Checklist</span>
                    <span>{{ getCompletedSubs(t) }}/{{ t.subtasks.length }}</span>
                  </div>
                  <app-progress-bar
                    [value]="(getCompletedSubs(t) / t.subtasks.length) * 100"
                    [height]="3"
                  ></app-progress-bar>
                </div>

                <!-- Card Footer: Due Date, Comments, Assignee -->
                <div class="card-footer-row">
                  <div class="footer-left-meta">
                    <span class="card-due-tag" [class.overdue]="isOverdue(t)">
                      <app-icon name="clock" [size]="12"></app-icon>
                      <span>{{ t.dueDate | slice:5:10 }}</span>
                    </span>
                    <span *ngIf="t.comments && t.comments.length > 0" class="card-comments-tag">
                      <app-icon name="message-square" [size]="11"></app-icon>
                      <span>{{ t.comments.length }}</span>
                    </span>
                  </div>
                  <app-avatar [src]="t.assigneeAvatar" [name]="t.assigneeName" size="xs"></app-avatar>
                </div>
              </div>

              <!-- Column Empty Placeholder -->
              <div *ngIf="getTasksForColumn(col.id).length === 0" class="col-empty-card">
                <span>No cards in this column</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-viewport {
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
      gap: 10px;
    }

    .search-input-box {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 220px;
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
      font-size: 12px;
      color: var(--text-primary);
    }

    /* Scrollable Columns Track */
    .kanban-board-scroll {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 12px;
    }

    .columns-track {
      display: flex;
      gap: 16px;
      height: 100%;
      min-width: max-content;
    }

    .kanban-column {
      width: 300px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      max-height: 100%;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .kanban-column.drag-over {
      border-color: var(--accent-emerald);
      background-color: var(--surface-tertiary);
    }

    .column-header {
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .col-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .col-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .col-count-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      background: var(--surface-tertiary);
      padding: 1px 6px;
      border-radius: 9999px;
      border: 1px solid var(--border-default);
    }

    .col-add-btn {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.12s ease;
    }
    .col-add-btn:hover {
      background: var(--surface-tertiary);
      color: var(--text-primary);
    }

    .column-cards-container {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Cards */
    .kanban-card {
      background: var(--surface-primary);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: grab;
      user-select: none;
      transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 180ms ease,
                  border-color 180ms ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .kanban-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
    }

    .kanban-card.is-dragging {
      opacity: 0.4;
      transform: scale(0.98);
      cursor: grabbing;
    }

    .card-head-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-key {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      letter-spacing: 0.04em;
    }

    .card-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.4;
      margin: 0;
    }

    .card-tags-wrap {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }

    .proj-badge {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .tag-badge {
      font-size: 10px;
      color: var(--text-muted);
      background: var(--surface-tertiary);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .blocked-callout {
      font-size: 11px;
      color: var(--accent-crimson);
      background: var(--accent-crimson-subtle);
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 6px 8px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1.3;
    }

    .card-subtask-progress {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-sub-header {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .card-footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 10px;
      margin-top: 2px;
    }

    .footer-left-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-due-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
    }
    .card-due-tag.overdue {
      color: var(--accent-crimson);
      font-weight: 600;
    }

    .card-comments-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .col-empty-card {
      padding: 32px 16px;
      text-align: center;
      border: 1px dashed var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 12px;
    }
  `]
})
export class KanbanComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public searchQuery = '';
  public selectedProjectId = 'all';

  public draggedTaskId: string | null = null;
  public dragOverColumnId: TaskStatus | null = null;

  public columns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', badgeVariant: 'graphite' },
    { id: 'todo', title: 'To Do', badgeVariant: 'amber' },
    { id: 'in_progress', title: 'In Progress', badgeVariant: 'emerald' },
    { id: 'review', title: 'Review', badgeVariant: 'purple' },
    { id: 'blocked', title: 'Blocked', badgeVariant: 'crimson' },
    { id: 'completed', title: 'Done', badgeVariant: 'emerald' }
  ];

  getTasksForColumn(status: TaskStatus): Task[] {
    let list = this.dataService.tasks().filter(t => t.status === status);

    if (this.selectedProjectId !== 'all') {
      list = list.filter(t => t.projectId === this.selectedProjectId);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.key.toLowerCase().includes(q));
    }

    return list;
  }

  onDragStart(event: DragEvent, taskId: string): void {
    this.draggedTaskId = taskId;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', taskId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.draggedTaskId = null;
    this.dragOverColumnId = null;
  }

  onDragOver(event: DragEvent, columnId: TaskStatus): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverColumnId = columnId;
  }

  onDragLeave(event: DragEvent, columnId: TaskStatus): void {
    if (this.dragOverColumnId === columnId) {
      this.dragOverColumnId = null;
    }
  }

  onDrop(event: DragEvent, targetColumnId: TaskStatus): void {
    event.preventDefault();
    const taskId = this.draggedTaskId || event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.dataService.updateTaskStatus(taskId, targetColumnId);
      this.notifService.success('Card moved', `Ticket status updated to ${targetColumnId.toUpperCase()}`);
    }
    this.draggedTaskId = null;
    this.dragOverColumnId = null;
  }

  quickAddTask(status: TaskStatus): void {
    this.modalService.openTaskModal();
  }

  getCompletedSubs(task: Task): number {
    return task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date('2026-11-05');
  }
}

