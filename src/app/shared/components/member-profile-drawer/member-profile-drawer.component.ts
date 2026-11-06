import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ModalService } from '../../../core/services/modal.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-member-profile-drawer',
  standalone: true,
  imports: [CommonModule, IconComponent, AvatarComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div
      *ngIf="modalService.isMemberDrawerOpen() && modalService.selectedMember() as member"
      class="member-drawer-wrapper"
    >
      <div class="orbit-drawer-backdrop" (click)="close()"></div>
      <aside class="orbit-drawer">
        <div class="drawer-header">
          <span class="header-label">Team Member Profile</span>
          <button type="button" class="close-btn" (click)="close()">
            <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>

        <div class="drawer-scrollable">
          <!-- Member Hero Card -->
          <div class="profile-hero">
            <app-avatar
              [src]="member.avatar"
              [name]="member.name"
              [status]="member.status"
              size="xl"
            ></app-avatar>
            <div class="hero-info">
              <h2 class="hero-name">{{ member.name }}</h2>
              <span class="hero-role">{{ member.roleTitle }}</span>
              <span class="hero-dept">{{ member.department }}</span>
              <div class="status-chip-row">
                <app-badge variant="emerald" size="sm" [dot]="true">
                  {{ member.status | uppercase }}
                </app-badge>
                <span class="status-msg" *ngIf="member.statusMessage">"{{ member.statusMessage }}"</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="quick-action-row">
            <button
              type="button"
              class="orbit-btn btn-secondary-dm flex-1"
              (click)="openChatWithMember(member)"
              aria-label="Direct message team member"
            >
              <app-icon name="message-square" [size]="14"></app-icon>
              <span>Direct Message</span>
            </button>
            <button
              type="button"
              class="orbit-btn orbit-btn-secondary"
              (click)="copyEmail(member.email)"
              aria-label="Copy team member email"
            >
              <app-icon name="send" [size]="14"></app-icon>
              <span>Copy Email</span>
            </button>
          </div>

          <!-- Workload & Capacity Meter -->
          <div class="profile-section card-box">
            <div class="section-head-split">
              <span class="box-title">Workload & Capacity</span>
              <span class="box-val" [class.overloaded]="member.workloadPercentage > 90">
                {{ member.workloadPercentage }}% Utilized
              </span>
            </div>
            <app-progress-bar
              [value]="member.workloadPercentage"
              [height]="6"
              [variant]="member.workloadPercentage > 90 ? 'crimson' : member.workloadPercentage > 75 ? 'amber' : 'emerald'"
            ></app-progress-bar>
            <span class="capacity-hint" *ngIf="member.workloadPercentage > 90">
              ⚠️ Workload warning: Member is allocated above standard 40h sprint capacity.
            </span>
          </div>

          <!-- Contact & Org Details Grid -->
          <div class="profile-section card-box">
            <span class="box-title">Contact & Location</span>
            <div class="details-grid">
              <div class="detail-row">
                <span class="d-label">Email:</span>
                <span class="d-val">{{ member.email }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Location:</span>
                <span class="d-val">{{ member.location }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Timezone:</span>
                <span class="d-val">{{ member.timezone }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Tenure:</span>
                <span class="d-val">Since {{ member.joinedDate | slice:0:7 }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Last Active:</span>
                <span class="d-val">{{ member.lastActive }}</span>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="profile-section card-box" *ngIf="member.bio">
            <span class="box-title">Professional Bio</span>
            <p class="bio-text">{{ member.bio }}</p>
          </div>

          <!-- Skills & Domains -->
          <div class="profile-section card-box">
            <span class="box-title">Core Competencies & Skills</span>
            <div class="skills-wrap">
              <span *ngFor="let s of member.skills" class="skill-tag">
                <span class="s-name">{{ s.name }}</span>
                <span class="s-level">{{ s.level }}</span>
              </span>
            </div>
          </div>

          <!-- Productivity Stats -->
          <div class="stats-3-col">
            <div class="stat-cell">
              <span class="s-num">{{ member.activeProjectsCount }}</span>
              <span class="s-txt">Active Projects</span>
            </div>
            <div class="stat-cell">
              <span class="s-num">{{ member.openTasksCount }}</span>
              <span class="s-txt">Open Tasks</span>
            </div>
            <div class="stat-cell">
              <span class="s-num">{{ member.completedTasksCount }}</span>
              <span class="s-txt">Completed</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .member-drawer-wrapper {
      position: relative;
      z-index: 1050;
    }
    .drawer-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }
    .header-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }
    .close-btn:hover {
      color: var(--text-primary);
    }
    .drawer-scrollable {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .profile-hero {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .profile-hero app-avatar {
      border: 1px solid #3F3F46;
      border-radius: 9999px;
      padding: 2px;
    }
    .hero-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .hero-name {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .hero-role {
      font-size: 13px;
      font-weight: 500;
      color: var(--accent-emerald);
      margin-top: 2px;
    }
    .hero-dept {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .status-chip-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .status-msg {
      font-size: 11px;
      color: var(--text-muted);
      font-style: italic;
    }
    .quick-action-row {
      display: flex;
      gap: 10px;
    }
    .flex-1 { flex: 1; }
    .btn-secondary-dm {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34D399;
      font-weight: 500;
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
    }
    .btn-secondary-dm:hover {
      background: rgba(16, 185, 129, 0.18);
      border-color: rgba(16, 185, 129, 0.5);
      color: #6EE7B7;
      transform: translateY(-1px);
    }
    .card-box {
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .section-head-split {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .box-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .box-val {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .box-val.overloaded {
      color: var(--accent-crimson);
    }
    .capacity-hint {
      font-size: 11px;
      color: var(--accent-amber);
      margin-top: 2px;
    }
    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    .d-label {
      color: var(--text-muted);
    }
    .d-val {
      color: var(--text-primary);
      font-weight: 500;
    }
    .bio-text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      font-size: 11px;
    }
    .s-name {
      color: var(--text-primary);
      font-weight: 500;
    }
    .s-level {
      color: var(--text-muted);
      font-size: 9px;
      text-transform: uppercase;
    }
    .stats-3-col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .stat-cell {
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .s-num {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .s-txt {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class MemberProfileDrawerComponent {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);
  public router = inject(Router);

  close(): void {
    this.modalService.closeMemberDrawer();
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email);
    this.notifService.success('Email Copied', email);
  }

  openChatWithMember(member: User): void {
    this.close();
    this.router.navigateByUrl('/chat');
    this.notifService.info('Chat Workspace', `Started direct message with ${member.name}`);
  }
}

