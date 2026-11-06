import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-my-work',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IconComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="my-work-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">My Work & Deliverables</span>
          </div>
          <h1 class="page-title">Personal Workspace: {{ dataService.currentUser().name }}</h1>
          <p class="page-subtitle">
            {{ assignedTasks().length }} assigned engineering tickets, 5 active initiatives, and today's priority focus
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openTaskModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Create Personal Task</span>
          </button>
        </div>
      </header>

      <!-- KPI Summary Cards -->
      <section class="mw-kpi-grid">
        <div class="mw-kpi">
          <span class="mw-lbl">Assigned to Me</span>
          <span class="mw-val">{{ assignedTasks().length }}</span>
          <span class="mw-sub">Tickets</span>
        </div>
        <div class="mw-kpi">
          <span class="mw-lbl">In Progress Right Now</span>
          <span class="mw-val emerald">{{ inProgressTasks().length }}</span>
          <span class="mw-sub">Active sprint items</span>
        </div>
        <div class="mw-kpi">
          <span class="mw-lbl">Completed This Quarter</span>
          <span class="mw-val">{{ dataService.currentUser().completedTasksCount }}</span>
          <span class="mw-sub">Merged & verified</span>
        </div>
        <div class="mw-kpi">
          <span class="mw-lbl">Weekly Utilization</span>
          <span class="mw-val">{{ dataService.currentUser().workloadPercentage }}%</span>
          <span class="mw-sub">36h / 40h capacity</span>
        </div>
      </section>

      <!-- Task Lists Split -->
      <div class="mw-content-grid">
        <!-- Assigned Tasks Table -->
        <div class="orbit-card flex-2">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="check-square" [size]="16"></app-icon>
              <span>My Action Items & Tickets</span>
            </h3>
            <span class="orbit-card-subtitle">{{ assignedTasks().length }} Tasks</span>
          </div>

          <div class="orbit-card-body p-0">
            <div class="orbit-table-container">
              <table class="orbit-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let t of assignedTasks()"
                    class="clickable-tr"
                    (click)="modalService.openTaskDrawer(t)"
                  >
                    <td><span class="t-key">{{ t.key }}</span></td>
                    <td><span class="t-title">{{ t.title }}</span></td>
                    <td><span class="t-proj">{{ t.projectName }}</span></td>
                    <td>
                      <app-badge [variant]="t.priority === 'critical' ? 'crimson' : t.priority === 'high' ? 'amber' : 'graphite'" size="sm">
                        {{ t.priority | uppercase }}
                      </app-badge>
                    </td>
                    <td>
                      <app-badge [variant]="t.status === 'completed' ? 'emerald' : t.status === 'blocked' ? 'crimson' : 'graphite'" size="sm">
                        {{ t.status | uppercase }}
                      </app-badge>
                    </td>
                    <td><span class="t-due">{{ t.dueDate }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Side: Focus & Objectives -->
        <div class="orbit-card flex-1">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="target" [size]="16"></app-icon>
              <span>Current Sprint Objectives</span>
            </h3>
          </div>
          <div class="orbit-card-body">
            <div class="objectives-list">
              <div class="obj-box">
                <span class="obj-title">Phase 3: Automated Failover Drill</span>
                <span class="obj-proj">Global Cloud Mesh (ORB-101)</span>
                <app-progress-bar [value]="75" [height]="5" variant="emerald"></app-progress-bar>
              </div>

              <div class="obj-box">
                <span class="obj-title">WebAuthn Passwordless Rollout</span>
                <span class="obj-proj">Zero-Trust Enterprise Auth (ORB-303)</span>
                <app-progress-bar [value]="45" [height]="5" variant="amber"></app-progress-bar>
              </div>

              <div class="obj-box">
                <span class="obj-title">Resource Allocator Heatmap</span>
                <span class="obj-proj">AI Workload Allocator (ORB-808)</span>
                <app-progress-bar [value]="85" [height]="5" variant="emerald"></app-progress-bar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-work-viewport {
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

    .mw-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 900px) {
      .mw-kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .mw-kpi {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mw-lbl {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .mw-val {
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.1;
    }
    .mw-val.emerald { color: var(--accent-emerald); }

    .mw-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    .mw-content-grid {
      display: flex;
      gap: 20px;
    }

    @media (max-width: 1024px) {
      .mw-content-grid {
        flex-direction: column;
      }
    }

    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }
    .p-0 { padding: 0; }

    .clickable-tr {
      cursor: pointer;
    }

    .t-key {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-emerald);
    }

    .t-title {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 13px;
    }

    .t-proj {
      font-size: 12px;
      color: var(--text-muted);
    }

    .t-due {
      font-size: 11px;
      color: var(--text-muted);
    }

    .objectives-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .obj-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
    }

    .obj-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .obj-proj {
      font-size: 11px;
      color: var(--accent-emerald);
    }
  `]
})
export class MyWorkComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);

  public assignedTasks = computed(() => {
    const user = this.dataService.currentUser();
    return this.dataService.tasks().filter(t => t.assigneeId === user.id || t.assigneeName === user.name);
  });

  public inProgressTasks = computed(() => {
    return this.assignedTasks().filter(t => t.status === 'in_progress');
  });
}

