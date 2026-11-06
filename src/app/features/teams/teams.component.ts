import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { Team } from '../../core/models/team.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="teams-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Collaboration</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Teams</span>
          </div>
          <h1 class="page-title">Enterprise Engineering & Product Teams</h1>
          <p class="page-subtitle">
            8 autonomous multidisciplinary teams driving core architecture, design systems, and compliance
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="notifService.info('Team Provisioning', 'Team creation dialog is available for Organization Admins')"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Create Team</span>
          </button>
        </div>
      </header>

      <!-- Department Filter Pills -->
      <section class="dept-filter-bar">
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'all'"
          (click)="selectedDept = 'all'"
        >
          All Teams ({{ dataService.teams().length }})
        </button>
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'Engineering'"
          (click)="selectedDept = 'Engineering'"
        >
          Engineering (2)
        </button>
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'Infrastructure'"
          (click)="selectedDept = 'Infrastructure'"
        >
          Infrastructure (1)
        </button>
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'Product & Design'"
          (click)="selectedDept = 'Product & Design'"
        >
          Product & Design (1)
        </button>
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'Data & Analytics'"
          (click)="selectedDept = 'Data & Analytics'"
        >
          Data & AI (1)
        </button>
        <button
          type="button"
          class="dept-pill"
          [class.active]="selectedDept === 'Security & Legal'"
          (click)="selectedDept = 'Security & Legal'"
        >
          Security & Trust (1)
        </button>
      </section>

      <!-- Teams Grid Cards -->
      <div class="teams-grid">
        <div
          *ngFor="let team of filteredTeams()"
          class="team-card"
          (click)="selectedTeam.set(team)"
        >
          <div class="team-card-top">
            <div class="code-indicator-pill" [style.border-color]="team.color">
              <span class="code-text" [style.color]="team.color">{{ team.code }}</span>
            </div>
            <app-badge variant="graphite" size="sm">{{ team.department }}</app-badge>
          </div>

          <h3 class="team-name">{{ team.name }}</h3>
          <p class="team-desc">{{ team.description }}</p>

          <!-- Team Lead -->
          <div class="lead-row">
            <span class="sub-label">TEAM LEAD:</span>
            <div class="lead-pill">
              <app-avatar [src]="team.leadAvatar" [name]="team.leadName" size="xs"></app-avatar>
              <span class="lead-name">{{ team.leadName }}</span>
            </div>
          </div>

          <!-- Members Avatar Stack -->
          <div class="members-stack-row">
            <div class="avatar-stack">
              <app-avatar
                *ngFor="let u of getTeamMembers(team.memberIds).slice(0, 4)"
                [src]="u.avatar"
                [name]="u.name"
                size="sm"
                class="stacked-avatar"
              ></app-avatar>
              <div *ngIf="team.memberIds.length > 4" class="extra-count-circle">
                +{{ team.memberIds.length - 4 }}
              </div>
            </div>
            <span class="member-count-label">{{ team.memberIds.length }} Engineers & Specialists</span>
          </div>

          <!-- Workload & Productivity -->
          <div class="team-metrics-box">
            <div class="t-metric-col">
              <div class="metric-top-label">
                <span>Avg Workload</span>
                <span [class.overload]="team.averageWorkload > 85">{{ team.averageWorkload }}%</span>
              </div>
              <app-progress-bar
                [value]="team.averageWorkload"
                [height]="4"
                [variant]="team.averageWorkload > 85 ? 'crimson' : team.averageWorkload > 75 ? 'amber' : 'emerald'"
              ></app-progress-bar>
            </div>

            <div class="t-metric-col">
              <div class="metric-top-label">
                <span>Productivity</span>
                <span class="prod-val">{{ team.productivityScore }}%</span>
              </div>
              <app-progress-bar [value]="team.productivityScore" [height]="4" variant="emerald"></app-progress-bar>
            </div>
          </div>

          <!-- Tags -->
          <div class="team-tags-row">
            <span *ngFor="let tag of team.tags" class="t-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teams-viewport {
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

    .dept-filter-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .dept-pill {
      height: 30px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 9999px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dept-pill:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }
    .dept-pill.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .team-card {
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
      position: relative;
    }

    .team-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
    }

    .team-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .code-indicator-pill {
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
    }

    .code-text {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .team-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .team-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .lead-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sub-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .lead-pill {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .lead-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .members-stack-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .avatar-stack {
      display: flex;
      align-items: center;
    }

    .stacked-avatar {
      margin-left: -8px;
    }
    .stacked-avatar:first-child {
      margin-left: 0;
    }

    .extra-count-circle {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-strong);
      color: var(--text-secondary);
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -8px;
    }

    .member-count-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .team-metrics-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .t-metric-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-top-label {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .overload { color: var(--accent-crimson); font-weight: 700; }
    .prod-val { color: var(--accent-emerald); font-weight: 700; }

    .team-tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: auto;
    }

    .t-tag {
      font-size: 11px;
      font-weight: 500;
      color: #D4D4D8;
      background: #27272A;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 150ms ease;
    }

    .t-tag:hover {
      border-color: rgba(16, 185, 129, 0.4);
      color: #F4F4F5;
    }
  `]
})
export class TeamsComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public selectedDept = 'all';
  public selectedTeam = signal<Team | null>(null);

  public filteredTeams = computed(() => {
    let list = this.dataService.teams();
    if (this.selectedDept !== 'all') {
      list = list.filter(t => t.department === this.selectedDept);
    }
    return list;
  });

  getTeamMembers(memberIds: string[]): User[] {
    return this.dataService.users().filter(u => memberIds.includes(u.id));
  }
}

