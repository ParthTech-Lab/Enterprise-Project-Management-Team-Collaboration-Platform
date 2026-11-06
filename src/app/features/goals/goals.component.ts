import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Goal } from '../../core/models/goal.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="goals-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Workspace</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Strategic Goals & OKRs</span>
          </div>
          <h1 class="page-title">Enterprise Goals & Objectives (OKRs)</h1>
          <p class="page-subtitle">
            Company-wide Q4 strategic targets, quantitative key results, and cross-team alignment
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="notifService.info('New Strategic Objective', 'Goal authoring dialog')"
            aria-label="Define new OKR"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Define OKR</span>
          </button>
        </div>
      </header>

      <!-- Goals Cards List -->
      <div class="goals-list">
        <div *ngFor="let g of dataService.goals()" class="goal-card">
          <div class="goal-card-header">
            <div class="g-header-left">
              <div class="g-type-row">
                <app-badge [variant]="g.type === 'company' ? 'emerald' : 'purple'" size="sm">
                  {{ g.type | uppercase }} OKR
                </app-badge>
                <span class="target-quarter-tag">{{ g.targetQuarter }}</span>
                <app-badge
                  [variant]="g.status === 'on_track' ? 'emerald' : g.status === 'behind' ? 'amber' : 'crimson'"
                  size="sm"
                  [dot]="true"
                >
                  {{ g.status | uppercase }}
                </app-badge>
              </div>
              <h2 class="g-title">{{ g.title }}</h2>
              <p class="g-desc">{{ g.description }}</p>
            </div>

            <div class="g-header-right">
              <div class="overall-progress-box">
                <div class="prog-digits">{{ g.progress }}%</div>
                <span class="prog-lbl">Target Pacing</span>
              </div>
            </div>
          </div>

          <!-- Progress Bar (Standardized 6px height with animated fill) -->
          <div class="goal-bar-wrap">
            <app-progress-bar [value]="g.progress" [height]="6"></app-progress-bar>
          </div>

          <!-- Key Results Breakdown List -->
          <div class="key-results-section">
            <h3 class="kr-heading">QUANTITATIVE KEY RESULTS (KR)</h3>
            <div class="kr-grid">
              <div *ngFor="let kr of g.keyResults" class="kr-item">
                <div class="kr-top">
                  <span class="kr-title">{{ kr.title }}</span>
                  <span class="kr-val">{{ kr.currentValue }} / {{ kr.targetValue }} {{ kr.unit }}</span>
                </div>
                <app-progress-bar
                  [value]="(kr.currentValue / kr.targetValue) * 100"
                  [height]="6"
                  [variant]="kr.status === 'completed' ? 'emerald' : kr.status === 'on_track' ? 'emerald' : 'amber'"
                ></app-progress-bar>
              </div>
            </div>
          </div>

          <!-- Goal Footer: Owner & Clearly Readable Deadline -->
          <div class="goal-card-footer">
            <div class="g-owner">
              <app-avatar [src]="g.ownerAvatar" [name]="g.ownerName" size="xs"></app-avatar>
              <span>Champion: {{ g.ownerName }}</span>
            </div>
            <div class="g-deadline">
              <app-icon name="calendar" [size]="13" customClass="deadline-icon"></app-icon>
              <span>Deadline: {{ g.deadline }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .goals-viewport {
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
      }
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

    .goals-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .goal-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
      transition: border-color 180ms ease, box-shadow 180ms ease;
    }

    .goal-card:hover {
      border-color: rgba(16, 185, 129, 0.25);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
    }

    .goal-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
    }

    @media (max-width: 768px) {
      .goal-card-header {
        flex-direction: column;
      }
    }

    .g-header-left {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .g-type-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .target-quarter-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      padding: 2px 7px;
      border-radius: 4px;
    }

    .g-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.35;
    }

    .g-desc {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .overall-progress-box {
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px 18px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 95px;
    }

    .prog-digits {
      font-size: 22px;
      font-weight: 700;
      color: var(--accent-emerald);
      line-height: 1;
    }

    .prog-lbl {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 4px;
    }

    .goal-bar-wrap {
      width: 100%;
    }

    .key-results-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
    }

    .kr-heading {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-secondary);
    }

    .kr-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .kr-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .kr-top {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
    }

    .kr-title {
      color: var(--text-primary);
      font-weight: 500;
    }

    .kr-val {
      font-weight: 600;
      color: var(--accent-emerald);
    }

    .goal-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 14px;
    }

    .g-owner {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Deadline Visibility (High Contrast WCAG AA #A1A1AA / #D4D4D8) */
    .g-deadline {
      font-size: 12px;
      font-weight: 500;
      color: #D4D4D8;
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--surface-secondary);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    .deadline-icon {
      color: var(--text-muted);
    }
  `]
})
export class GoalsComponent {
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);
}
