import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, IconComponent, AvatarComponent],
  template: `
    <div class="activity-viewport">
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Collaboration</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Activity Stream</span>
          </div>
          <h1 class="page-title">Enterprise Activity Audit Ledger</h1>
          <p class="page-subtitle">
            Comprehensive real-time telemetry of commits, deploys, task handoffs, and status changes
          </p>
        </div>
      </header>

      <div class="orbit-card">
        <div class="orbit-card-body p-0">
          <div class="activity-timeline">
            <div *ngFor="let act of dataService.activities()" class="timeline-item">
              <div class="tl-left">
                <app-avatar [src]="act.actorAvatar" [name]="act.actorName" size="sm"></app-avatar>
                <div class="tl-line"></div>
              </div>
              <div class="tl-content">
                <div class="tl-header">
                  <span class="tl-actor">{{ act.actorName }}</span>
                  <span class="tl-action">{{ act.action }}</span>
                  <span class="tl-target">{{ act.targetTitle }}</span>
                  <span class="tl-time">{{ act.timestamp | slice:11:16 }} IST</span>
                </div>
                <div class="tl-details" *ngIf="act.details">
                  {{ act.details }}
                </div>
                <div class="tl-project-tag" *ngIf="act.projectName">
                  <app-icon name="folder" [size]="12"></app-icon>
                  <span>{{ act.projectName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
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
    }

    .p-0 { padding: 0; }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      padding: 24px;
    }

    .timeline-item {
      display: flex;
      gap: 16px;
      position: relative;
    }

    .tl-left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .tl-line {
      width: 2px;
      flex: 1;
      background: var(--border-subtle);
      margin: 6px 0;
      min-height: 24px;
    }

    .timeline-item:last-child .tl-line {
      display: none;
    }

    .tl-content {
      flex: 1;
      padding-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tl-header {
      font-size: 13px;
      color: var(--text-primary);
    }

    .tl-actor {
      font-weight: 700;
      color: var(--text-primary);
    }

    .tl-action {
      color: var(--text-muted);
      margin: 0 4px;
    }

    .tl-target {
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .tl-time {
      font-size: 11px;
      color: var(--text-muted);
      margin-left: 8px;
    }

    .tl-details {
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      line-height: 1.45;
    }

    .tl-project-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class ActivityComponent {
  public dataService = inject(DataService);
}

