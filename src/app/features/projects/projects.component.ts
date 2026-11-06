import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { Project, ProjectStatus, PriorityLevel } from '../../core/models/project.model';
import { formatINR } from '../../core/utils/currency.util';

@Component({
  selector: 'app-projects',
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
    <div class="projects-viewport">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Projects</span>
          </div>
          <h1 class="page-title">Enterprise Project Portfolio</h1>
          <p class="page-subtitle">
            Orchestrate strategic roadmaps, resource allocations, and cross-team delivery milestones
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="modalService.openProjectModal()"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>New Project</span>
          </button>
        </div>
      </header>

      <!-- Filter & Control Toolbar -->
      <section class="toolbar-card">
        <div class="search-input-box">
          <app-icon name="search" [size]="15" customClass="tb-search-icon"></app-icon>
          <input
            type="text"
            class="tb-input"
            placeholder="Search projects by name, key, tags, or team..."
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
            All ({{ dataService.projects().length }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'active'"
            (click)="selectedStatus = 'active'"
          >
            Active ({{ countByStatus('active') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'at_risk'"
            (click)="selectedStatus = 'at_risk'"
          >
            At Risk ({{ countByStatus('at_risk') }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedStatus === 'planning'"
            (click)="selectedStatus = 'planning'"
          >
            Planning ({{ countByStatus('planning') }})
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

        <!-- View Switcher & Sorting -->
        <div class="toolbar-right">
          <select class="orbit-select sort-select" [(ngModel)]="sortBy">
            <option value="deadline">Sort: Deadline</option>
            <option value="progress">Sort: Progress</option>
            <option value="health">Sort: Health Score</option>
            <option value="budget">Sort: Budget Size</option>
            <option value="name">Sort: Project Name</option>
          </select>

          <div class="view-mode-toggle">
            <button
              type="button"
              class="vm-btn"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'"
              title="Grid View"
            >
              <app-icon name="grid" [size]="15"></app-icon>
            </button>
            <button
              type="button"
              class="vm-btn"
              [class.active]="viewMode === 'table'"
              (click)="viewMode = 'table'"
              title="Table View"
            >
              <app-icon name="list" [size]="15"></app-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Content View: Grid Cards Mode -->
      <div *ngIf="viewMode === 'grid'" class="projects-grid">
        <div
          *ngFor="let p of filteredProjects()"
          class="project-card"
          [routerLink]="['/projects', p.id]"
        >
          <!-- Card Header -->
          <div class="card-head">
            <div class="card-key-row">
              <span class="proj-key-badge">{{ p.key }}</span>
              <app-badge
                [variant]="p.health === 'healthy' ? 'emerald' : p.health === 'needs_attention' ? 'amber' : 'crimson'"
                size="sm"
                [dot]="true"
              >
                {{ p.health === 'healthy' ? 'Nominal' : p.health === 'needs_attention' ? 'Watch' : 'At Risk' }} ({{ p.healthScore }}%)
              </app-badge>
            </div>
            <h3 class="card-name">{{ p.name }}</h3>
            <span class="card-team">{{ p.teamName }}</span>
          </div>

          <!-- Card Description -->
          <p class="card-desc">{{ p.description }}</p>

          <!-- Tags -->
          <div class="card-tags-row">
            <span *ngFor="let tag of p.tags.slice(0, 3)" class="tag-chip">{{ tag }}</span>
          </div>

          <!-- Progress Bar -->
          <div class="card-progress-section">
            <div class="prog-meta">
              <span>Overall Completion</span>
              <span class="prog-perc">{{ p.progress }}%</span>
            </div>
            <app-progress-bar [value]="p.progress" [height]="6"></app-progress-bar>
          </div>

          <!-- Card Metrics Grid -->
          <div class="card-metrics-row">
            <div class="c-metric">
              <span class="m-label">Budget (INR)</span>
              <span class="m-val">{{ formatBudget(p.budget.spent) }} / {{ formatBudget(p.budget.allocated) }}</span>
            </div>
            <div class="c-metric">
              <span class="m-label">Target Deadline</span>
              <span class="m-val">{{ p.deadline }}</span>
            </div>
          </div>

          <!-- Card Footer (Owner & Team) -->
          <div class="card-foot">
            <div class="owner-tile">
              <app-avatar [src]="p.ownerAvatar" [name]="p.ownerName" size="xs"></app-avatar>
              <span class="owner-name">{{ p.ownerName }}</span>
            </div>
            <div class="tasks-count-pill">
              <app-icon name="check-square" [size]="12"></app-icon>
              <span>{{ p.completedTasksCount }}/{{ p.tasksCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content View: Table Mode -->
      <div *ngIf="viewMode === 'table'" class="orbit-table-container">
        <table class="orbit-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Project Name</th>
              <th>Team</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Health</th>
              <th>Owner</th>
              <th>Budget</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let p of filteredProjects()"
              [routerLink]="['/projects', p.id]"
              class="clickable-tr"
            >
              <td>
                <span class="table-key">{{ p.key }}</span>
              </td>
              <td>
                <span class="table-proj-title">{{ p.name }}</span>
              </td>
              <td>
                <span class="table-team">{{ p.teamName }}</span>
              </td>
              <td>
                <app-badge [variant]="getStatusVariant(p.status)" size="sm">
                  {{ p.status | uppercase }}
                </app-badge>
              </td>
              <td>
                <app-badge [variant]="p.priority === 'critical' ? 'crimson' : p.priority === 'high' ? 'amber' : 'graphite'" size="sm">
                  {{ p.priority | uppercase }}
                </app-badge>
              </td>
              <td style="min-width: 140px;">
                <div class="table-prog-wrap">
                  <app-progress-bar [value]="p.progress" [height]="5"></app-progress-bar>
                  <span class="prog-txt">{{ p.progress }}%</span>
                </div>
              </td>
              <td>
                <app-badge
                  [variant]="p.health === 'healthy' ? 'emerald' : p.health === 'needs_attention' ? 'amber' : 'crimson'"
                  size="sm"
                  [dot]="true"
                >
                  {{ p.healthScore }}%
                </app-badge>
              </td>
              <td>
                <div class="table-owner">
                  <app-avatar [src]="p.ownerAvatar" [name]="p.ownerName" size="xs"></app-avatar>
                  <span>{{ p.ownerName }}</span>
                </div>
              </td>
              <td>
                <span class="table-budget">{{ formatBudget(p.budget.spent) }} / {{ formatBudget(p.budget.allocated) }}</span>
              </td>
              <td>
                <span class="table-date">{{ p.deadline }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <app-empty-state
        *ngIf="filteredProjects().length === 0"
        icon="folder"
        title="No matching projects found"
        description="Try adjusting your filter parameters or search keywords."
        actionLabel="Create New Project"
        actionIcon="plus"
        (action)="modalService.openProjectModal()"
      ></app-empty-state>
    </div>
  `,
  styles: [`
    .projects-viewport {
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

    .bc-sep {
      color: var(--border-strong);
    }

    .bc-active {
      color: var(--text-secondary);
      font-weight: 500;
    }

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

    /* Toolbar Card */
    .toolbar-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
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
      width: 280px;
      height: 34px;
      padding: 0 10px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
    }

    .tb-search-icon {
      color: var(--text-muted);
    }

    .tb-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 13px;
      color: var(--text-primary);
    }

    .tb-input::placeholder {
      color: var(--text-muted);
    }

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

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sort-select {
      height: 32px;
      font-size: 12px;
      width: 160px;
    }

    .view-mode-toggle {
      display: flex;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .vm-btn {
      width: 32px;
      height: 32px;
      background: var(--surface-secondary);
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .vm-btn:hover {
      color: var(--text-primary);
    }

    .vm-btn.active {
      background: var(--surface-tertiary);
      color: var(--accent-emerald);
    }

    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .project-card {
      background: var(--surface-primary);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 180ms ease,
                  border-color 180ms ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
      text-decoration: none;
      color: inherit;
    }

    .project-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
    }

    .card-head {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-key-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .proj-key-badge {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .card-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .card-team {
      font-size: 12px;
      color: var(--text-muted);
    }

    .card-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag-chip {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 7px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      color: var(--text-muted);
    }

    .card-progress-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .prog-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .prog-perc {
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-metrics-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 10px 12px;
      background: var(--surface-secondary);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    .c-metric {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .m-label {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .m-val {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 12px;
      margin-top: auto;
    }

    .owner-tile {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .owner-name {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .tasks-count-pill {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Table Styles */
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

    .table-team {
      font-size: 12px;
      color: var(--text-muted);
    }

    .table-prog-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .prog-txt {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .table-owner {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      font-size: 12px;
    }

    .table-budget {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .table-date {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
    }
  `]
})
export class ProjectsComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);

  public searchQuery = '';
  public selectedStatus: string = 'all';
  public sortBy = 'deadline';
  public viewMode: 'grid' | 'table' = 'grid';

  countByStatus(status: ProjectStatus): number {
    return this.dataService.projects().filter(p => p.status === status).length;
  }

  public filteredProjects = computed(() => {
    let list = this.dataService.projects();

    // Status filter
    if (this.selectedStatus !== 'all') {
      list = list.filter(p => p.status === this.selectedStatus);
    }

    // Search query
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.teamName.toLowerCase().includes(q) ||
          p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'health':
          return b.healthScore - a.healthScore;
        case 'budget':
          return b.budget.allocated - a.budget.allocated;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'deadline':
        default:
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });
  });

  getStatusVariant(status: ProjectStatus): 'emerald' | 'amber' | 'crimson' | 'purple' | 'graphite' {
    switch (status) {
      case 'active':
        return 'emerald';
      case 'at_risk':
        return 'crimson';
      case 'on_hold':
        return 'amber';
      case 'completed':
        return 'emerald';
      case 'planning':
        return 'purple';
      default:
        return 'graphite';
    }
  }

  formatBudget(amount: number): string {
    return formatINR(amount, { compact: true });
  }
}

