import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { CalendarEvent, EventType } from '../../core/models/event.model';

interface DayCell {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent],
  template: `
    <div class="calendar-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Calendar</span>
          </div>
          <h1 class="page-title">Enterprise Release & Events Calendar</h1>
          <p class="page-subtitle">
            Synchronize architecture reviews, stakeholder checkpoints, and production cutovers
          </p>
        </div>

        <div class="header-right">
          <div class="view-switch-group">
            <button
              type="button"
              class="v-btn"
              [class.active]="viewMode === 'month'"
              (click)="viewMode = 'month'"
            >
              Month
            </button>
            <button
              type="button"
              class="v-btn"
              [class.active]="viewMode === 'agenda'"
              (click)="viewMode = 'agenda'"
            >
              Agenda
            </button>
          </div>

          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openEventModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Schedule Event</span>
          </button>
        </div>
      </header>

      <!-- Calendar Navigation & Controls Toolbar -->
      <section class="cal-controls-bar">
        <div class="month-nav-wrap">
          <h2 class="current-month-heading">November 2026</h2>
          <div class="cal-nav-buttons">
            <button type="button" class="nav-arrow-btn" (click)="notifService.info('Calendar', 'Navigating to previous month')">
              <app-icon name="chevron-left" [size]="16"></app-icon>
            </button>
            <button type="button" class="today-btn" (click)="notifService.info('Calendar', 'Jumped to today')">
              Today
            </button>
            <button type="button" class="nav-arrow-btn" (click)="notifService.info('Calendar', 'Navigating to next month')">
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
        </div>

        <!-- Filter by Event Type -->
        <div class="type-filter-pills">
          <button
            type="button"
            class="t-pill"
            [class.active]="selectedType === 'all'"
            (click)="selectedType = 'all'"
          >
            All Types
          </button>
          <button
            type="button"
            class="t-pill review"
            [class.active]="selectedType === 'review'"
            (click)="selectedType = 'review'"
          >
            Reviews
          </button>
          <button
            type="button"
            class="t-pill meeting"
            [class.active]="selectedType === 'meeting'"
            (click)="selectedType = 'meeting'"
          >
            Meetings
          </button>
          <button
            type="button"
            class="t-pill deadline"
            [class.active]="selectedType === 'deadline'"
            (click)="selectedType = 'deadline'"
          >
            Deadlines
          </button>
          <button
            type="button"
            class="t-pill release"
            [class.active]="selectedType === 'release'"
            (click)="selectedType = 'release'"
          >
            Releases
          </button>
        </div>
      </section>

      <!-- MONTH VIEW -->
      <div *ngIf="viewMode === 'month'" class="month-grid-wrapper">
        <!-- Weekday Headers -->
        <div class="weekday-header-row">
          <span class="wd-cell">SUN</span>
          <span class="wd-cell">MON</span>
          <span class="wd-cell">TUE</span>
          <span class="wd-cell">WED</span>
          <span class="wd-cell">THU</span>
          <span class="wd-cell">FRI</span>
          <span class="wd-cell">SAT</span>
        </div>

        <!-- Days Grid -->
        <div class="calendar-days-grid">
          <div
            *ngFor="let day of monthDays"
            class="cal-day-cell"
            [class.other-month]="!day.isCurrentMonth"
            [class.today]="day.isToday"
            (click)="modalService.openEventModal()"
          >
            <div class="day-cell-top">
              <span class="day-number" [class.today-badge]="day.isToday">{{ day.dayNumber }}</span>
              <span *ngIf="day.isToday" class="today-tag">TODAY</span>
            </div>

            <!-- Events Inside Day -->
            <div class="day-events-list">
              <div
                *ngFor="let evt of getDayEvents(day.dateStr)"
                class="evt-pill"
                [ngClass]="evt.type"
                (click)="$event.stopPropagation(); onEventClick(evt)"
                [attr.title]="evt.title + ' (' + evt.startDate + ')'"
              >
                <span class="evt-dot"></span>
                <span class="evt-title">{{ evt.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AGENDA VIEW -->
      <div *ngIf="viewMode === 'agenda'" class="agenda-view-card">
        <div class="agenda-list">
          <div *ngFor="let evt of filteredEvents()" class="agenda-row" (click)="onEventClick(evt)">
            <div class="agenda-date-box">
              <span class="a-month">{{ evt.startDate | slice:5:7 }}/{{ evt.startDate | slice:8:10 }}</span>
              <span class="a-time">{{ evt.startDate | slice:11:16 }}</span>
            </div>
            <div class="agenda-body">
              <div class="agenda-top">
                <span class="agenda-title">{{ evt.title }}</span>
                <app-badge [variant]="getEventBadgeVariant(evt.type)" size="sm">
                  {{ evt.type | uppercase }}
                </app-badge>
              </div>
              <p class="agenda-desc" *ngIf="evt.description">{{ evt.description }}</p>
              <div class="agenda-footer-meta">
                <span *ngIf="evt.projectName" class="a-proj">Project: {{ evt.projectName }}</span>
                <span class="a-loc">Location: {{ evt.location || 'Virtual Bridge' }}</span>
              </div>
            </div>
            <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="$event.stopPropagation(); deleteEvent(evt.id)">
              <app-icon name="trash-2" [size]="14"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-viewport {
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

    .view-switch-group {
      display: flex;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .v-btn {
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
    .v-btn.active {
      background: var(--surface-tertiary);
      color: var(--accent-emerald);
      font-weight: 600;
    }

    /* Controls Bar */
    .cal-controls-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 18px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
    }

    .month-nav-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .current-month-heading {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .cal-nav-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-arrow-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .today-btn {
      height: 28px;
      padding: 0 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      cursor: pointer;
    }

    .type-filter-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .t-pill {
      height: 26px;
      padding: 0 10px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 9999px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .t-pill:hover { background: var(--surface-secondary); }
    .t-pill.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Month View Grid */
    .month-grid-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .weekday-header-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      border-bottom: 1px solid var(--border-default);
      background: var(--surface-secondary);
    }

    .wd-cell {
      padding: 10px 0;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.06em;
      border-right: 1px solid var(--border-subtle);
    }
    .wd-cell:last-child { border-right: none; }

    .calendar-days-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(90px, 1fr);
      overflow-y: auto;
    }

    .cal-day-cell {
      border-right: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      transition: background 0.12s ease;
      min-height: 90px;
    }
    .cal-day-cell:nth-child(7n) { border-right: none; }
    .cal-day-cell:hover { background: var(--surface-secondary); }

    .cal-day-cell.other-month {
      opacity: 0.35;
      background: rgba(0, 0, 0, 0.05);
    }

    .cal-day-cell.today {
      background: rgba(16, 185, 129, 0.04);
    }

    .day-cell-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .day-number {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .today-badge {
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: var(--accent-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .today-tag {
      font-size: 9px;
      font-weight: 700;
      color: var(--accent-emerald);
      letter-spacing: 0.04em;
    }

    .day-events-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .evt-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 500;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: transform 0.12s ease;
    }
    .evt-pill:hover {
      transform: translateX(1px);
    }

    .evt-pill.review {
      background: var(--accent-emerald-subtle);
      border-color: rgba(16, 185, 129, 0.3);
      color: var(--accent-emerald);
    }
    .evt-pill.deadline {
      background: var(--accent-crimson-subtle);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--accent-crimson);
    }
    .evt-pill.meeting {
      background: var(--accent-purple-subtle);
      border-color: rgba(139, 92, 246, 0.3);
      color: var(--accent-purple);
    }
    .evt-pill.release {
      background: var(--accent-amber-subtle);
      border-color: rgba(245, 158, 11, 0.3);
      color: var(--accent-amber);
    }

    .evt-dot {
      width: 5px;
      height: 5px;
      border-radius: 9999px;
      background-color: currentColor;
      flex-shrink: 0;
    }

    .evt-title {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Agenda View */
    .agenda-view-card {
      flex: 1;
      overflow-y: auto;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 16px;
    }

    .agenda-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .agenda-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-radius: var(--radius-md);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .agenda-row:hover {
      background: var(--surface-tertiary);
      border-color: var(--border-default);
    }

    .agenda-date-box {
      width: 60px;
      padding: 8px 4px;
      background: var(--surface-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .a-month {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .a-time {
      font-size: 11px;
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .agenda-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .agenda-top {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .agenda-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .agenda-desc {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .agenda-footer-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .a-proj { color: var(--accent-emerald); }
  `]
})
export class CalendarComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public viewMode: 'month' | 'agenda' = 'month';
  public selectedType: string = 'all';

  // November 2026 starts on Sunday Nov 1
  public monthDays: DayCell[] = this.generateMonthDays();

  private generateMonthDays(): DayCell[] {
    const days: DayCell[] = [];
    // Nov 1, 2026 is Sunday
    for (let i = 1; i <= 30; i++) {
      const dStr = `2026-11-${i.toString().padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr: dStr,
        isCurrentMonth: true,
        isToday: i === 5,
        events: []
      });
    }
    // Pad to 35 days (5 full weeks)
    for (let i = 1; i <= 5; i++) {
      const dStr = `2026-12-${i.toString().padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr: dStr,
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    return days;
  }

  getDayEvents(dateStr: string): CalendarEvent[] {
    return this.dataService
      .events()
      .filter(e => e.startDate.startsWith(dateStr))
      .filter(e => this.selectedType === 'all' || e.type === this.selectedType);
  }

  public filteredEvents = computed(() => {
    let list = this.dataService.events();
    if (this.selectedType !== 'all') {
      list = list.filter(e => e.type === this.selectedType);
    }
    return list;
  });

  getEventBadgeVariant(type: EventType): 'emerald' | 'amber' | 'crimson' | 'purple' | 'graphite' {
    switch (type) {
      case 'review': return 'emerald';
      case 'meeting': return 'purple';
      case 'deadline': return 'crimson';
      case 'release': return 'amber';
      default: return 'graphite';
    }
  }

  onEventClick(event: CalendarEvent): void {
    this.notifService.info(event.title, `Scheduled on ${event.startDate}`);
  }

  deleteEvent(id: string): void {
    //
  }
}

