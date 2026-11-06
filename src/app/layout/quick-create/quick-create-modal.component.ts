import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ModalService } from '../../core/services/modal.service';
import { TimerService } from '../../core/services/timer.service';
import { NotificationService } from '../../core/services/notification.service';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

@Component({
  selector: 'app-quick-create-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      *ngIf="modalService.isQuickCreateOpen()"
      class="quick-create-backdrop"
      (click)="close()"
    >
      <div class="quick-create-card" (click)="$event.stopPropagation()">
        <div class="quick-header">
          <div class="quick-title-wrap">
            <span class="quick-title">Quick Action Hub</span>
            <span class="quick-sub">Create records and launch workflows immediately</span>
          </div>
          <button type="button" class="quick-close-btn" (click)="close()">
            <app-icon name="x" [size]="16"></app-icon>
          </button>
        </div>

        <div class="quick-grid">
          <div
            *ngFor="let opt of options"
            class="quick-option"
            (click)="selectOption(opt)"
          >
            <div class="opt-icon" [style.background-color]="opt.color + '20'" [style.color]="opt.color">
              <app-icon [name]="opt.icon" [size]="18"></app-icon>
            </div>
            <div class="opt-info">
              <span class="opt-title">{{ opt.title }}</span>
              <span class="opt-desc">{{ opt.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-create-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1150;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.15s ease forwards;
    }

    .quick-create-card {
      width: 100%;
      max-width: 540px;
      background: var(--surface-primary);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-modal);
      overflow: hidden;
      animation: zoomIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .quick-header {
      padding: 18px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .quick-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      display: block;
    }

    .quick-sub {
      font-size: 12px;
      color: var(--text-muted);
    }

    .quick-close-btn {
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

    .quick-close-btn:hover {
      color: var(--text-primary);
    }

    .quick-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 20px;
    }

    @media (max-width: 600px) {
      .quick-grid {
        grid-template-columns: 1fr;
      }
    }

    .quick-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      border-radius: var(--radius-md);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .quick-option:hover {
      background: var(--surface-tertiary);
      border-color: var(--border-default);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .opt-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .opt-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .opt-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .opt-desc {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.3;
    }
  `]
})
export class QuickCreateModalComponent {
  public modalService = inject(ModalService);
  public timerService = inject(TimerService);
  public notifService = inject(NotificationService);
  public router = inject(Router);

  public options: QuickOption[] = [
    {
      id: 'opt-task',
      title: 'New Task',
      description: 'Create ticket with status, priority and assignee',
      icon: 'check-square',
      color: '#10B981',
      action: () => {
        this.close();
        this.modalService.openTaskModal();
      }
    },
    {
      id: 'opt-project',
      title: 'New Project',
      description: 'Initialize multi-milestone enterprise project',
      icon: 'folder',
      color: '#F59E0B',
      action: () => {
        this.close();
        this.modalService.openProjectModal();
      }
    },
    {
      id: 'opt-event',
      title: 'New Event / Meeting',
      description: 'Schedule architecture review or deadline',
      icon: 'calendar',
      color: '#8B5CF6',
      action: () => {
        this.close();
        this.modalService.openEventModal();
      }
    },
    {
      id: 'opt-timer',
      title: 'Start Live Timer',
      description: 'Track billable engineering or design time',
      icon: 'clock',
      color: '#10B981',
      action: () => {
        this.close();
        this.timerService.start();
        this.notifService.success('Timer Started', 'Tracking active work on ORB-101');
      }
    },
    {
      id: 'opt-document',
      title: 'New Document / RFC',
      description: 'Draft technical spec, architectural blueprint or note',
      icon: 'file-text',
      color: '#EAB308',
      action: () => {
        this.close();
        this.router.navigateByUrl('/documents');
        this.notifService.info('Documents Workspace', 'Ready to author technical documents');
      }
    },
    {
      id: 'opt-goal',
      title: 'New Goal & OKR',
      description: 'Define company or team strategic objective',
      icon: 'target',
      color: '#EA580C',
      action: () => {
        this.close();
        this.router.navigateByUrl('/goals');
        this.notifService.info('Goals & Milestones', 'Manage Q4 Objectives and Key Results');
      }
    }
  ];

  close(): void {
    this.modalService.closeQuickCreate();
  }

  selectOption(opt: QuickOption): void {
    opt.action();
  }
}

