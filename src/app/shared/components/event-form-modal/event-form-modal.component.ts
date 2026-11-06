import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ModalService } from '../../../core/services/modal.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EventType } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div
      *ngIf="modalService.isEventModalOpen()"
      class="orbit-modal-backdrop"
      (click)="close()"
    >
      <div class="orbit-modal" (click)="$event.stopPropagation()">
        <div class="orbit-modal-header">
          <h3 class="orbit-modal-title">Schedule Enterprise Event / Review</h3>
          <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-icon" (click)="close()">
            <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>

        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="modal-form-wrap">
          <div class="orbit-modal-body">
            <div class="orbit-form-group">
              <label class="orbit-label"><span>Event Title <strong class="req">*</strong></span></label>
              <input
                type="text"
                class="orbit-input"
                placeholder="e.g. Istio Multi-Region Failover Architecture Drill"
                formControlName="title"
              />
            </div>

            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Event Type</span></label>
                <select class="orbit-select" formControlName="type">
                  <option value="review">Architecture Review</option>
                  <option value="meeting">Team Meeting</option>
                  <option value="deadline">Sprint Deadline</option>
                  <option value="milestone">Executive Milestone</option>
                  <option value="release">Production Release</option>
                  <option value="workshop">Technical Workshop</option>
                </select>
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>Associated Project</span></label>
                <select class="orbit-select" formControlName="projectId">
                  <option *ngFor="let p of dataService.projects()" [value]="p.id">
                    {{ p.key }} - {{ p.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Start Date & Time <strong class="req">*</strong></span></label>
                <input type="datetime-local" class="orbit-input" formControlName="startDate" />
              </div>

              <div class="orbit-form-group">
                <label class="orbit-label"><span>End Date & Time <strong class="req">*</strong></span></label>
                <input type="datetime-local" class="orbit-input" formControlName="endDate" />
              </div>
            </div>

            <div class="orbit-form-group">
              <label class="orbit-label"><span>Location / Video Bridge Link</span></label>
              <input
                type="text"
                class="orbit-input"
                placeholder="Executive Boardroom A / https://zoom.us/j/orbit-eng"
                formControlName="location"
              />
            </div>

            <div class="orbit-form-group">
              <label class="orbit-label"><span>Agenda / Description</span></label>
              <textarea
                class="orbit-textarea"
                rows="3"
                placeholder="Key discussion topics, review artifacts, and deliverables..."
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
              [disabled]="eventForm.invalid"
            >
              <app-icon name="calendar" [size]="15"></app-icon>
              <span>Schedule Event</span>
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
    .req { color: var(--accent-crimson); }
  `]
})
export class EventFormModalComponent implements OnInit {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public eventForm!: FormGroup;

  ngOnInit(): void {
    const defaultProj = this.dataService.projects()[0]?.id || '';
    this.eventForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(4)]),
      type: new FormControl<EventType>('meeting', [Validators.required]),
      projectId: new FormControl(defaultProj),
      startDate: new FormControl('2026-11-10T10:00', [Validators.required]),
      endDate: new FormControl('2026-11-10T11:30', [Validators.required]),
      location: new FormControl('Virtual Bridge (Zoom / Teams)'),
      description: new FormControl('')
    });
  }

  close(): void {
    this.modalService.closeEventModal();
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;
    const vals = this.eventForm.value;
    const proj = this.dataService.projects().find(p => p.id === vals.projectId);

    this.dataService.addCalendarEvent({
      title: vals.title,
      type: vals.type,
      startDate: vals.startDate,
      endDate: vals.endDate,
      allDay: false,
      projectId: vals.projectId,
      projectName: proj ? proj.name : undefined,
      location: vals.location,
      description: vals.description,
      attendeeIds: [this.dataService.currentUser().id],
      color: '#10B981'
    });

    this.notifService.success('Event Scheduled', vals.title);
    this.close();
  }
}

