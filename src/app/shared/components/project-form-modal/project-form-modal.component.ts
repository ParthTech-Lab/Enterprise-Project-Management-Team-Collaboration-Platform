import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ModalService } from '../../../core/services/modal.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProjectStatus, PriorityLevel } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div
      *ngIf="modalService.isProjectModalOpen()"
      class="orbit-modal-backdrop"
      (click)="close()"
    >
      <div class="orbit-modal" (click)="$event.stopPropagation()">
        <div class="orbit-modal-header">
          <h3 class="orbit-modal-title">Initialize Enterprise Project</h3>
          <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-icon" (click)="close()">
            <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="modal-form-wrap">
          <div class="orbit-modal-body">
            <!-- Project Name & Key -->
            <div class="form-row-2">
              <div class="orbit-form-group flex-2">
                <label class="orbit-label"><span>Project Name <strong class="req">*</strong></span></label>
                <input
                  type="text"
                  class="orbit-input"
                  placeholder="e.g. Multi-Cluster Observability Mesh"
                  formControlName="name"
                />
                <span
                  *ngIf="projectForm.get('name')?.touched && projectForm.get('name')?.invalid"
                  class="form-error"
                >
                  Project name is required (min 5 chars).
                </span>
              </div>

              <div class="orbit-form-group flex-1">
                <label class="orbit-label"><span>Key Prefix <strong class="req">*</strong></span></label>
                <input
                  type="text"
                  class="orbit-input"
                  placeholder="ORB-999"
                  formControlName="key"
                />
              </div>
            </div>

            <!-- Team & Priority -->
            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Owning Team <strong class="req">*</strong></span></label>
                <select class="orbit-select" formControlName="teamId">
                  <option *ngFor="let t of dataService.teams()" [value]="t.id">
                    {{ t.name }} ({{ t.code }})
                  </option>
                </select>
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Priority</span></label>
                <select class="orbit-select" formControlName="priority">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <!-- Start Date & Deadline -->
            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Start Date</span></label>
                <input type="date" class="orbit-input" formControlName="startDate" />
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Target Deadline <strong class="req">*</strong></span></label>
                <input type="date" class="orbit-input" formControlName="deadline" />
              </div>
            </div>

            <!-- Budget (Allocated) -->
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Capital Budget Allocation (INR ₹)</span></label>
              <input type="number" class="orbit-input" placeholder="e.g. 25000000 (₹2.50 Cr)" formControlName="budget" />
            </div>

            <!-- Tags -->
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Tags / Domains</span></label>
              <input type="text" class="orbit-input" placeholder="Kubernetes, Telemetry, Q4" formControlName="tags" />
            </div>

            <!-- Description -->
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Project Executive Summary & Scope</span></label>
              <textarea
                class="orbit-textarea"
                rows="3"
                placeholder="High-level architectural goals, customer value, and engineering milestones..."
                formControlName="description"
              ></textarea>
            </div>
          </div>

          <div class="orbit-modal-footer">
            <button type="button" class="orbit-btn orbit-btn-secondary" (click)="close()">
              Cancel
            </button>
            <button
              type="submit"
              class="orbit-btn orbit-btn-primary"
              [disabled]="projectForm.invalid || isSubmitting"
            >
              <app-icon *ngIf="!isSubmitting" name="plus" [size]="15"></app-icon>
              <span>{{ isSubmitting ? 'Initializing...' : 'Launch Project' }}</span>
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
      display: flex;
      gap: 16px;
    }
    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }
    @media (max-width: 600px) {
      .form-row-2 {
        flex-direction: column;
      }
    }
    .req {
      color: var(--accent-crimson);
    }
    .form-error {
      font-size: 11px;
      color: var(--accent-crimson);
      margin-top: 4px;
    }
  `]
})
export class ProjectFormModalComponent implements OnInit {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public projectForm!: FormGroup;
  public isSubmitting = false;

  ngOnInit(): void {
    const defaultTeam = this.dataService.teams()[0]?.id || '';
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      key: new FormControl('ORB-888', [Validators.required]),
      teamId: new FormControl(defaultTeam, [Validators.required]),
      priority: new FormControl<PriorityLevel>('high', [Validators.required]),
      startDate: new FormControl('2026-11-05'),
      deadline: new FormControl('2027-01-31', [Validators.required]),
      budget: new FormControl(250000, [Validators.min(1000)]),
      tags: new FormControl('Core, Cloud, Q4'),
      description: new FormControl('')
    });
  }

  close(): void {
    this.modalService.closeProjectModal();
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const vals = this.projectForm.value;
    const team = this.dataService.teams().find(t => t.id === vals.teamId);
    const user = this.dataService.currentUser();

    const tagList = vals.tags
      ? vals.tags.split(',').map((t: string) => t.trim()).filter((t: string) => !!t)
      : [];

    setTimeout(() => {
      const newProj = this.dataService.addProject({
        key: vals.key,
        name: vals.name,
        description: vals.description || '',
        ownerId: user.id,
        ownerName: user.name,
        ownerAvatar: user.avatar,
        teamId: vals.teamId,
        teamName: team ? team.name : 'Engineering',
        status: 'active',
        priority: vals.priority,
        progress: 10,
        startDate: vals.startDate || '2026-11-05',
        deadline: vals.deadline,
        budget: {
          allocated: vals.budget || 25000000,
          spent: 0,
          currency: 'INR'
        },
        health: 'healthy',
        healthScore: 95,
        memberIds: [user.id],
        tasksCount: 0,
        completedTasksCount: 0,
        tags: tagList,
        milestones: [
          { id: 'm-init', title: 'Phase 1: Architecture Blueprint & Spec', dueDate: vals.deadline, completed: false, tasksCount: 0, completedTasksCount: 0 }
        ]
      });

      this.notifService.success('Project Launched', `${newProj.name} (${newProj.key}) is active`);
      this.isSubmitting = false;
      this.close();
    }, 250);
  }
}

