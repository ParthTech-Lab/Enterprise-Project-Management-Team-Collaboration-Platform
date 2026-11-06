import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ModalService } from '../../../core/services/modal.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { PriorityLevel } from '../../../core/models/project.model';

@Component({
  selector: 'app-task-detail-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, ProgressBarComponent],
  template: `
    <div
      *ngIf="modalService.isTaskDrawerOpen() && modalService.selectedTask() as task"
      class="drawer-wrapper"
    >
      <div class="orbit-drawer-backdrop" (click)="close()"></div>
      <aside class="orbit-drawer">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div class="header-left">
            <span class="task-key-tag">{{ task.key }}</span>
            <span class="project-tag">{{ task.projectName }}</span>
          </div>
          <div class="header-right">
            <button
              type="button"
              class="action-icon-btn"
              (click)="editTask(task)"
              title="Edit Task"
            >
              <app-icon name="edit-2" [size]="15"></app-icon>
            </button>
            <button
              type="button"
              class="action-icon-btn delete-btn"
              (click)="deleteTask(task.id)"
              title="Delete Task"
            >
              <app-icon name="trash-2" [size]="15"></app-icon>
            </button>
            <button
              type="button"
              class="action-icon-btn close-btn"
              (click)="close()"
              title="Close Drawer"
            >
              <app-icon name="x" [size]="17"></app-icon>
            </button>
          </div>
        </div>

        <!-- Drawer Content Area -->
        <div class="drawer-scrollable">
          <!-- Title & Status row -->
          <div class="drawer-section">
            <h2 class="task-title-heading">{{ task.title }}</h2>

            <div class="status-priority-bar">
              <!-- Status Select Pill -->
              <div class="dropdown-control-wrap">
                <label class="control-sublabel">STATUS</label>
                <select
                  class="status-select-native"
                  [ngModel]="task.status"
                  (ngModelChange)="onStatusChange(task.id, $event)"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <!-- Priority Select Pill -->
              <div class="dropdown-control-wrap">
                <label class="control-sublabel">PRIORITY</label>
                <select
                  class="priority-select-native"
                  [ngModel]="task.priority"
                  (ngModelChange)="onPriorityChange(task.id, $event)"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div *ngIf="task.status === 'blocked' && task.blockedReason" class="blocked-alert">
              <app-icon name="alert-triangle" [size]="16" customClass="blocked-icon"></app-icon>
              <span>{{ task.blockedReason }}</span>
            </div>
          </div>

          <!-- Metadata Properties Grid -->
          <div class="drawer-section meta-grid">
            <div class="meta-item">
              <span class="meta-label">Assignee</span>
              <div class="meta-val user-val">
                <app-avatar [src]="task.assigneeAvatar" [name]="task.assigneeName" size="xs"></app-avatar>
                <span>{{ task.assigneeName }}</span>
              </div>
            </div>

            <div class="meta-item">
              <span class="meta-label">Reporter</span>
              <div class="meta-val user-val">
                <app-avatar [src]="task.reporterAvatar" [name]="task.reporterName" size="xs"></app-avatar>
                <span>{{ task.reporterName }}</span>
              </div>
            </div>

            <div class="meta-item">
              <span class="meta-label">Due Date</span>
              <div class="meta-val">
                <app-icon name="calendar" [size]="14"></app-icon>
                <span>{{ task.dueDate }}</span>
              </div>
            </div>

            <div class="meta-item">
              <span class="meta-label">Time Logged</span>
              <div class="meta-val">
                <app-icon name="clock" [size]="14"></app-icon>
                <span>{{ task.actualHours }}h / {{ task.estimatedHours }}h</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="drawer-section">
            <h4 class="section-heading">Description</h4>
            <div class="description-body">
              {{ task.description || 'No description provided.' }}
            </div>
          </div>

          <!-- Subtasks / Checklist -->
          <div class="drawer-section">
            <div class="section-header-flex">
              <h4 class="section-heading">Checklist & Subtasks</h4>
              <span class="count-badge">{{ getCompletedSubtasksCount(task) }}/{{ task.subtasks.length }}</span>
            </div>

            <app-progress-bar
              [value]="getSubtaskProgress(task)"
              [height]="4"
            ></app-progress-bar>

            <div class="subtask-list">
              <div
                *ngFor="let sub of task.subtasks"
                class="subtask-row"
                [class.done]="sub.completed"
                (click)="toggleSubtask(task, sub.id)"
              >
                <div class="check-box" [class.checked]="sub.completed">
                  <app-icon *ngIf="sub.completed" name="check" [size]="12"></app-icon>
                </div>
                <span class="subtask-title">{{ sub.title }}</span>
              </div>
            </div>

            <!-- Add Subtask Input -->
            <div class="add-subtask-wrap">
              <input
                type="text"
                class="orbit-input"
                placeholder="Add new subtask item..."
                [(ngModel)]="newSubtaskText"
                (keydown.enter)="addSubtask(task)"
              />
              <button
                type="button"
                class="orbit-btn orbit-btn-secondary orbit-btn-sm"
                (click)="addSubtask(task)"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Attachments Section -->
          <div class="drawer-section" *ngIf="task.attachments && task.attachments.length > 0">
            <h4 class="section-heading">Attachments</h4>
            <div class="attachment-cards">
              <div *ngFor="let att of task.attachments" class="att-card">
                <app-icon name="paperclip" [size]="16" customClass="att-icon"></app-icon>
                <div class="att-info">
                  <span class="att-name">{{ att.name }}</span>
                  <span class="att-meta">{{ att.size }} • {{ att.uploadedAt }}</span>
                </div>
                <app-icon name="download" [size]="14" customClass="att-dl"></app-icon>
              </div>
            </div>
          </div>

          <!-- Comments & Discussion -->
          <div class="drawer-section">
            <h4 class="section-heading">Activity & Discussion</h4>

            <div class="comment-composer">
              <app-avatar
                [src]="dataService.currentUser().avatar"
                [name]="dataService.currentUser().name"
                size="sm"
              ></app-avatar>
              <div class="composer-box">
                <textarea
                  class="orbit-textarea comment-input"
                  placeholder="Leave a comment or mention team members..."
                  [(ngModel)]="commentText"
                  rows="2"
                ></textarea>
                <div class="composer-actions">
                  <button
                    type="button"
                    class="orbit-btn orbit-btn-primary orbit-btn-sm"
                    [disabled]="!commentText.trim()"
                    (click)="postComment(task)"
                  >
                    <app-icon name="send" [size]="12"></app-icon>
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="comments-stream">
              <div *ngFor="let c of task.comments" class="comment-item">
                <app-avatar [src]="c.authorAvatar" [name]="c.authorName" size="sm"></app-avatar>
                <div class="comment-bubble">
                  <div class="comment-head">
                    <span class="c-author">{{ c.authorName }}</span>
                    <span class="c-role">{{ c.authorRole }}</span>
                    <span class="c-time">{{ c.createdAt | slice:0:10 }}</span>
                  </div>
                  <div class="c-body">{{ c.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .drawer-wrapper {
      position: relative;
      z-index: 1050;
    }

    .drawer-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      background-color: var(--surface-secondary);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .task-key-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }

    .project-tag {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .action-icon-btn {
      width: 30px;
      height: 30px;
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

    .action-icon-btn:hover {
      background-color: var(--surface-tertiary);
      color: var(--text-primary);
    }

    .action-icon-btn.delete-btn:hover {
      background-color: var(--accent-crimson-subtle);
      color: var(--accent-crimson);
    }

    .drawer-scrollable {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .drawer-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-title-heading {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.35;
      letter-spacing: -0.01em;
    }

    .status-priority-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .dropdown-control-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .control-sublabel {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .status-select-native,
    .priority-select-native {
      height: 30px;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      cursor: pointer;
      outline: none;
    }

    .status-select-native:focus,
    .priority-select-native:focus {
      border-color: var(--accent-emerald);
    }

    .blocked-alert {
      margin-top: 8px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      background: var(--accent-crimson-subtle);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--accent-crimson);
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .blocked-icon {
      flex-shrink: 0;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 14px;
      background: var(--surface-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .meta-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-val {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .user-val {
      color: var(--text-primary);
    }

    .section-heading {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .description-body {
      font-size: 13px;
      color: var(--text-primary);
      line-height: 1.6;
      background: var(--surface-secondary);
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    .section-header-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .count-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .subtask-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }

    .subtask-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.12s ease;
    }

    .subtask-row:hover {
      background: var(--surface-tertiary);
      border-color: var(--border-default);
    }

    .subtask-row.done .subtask-title {
      text-decoration: line-through;
      color: var(--text-muted);
    }

    .check-box {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1px solid var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .check-box.checked {
      background: var(--accent-emerald);
      border-color: var(--accent-emerald);
      color: #ffffff;
    }

    .subtask-title {
      font-size: 12px;
      color: var(--text-primary);
      flex: 1;
    }

    .add-subtask-wrap {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .att-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
    }

    .att-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .att-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .att-meta {
      font-size: 10px;
      color: var(--text-muted);
    }

    .comment-composer {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .composer-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .comment-input {
      font-size: 12px;
    }

    .composer-actions {
      display: flex;
      justify-content: flex-end;
    }

    .comments-stream {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .comment-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .comment-bubble {
      flex: 1;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 12px;
    }

    .comment-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .c-author {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .c-role {
      font-size: 10px;
      color: var(--text-muted);
    }

    .c-time {
      font-size: 10px;
      color: var(--text-muted);
      margin-left: auto;
    }

    .c-body {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.45;
    }
  `]
})
export class TaskDetailDrawerComponent {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public newSubtaskText = '';
  public commentText = '';

  close(): void {
    this.modalService.closeTaskDrawer();
  }

  editTask(task: Task): void {
    this.modalService.closeTaskDrawer();
    this.modalService.openTaskModal(task);
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.dataService.deleteTask(id);
      this.modalService.closeTaskDrawer();
      this.notifService.success('Task deleted successfully');
    }
  }

  onStatusChange(taskId: string, newStatus: TaskStatus): void {
    this.dataService.updateTaskStatus(taskId, newStatus);
    const updated = this.dataService.tasks().find(t => t.id === taskId);
    if (updated) {
      this.modalService.selectedTask.set(updated);
    }
    this.notifService.success('Status updated', `Task moved to ${newStatus.replace('_', ' ').toUpperCase()}`);
  }

  onPriorityChange(taskId: string, newPriority: PriorityLevel): void {
    this.dataService.updateTask(taskId, { priority: newPriority });
    const updated = this.dataService.tasks().find(t => t.id === taskId);
    if (updated) {
      this.modalService.selectedTask.set(updated);
    }
    this.notifService.success('Priority updated', `Priority set to ${newPriority.toUpperCase()}`);
  }

  getCompletedSubtasksCount(task: Task): number {
    return task.subtasks.filter(s => s.completed).length;
  }

  getSubtaskProgress(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return Math.round((this.getCompletedSubtasksCount(task) / task.subtasks.length) * 100);
  }

  toggleSubtask(task: Task, subtaskId: string): void {
    const updatedSubtasks = task.subtasks.map(s =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    this.dataService.updateTask(task.id, { subtasks: updatedSubtasks });
    const updated = this.dataService.tasks().find(t => t.id === task.id);
    if (updated) {
      this.modalService.selectedTask.set(updated);
    }
  }

  addSubtask(task: Task): void {
    if (!this.newSubtaskText.trim()) return;
    const newSub = {
      id: 'sub-' + Date.now(),
      title: this.newSubtaskText.trim(),
      completed: false
    };
    const updatedSubtasks = [...task.subtasks, newSub];
    this.dataService.updateTask(task.id, { subtasks: updatedSubtasks });
    const updated = this.dataService.tasks().find(t => t.id === task.id);
    if (updated) {
      this.modalService.selectedTask.set(updated);
    }
    this.newSubtaskText = '';
  }

  postComment(task: Task): void {
    if (!this.commentText.trim()) return;
    const currentUser = this.dataService.currentUser();
    const newComment = {
      id: 'c-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.roleTitle,
      content: this.commentText.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedComments = [newComment, ...task.comments];
    this.dataService.updateTask(task.id, { comments: updatedComments });
    const updated = this.dataService.tasks().find(t => t.id === task.id);
    if (updated) {
      this.modalService.selectedTask.set(updated);
    }
    this.commentText = '';
    this.notifService.success('Comment posted');
  }
}

