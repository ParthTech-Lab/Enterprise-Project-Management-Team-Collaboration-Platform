import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ModalService } from '../../../core/services/modal.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { PriorityLevel } from '../../../core/models/project.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div
      *ngIf="modalService.isTaskModalOpen()"
      class="orbit-modal-backdrop"
      (click)="close()"
    >
      <div class="orbit-modal" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="orbit-modal-header">
          <h3 class="orbit-modal-title">
            {{ isEditMode ? 'Edit Task: ' + taskToEdit?.key : 'Create New Enterprise Task' }}
          </h3>
          <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-icon" (click)="close()">
            <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="modal-form-wrap">
          <div class="orbit-modal-body">
            <!-- Title -->
            <div class="orbit-form-group">
              <label class="orbit-label">
                <span>Task Title <strong class="req">*</strong></span>
                <span class="char-count">{{ taskForm.get('title')?.value?.length || 0 }}/120</span>
              </label>
              <input
                type="text"
                class="orbit-input"
                placeholder="e.g. Implement multi-region mTLS failover certificate rotation"
                formControlName="title"
                maxlength="120"
              />
              <span
                *ngIf="taskForm.get('title')?.touched && taskForm.get('title')?.invalid"
                class="form-error"
              >
                Task title is required (minimum 5 characters).
              </span>
            </div>

            <!-- Project & Assignee Row -->
            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Project <strong class="req">*</strong></span></label>
                <select class="orbit-select" formControlName="projectId">
                  <option *ngFor="let p of dataService.projects()" [value]="p.id">
                    {{ p.key }} - {{ p.name }}
                  </option>
                </select>
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Assignee <strong class="req">*</strong></span></label>
                <select class="orbit-select" formControlName="assigneeId">
                  <option *ngFor="let u of dataService.users()" [value]="u.id">
                    {{ u.name }} ({{ u.roleTitle }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Priority & Status Row -->
            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Priority</span></label>
                <select class="orbit-select" formControlName="priority">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Status</span></label>
                <select class="orbit-select" formControlName="status">
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <!-- Due Date & Estimated Hours -->
            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Due Date <strong class="req">*</strong></span></label>
                <input type="date" class="orbit-input" formControlName="dueDate" />
                <span
                  *ngIf="taskForm.get('dueDate')?.touched && taskForm.get('dueDate')?.invalid"
                  class="form-error"
                >
                  Due date is required.
                </span>
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Estimated Effort (Hours)</span></label>
                <input type="number" class="orbit-input" formControlName="estimatedHours" min="1" max="500" />
              </div>
            </div>

            <!-- Tags -->
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Tags (Comma separated)</span></label>
              <input
                type="text"
                class="orbit-input"
                placeholder="e.g. Security, Kubernetes, SRE"
                formControlName="tags"
              />
            </div>

            <!-- Description -->
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Technical Description & Acceptance Criteria</span></label>
              <textarea
                class="orbit-textarea"
                rows="4"
                placeholder="Provide detailed context, reproduction steps, or architectural constraints..."
                formControlName="description"
              ></textarea>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="orbit-modal-footer">
            <button type="button" class="orbit-btn orbit-btn-secondary" (click)="close()">
              Cancel
            </button>
            <button
              type="submit"
              class="orbit-btn orbit-btn-primary"
              [disabled]="taskForm.invalid || isSubmitting"
            >
              <app-icon *ngIf="!isSubmitting" [name]="isEditMode ? 'check' : 'plus'" [size]="15"></app-icon>
              <span>{{ isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Task') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-form-wrap {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .form-row-2 {
        grid-template-columns: 1fr;
      }
    }
    .req {
      color: var(--accent-crimson);
    }
    .char-count {
      font-size: 11px;
      color: var(--text-muted);
    }
    .form-error {
      font-size: 11px;
      color: var(--accent-crimson);
      margin-top: 4px;
    }
  `]
})
export class TaskFormModalComponent implements OnInit {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public taskForm!: FormGroup;
  public isEditMode = false;
  public taskToEdit: Task | null = null;
  public isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const edit = this.modalService.taskToEdit();
    this.isEditMode = !!edit;
    this.taskToEdit = edit;

    const defaultProj = this.dataService.projects()[0]?.id || '';
    const defaultUser = this.dataService.users()[0]?.id || '';

    this.taskForm = new FormGroup({
      title: new FormControl(edit ? edit.title : '', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]),
      projectId: new FormControl(edit ? edit.projectId : defaultProj, [Validators.required]),
      assigneeId: new FormControl(edit ? edit.assigneeId : defaultUser, [Validators.required]),
      priority: new FormControl<PriorityLevel>(edit ? edit.priority : 'medium', [Validators.required]),
      status: new FormControl<TaskStatus>(edit ? edit.status : 'todo', [Validators.required]),
      dueDate: new FormControl(edit ? edit.dueDate : '2026-11-20', [Validators.required]),
      estimatedHours: new FormControl(edit ? edit.estimatedHours : 16, [Validators.min(1)]),
      tags: new FormControl(edit ? edit.tags.join(', ') : 'Infrastructure'),
      description: new FormControl(edit ? edit.description : '')
    });
  }

  close(): void {
    this.modalService.closeTaskModal();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVals = this.taskForm.value;

    const proj = this.dataService.projects().find(p => p.id === formVals.projectId);
    const assignee = this.dataService.users().find(u => u.id === formVals.assigneeId);
    const reporter = this.dataService.currentUser();

    const tagList = formVals.tags
      ? formVals.tags.split(',').map((t: string) => t.trim()).filter((t: string) => !!t)
      : [];

    setTimeout(() => {
      if (this.isEditMode && this.taskToEdit) {
        this.dataService.updateTask(this.taskToEdit.id, {
          title: formVals.title,
          projectId: formVals.projectId,
          projectName: proj ? proj.name : this.taskToEdit.projectName,
          projectKey: proj ? proj.key : this.taskToEdit.projectKey,
          assigneeId: formVals.assigneeId,
          assigneeName: assignee ? assignee.name : this.taskToEdit.assigneeName,
          assigneeAvatar: assignee ? assignee.avatar : this.taskToEdit.assigneeAvatar,
          assigneeRole: assignee ? assignee.roleTitle : this.taskToEdit.assigneeRole,
          priority: formVals.priority,
          status: formVals.status,
          dueDate: formVals.dueDate,
          estimatedHours: formVals.estimatedHours || 16,
          tags: tagList,
          description: formVals.description
        });
        this.notifService.success('Task Updated', `Changes saved to ${this.taskToEdit.key}`);
      } else {
        const newTask = this.dataService.addTask({
          key: (proj ? proj.key : 'VTX') + '-' + (Math.floor(Math.random() * 800) + 100),
          title: formVals.title,
          description: formVals.description || '',
          projectId: formVals.projectId,
          projectName: proj ? proj.name : 'Platform Project',
          projectKey: proj ? proj.key : 'VTX',
          assigneeId: formVals.assigneeId,
          assigneeName: assignee ? assignee.name : 'Ananya Iyer',
          assigneeAvatar: assignee ? assignee.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          assigneeRole: assignee ? assignee.roleTitle : 'Principal Engineer',
          reporterId: reporter.id,
          reporterName: reporter.name,
          reporterAvatar: reporter.avatar,
          priority: formVals.priority,
          status: formVals.status,
          startDate: new Date().toISOString().slice(0, 10),
          dueDate: formVals.dueDate,
          tags: tagList,
          subtasks: [],
          attachments: [],
          comments: [],
          history: [],
          estimatedHours: formVals.estimatedHours || 16,
          actualHours: 0
        });
        this.notifService.success('Task Created', `New ticket ${newTask.key} added to board`);
      }

      this.isSubmitting = false;
      this.close();
    }, 250);
  }
}

