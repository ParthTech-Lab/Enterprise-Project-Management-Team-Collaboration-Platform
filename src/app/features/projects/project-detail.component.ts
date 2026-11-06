import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';
import { formatINR } from '../../core/utils/currency.util';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IconComponent,
    AvatarComponent,
    BadgeComponent,
    ProgressBarComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="project-detail-viewport" *ngIf="project() as proj">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-trail">
        <a routerLink="/projects" class="bc-link">Projects</a>
        <span class="bc-sep">/</span>
        <span class="bc-key">{{ proj.key }}</span>
        <span class="bc-sep">/</span>
        <span class="bc-current">{{ proj.name }}</span>
      </nav>

      <!-- Project Header Hero Card -->
      <header class="project-hero-card">
        <div class="hero-top-row">
          <div class="title-meta-wrap">
            <div class="key-health-pills">
              <span class="proj-key-pill">{{ proj.key }}</span>
              <app-badge
                [variant]="proj.health === 'healthy' ? 'emerald' : proj.health === 'needs_attention' ? 'amber' : 'crimson'"
                size="sm"
                [dot]="true"
              >
                Health: {{ proj.healthScore }}% {{ proj.health | uppercase }}
              </app-badge>
              <app-badge variant="graphite" size="sm">
                {{ proj.teamName }}
              </app-badge>
            </div>
            <h1 class="project-hero-title">{{ proj.name }}</h1>
            <p class="project-hero-desc">{{ proj.description }}</p>
          </div>

          <div class="hero-actions">
            <button
              type="button"
              class="orbit-btn orbit-btn-primary"
              (click)="modalService.openTaskModal()"
            >
              <app-icon name="plus" [size]="15"></app-icon>
              <span>Add Task</span>
            </button>
            <button
              type="button"
              class="orbit-btn orbit-btn-secondary"
              (click)="notifService.info('Export Ready', 'Executive project snapshot generated')"
            >
              <app-icon name="download" [size]="15"></app-icon>
              <span>Export Brief</span>
            </button>
          </div>
        </div>

        <!-- Project Metrics Bar -->
        <div class="project-kpi-bar">
          <div class="kpi-segment">
            <span class="kpi-seg-label">Pacing & Progress</span>
            <div class="kpi-seg-body">
              <app-progress-bar [value]="proj.progress" [height]="6"></app-progress-bar>
              <span class="kpi-num">{{ proj.progress }}% Complete</span>
            </div>
          </div>

          <div class="kpi-segment">
            <span class="kpi-seg-label">Owner</span>
            <div class="owner-pill">
              <app-avatar [src]="proj.ownerAvatar" [name]="proj.ownerName" size="xs"></app-avatar>
              <span>{{ proj.ownerName }}</span>
            </div>
          </div>

          <div class="kpi-segment">
            <span class="kpi-seg-label">Deadline</span>
            <div class="kpi-val-row">
              <app-icon name="calendar" [size]="14"></app-icon>
              <span>{{ proj.deadline }}</span>
            </div>
          </div>

          <div class="kpi-segment">
            <span class="kpi-seg-label">Budget (INR)</span>
            <span class="kpi-num">{{ formatBudget(proj.budget.spent) }} / {{ formatBudget(proj.budget.allocated) }}</span>
          </div>

          <div class="kpi-segment">
            <span class="kpi-seg-label">Tasks</span>
            <span class="kpi-num">{{ projectTasks().length }} Tickets</span>
          </div>
        </div>

        <!-- Tabs Navigation Bar -->
        <div class="tabs-nav-bar">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'overview'"
            (click)="activeTab = 'overview'"
          >
            <app-icon name="dashboard" [size]="14"></app-icon>
            <span>Overview</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'tasks'"
            (click)="activeTab = 'tasks'"
          >
            <app-icon name="check-square" [size]="14"></app-icon>
            <span>Tasks ({{ projectTasks().length }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'milestones'"
            (click)="activeTab = 'milestones'"
          >
            <app-icon name="target" [size]="14"></app-icon>
            <span>Milestones ({{ proj.milestones.length }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'team'"
            (click)="activeTab = 'team'"
          >
            <app-icon name="users" [size]="14"></app-icon>
            <span>Assigned Team</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'files'"
            (click)="activeTab = 'files'"
          >
            <app-icon name="file-text" [size]="14"></app-icon>
            <span>Specifications & Files</span>
          </button>
        </div>
      </header>

      <!-- TAB 1: OVERVIEW -->
      <div *ngIf="activeTab === 'overview'" class="tab-content-grid">
        <!-- Left: Milestones & Risks -->
        <div class="detail-col-2">
          <!-- Milestones Card -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="target" [size]="16"></app-icon>
                <span>Phase Milestones</span>
              </h3>
              <span class="count-pill">{{ getCompletedMilestonesCount(proj) }}/{{ proj.milestones.length }} Done</span>
            </div>
            <div class="orbit-card-body p-0">
              <div class="milestones-stream">
                <div *ngFor="let m of proj.milestones" class="ms-row" [class.done]="m.completed">
                  <div class="ms-check-box" [class.checked]="m.completed" (click)="toggleMilestone(proj, m.id)">
                    <app-icon *ngIf="m.completed" name="check" [size]="12"></app-icon>
                  </div>
                  <div class="ms-info">
                    <span class="ms-title">{{ m.title }}</span>
                    <span class="ms-date">Due {{ m.dueDate }} • {{ m.completedTasksCount }}/{{ m.tasksCount }} tasks</span>
                  </div>
                  <app-badge [variant]="m.completed ? 'emerald' : 'amber'" size="sm">
                    {{ m.completed ? 'COMPLETED' : 'IN PROGRESS' }}
                  </app-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Register Card -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="alert-triangle" [size]="16"></app-icon>
                <span>Project Risk Matrix & Mitigation</span>
              </h3>
            </div>
            <div class="orbit-card-body p-0">
              <div *ngIf="proj.risks && proj.risks.length > 0; else noRisks" class="risks-list">
                <div *ngFor="let r of proj.risks" class="risk-item">
                  <div class="risk-top">
                    <app-badge [variant]="r.level === 'critical' ? 'crimson' : r.level === 'high' ? 'amber' : 'graphite'" size="sm">
                      {{ r.level | uppercase }} RISK
                    </app-badge>
                    <span class="risk-owner">Owner: {{ r.ownerName }}</span>
                  </div>
                  <span class="risk-title">{{ r.title }}</span>
                  <div class="mitigation-box">
                    <strong>Mitigation:</strong> {{ r.mitigation }}
                  </div>
                </div>
              </div>
              <ng-template #noRisks>
                <div class="p-4 text-muted text-center" style="padding: 24px;">
                  No active critical risks flagged on this initiative.
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Right: Recent Task Progress & Team -->
        <div class="detail-col-1">
          <!-- Quick Tasks Widget -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="check-square" [size]="16"></app-icon>
                <span>Recent Project Tasks</span>
              </h3>
              <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="activeTab = 'tasks'">
                All →
              </button>
            </div>
            <div class="orbit-card-body p-0">
              <div class="proj-task-compact-list">
                <div
                  *ngFor="let t of projectTasks().slice(0, 5)"
                  class="p-task-row"
                  (click)="modalService.openTaskDrawer(t)"
                >
                  <div class="pt-status" [ngClass]="t.status"></div>
                  <div class="pt-info">
                    <span class="pt-title">{{ t.title }}</span>
                    <span class="pt-due">Due {{ t.dueDate }}</span>
                  </div>
                  <app-avatar [src]="t.assigneeAvatar" [name]="t.assigneeName" size="xs"></app-avatar>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags & Blueprint Card -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">
                <app-icon name="sliders" [size]="16"></app-icon>
                <span>Architectural Tags</span>
              </h3>
            </div>
            <div class="orbit-card-body">
              <div class="tags-cloud">
                <span *ngFor="let tag of proj.tags" class="tag-pill">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: TASKS TABLE -->
      <div *ngIf="activeTab === 'tasks'" class="tab-table-view">
        <div class="table-actions-bar">
          <input
            type="text"
            class="orbit-input"
            style="max-width: 320px;"
            placeholder="Filter project tasks..."
            [(ngModel)]="taskFilter"
          />
          <button type="button" class="orbit-btn orbit-btn-primary orbit-btn-sm" (click)="modalService.openTaskModal()">
            <app-icon name="plus" [size]="14"></app-icon>
            <span>New Ticket</span>
          </button>
        </div>

        <div class="orbit-table-container">
          <table class="orbit-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Task Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Effort</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let t of filteredProjectTasks()"
                class="clickable-tr"
                (click)="modalService.openTaskDrawer(t)"
              >
                <td><span class="table-key">{{ t.key }}</span></td>
                <td><span class="table-proj-title">{{ t.title }}</span></td>
                <td>
                  <app-badge [variant]="t.status === 'completed' ? 'emerald' : t.status === 'blocked' ? 'crimson' : 'graphite'" size="sm">
                    {{ t.status | uppercase }}
                  </app-badge>
                </td>
                <td>
                  <app-badge [variant]="t.priority === 'critical' ? 'crimson' : t.priority === 'high' ? 'amber' : 'graphite'" size="sm">
                    {{ t.priority | uppercase }}
                  </app-badge>
                </td>
                <td>
                  <div class="table-owner">
                    <app-avatar [src]="t.assigneeAvatar" [name]="t.assigneeName" size="xs"></app-avatar>
                    <span>{{ t.assigneeName }}</span>
                  </div>
                </td>
                <td><span class="table-date">{{ t.dueDate }}</span></td>
                <td><span class="table-budget">{{ t.actualHours }}h / {{ t.estimatedHours }}h</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: MILESTONES -->
      <div *ngIf="activeTab === 'milestones'" class="milestones-full-view">
        <div class="milestones-grid">
          <div *ngFor="let m of proj.milestones" class="milestone-card" [class.complete]="m.completed">
            <div class="m-card-top">
              <span class="m-target">TARGET: {{ m.dueDate }}</span>
              <app-badge [variant]="m.completed ? 'emerald' : 'amber'" size="sm">
                {{ m.completed ? 'Completed' : 'On Track' }}
              </app-badge>
            </div>
            <h4 class="m-title">{{ m.title }}</h4>
            <div class="m-progress-wrap">
              <div class="m-p-labels">
                <span>Task Pacing</span>
                <span>{{ m.completedTasksCount }} of {{ m.tasksCount }} tasks</span>
              </div>
              <app-progress-bar
                [value]="m.tasksCount ? (m.completedTasksCount / m.tasksCount) * 100 : 0"
                [height]="5"
              ></app-progress-bar>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: TEAM -->
      <div *ngIf="activeTab === 'team'" class="team-full-view">
        <div class="members-grid">
          <div *ngFor="let u of dataService.users().slice(0, 6)" class="member-card">
            <app-avatar [src]="u.avatar" [name]="u.name" [status]="u.status" size="lg"></app-avatar>
            <div class="m-card-meta">
              <span class="m-card-name">{{ u.name }}</span>
              <span class="m-card-role">{{ u.roleTitle }}</span>
              <span class="m-card-dept">{{ u.department }}</span>
            </div>
            <button
              type="button"
              class="orbit-btn orbit-btn-secondary orbit-btn-sm"
              (click)="modalService.openMemberDrawer(u)"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 5: FILES -->
      <div *ngIf="activeTab === 'files'" class="files-full-view">
        <div class="files-grid">
          <div *ngFor="let doc of dataService.documents().slice(0, 4)" class="file-card">
            <div class="file-icon-box">
              <app-icon name="file-text" [size]="20"></app-icon>
            </div>
            <div class="file-info">
              <span class="file-title">{{ doc.title }}</span>
              <span class="file-sub">{{ doc.size }} • {{ doc.version }} • {{ doc.ownerName }}</span>
            </div>
            <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-icon" (click)="notifService.success('Download initiated', doc.title)">
              <app-icon name="download" [size]="15"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="project-detail-viewport" *ngIf="!project()">
      <app-empty-state
        icon="folder"
        title="Project Initiative Not Found"
        description="The requested enterprise project initiative does not exist in the active workspace or has been archived."
      >
        <a routerLink="/projects" class="orbit-btn orbit-btn-secondary" style="margin-top: 16px;">
          Return to Projects Portfolio
        </a>
      </app-empty-state>
    </div>
  `,
  styles: [`
    .project-detail-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .bc-link {
      color: var(--accent-emerald);
      text-decoration: none;
    }
    .bc-sep { color: var(--border-strong); }
    .bc-key { font-weight: 700; color: var(--text-secondary); }
    .bc-current { color: var(--text-primary); font-weight: 500; }

    /* Hero Card */
    .project-hero-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-shadow: var(--shadow-sm);
    }

    .hero-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
    }

    @media (max-width: 850px) {
      .hero-top-row {
        flex-direction: column;
      }
    }

    .title-meta-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .key-health-pills {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .proj-key-pill {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .project-hero-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .project-hero-desc {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
      max-width: 820px;
    }

    .hero-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    /* KPI Bar */
    .project-kpi-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 16px;
      padding: 16px 20px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
    }

    @media (max-width: 900px) {
      .project-kpi-bar {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .kpi-segment {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .kpi-seg-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .kpi-seg-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .kpi-num {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .owner-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .kpi-val-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Tabs Bar */
    .tabs-nav-bar {
      display: flex;
      gap: 4px;
      border-top: 1px solid var(--border-subtle);
      padding-top: 14px;
      overflow-x: auto;
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 14px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }

    .tab-btn.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Tab Grid Layout */
    .tab-content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    @media (max-width: 1024px) {
      .tab-content-grid {
        grid-template-columns: 1fr;
      }
    }

    .detail-col-2, .detail-col-1 {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .p-0 { padding: 0; }

    .count-pill {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
    }

    /* Milestones */
    .milestones-stream {
      display: flex;
      flex-direction: column;
    }

    .ms-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .ms-row:last-child { border-bottom: none; }

    .ms-check-box {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .ms-check-box.checked {
      background: var(--accent-emerald);
      border-color: var(--accent-emerald);
      color: #ffffff;
    }

    .ms-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .ms-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .ms-row.done .ms-title {
      text-decoration: line-through;
      color: var(--text-muted);
    }

    .ms-date {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Risks */
    .risks-list {
      display: flex;
      flex-direction: column;
    }

    .risk-item {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .risk-item:last-child { border-bottom: none; }

    .risk-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .risk-owner {
      font-size: 11px;
      color: var(--text-muted);
    }

    .risk-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .mitigation-box {
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    /* Compact Task List */
    .proj-task-compact-list {
      display: flex;
      flex-direction: column;
    }

    .p-task-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background 0.12s ease;
    }
    .p-task-row:hover { background: var(--surface-secondary); }
    .p-task-row:last-child { border-bottom: none; }

    .pt-status {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      flex-shrink: 0;
    }
    .pt-status.in_progress { background: var(--accent-emerald); }
    .pt-status.blocked { background: var(--accent-crimson); }
    .pt-status.todo { background: var(--accent-amber); }
    .pt-status.completed { background: var(--accent-emerald); }
    .pt-status.review { background: var(--accent-purple); }

    .pt-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .pt-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pt-due {
      font-size: 10px;
      color: var(--text-muted);
    }

    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag-pill {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 4px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
    }

    /* Tasks Tab View */
    .tab-table-view {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .table-actions-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .clickable-tr {
      cursor: pointer;
    }

    .table-key {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-emerald);
    }

    .table-proj-title {
      font-weight: 600;
      color: var(--text-primary);
    }

    .table-owner {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      font-size: 12px;
    }

    .table-date {
      font-size: 12px;
      color: var(--text-muted);
    }

    .table-budget {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Milestones Grid */
    .milestones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .milestone-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .m-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .m-target {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .m-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .m-progress-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: auto;
    }

    .m-p-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Team Grid */
    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    .member-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
    }

    .m-card-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .m-card-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .m-card-role {
      font-size: 11px;
      color: var(--accent-emerald);
      font-weight: 500;
    }

    .m-card-dept {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Files Grid */
    .files-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .file-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .file-icon-box {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--accent-purple-subtle);
      color: var(--accent-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .file-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .file-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-sub {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public projectId = signal<string>('');
  public activeTab: 'overview' | 'tasks' | 'milestones' | 'team' | 'files' = 'overview';
  public taskFilter = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      if (id) {
        this.projectId.set(id);
      } else {
        this.projectId.set(this.dataService.projects()[0]?.id || 'proj-1');
      }
    });
  }

  public project = computed(() => {
    return this.dataService.projects().find(p => p.id === this.projectId()) || this.dataService.projects()[0];
  });

  public projectTasks = computed(() => {
    const proj = this.project();
    if (!proj) return [];
    return this.dataService.tasks().filter(t => t.projectId === proj.id);
  });

  public filteredProjectTasks = computed(() => {
    let tasks = this.projectTasks();
    if (this.taskFilter.trim()) {
      const q = this.taskFilter.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.key.toLowerCase().includes(q));
    }
    return tasks;
  });

  getCompletedMilestonesCount(proj: Project): number {
    return proj.milestones.filter(m => m.completed).length;
  }

  toggleMilestone(proj: Project, milestoneId: string): void {
    const updated = proj.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    this.dataService.updateProject(proj.id, { milestones: updated });
    this.notifService.success('Milestone updated');
  }

  formatBudget(amount: number): string {
    return formatINR(amount, { compact: true });
  }
}

