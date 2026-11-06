import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="'orbit-icon ' + customClass"
      [ngSwitch]="name"
    >
      <!-- Dashboard -->
      <ng-container *ngSwitchCase="'dashboard'">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </ng-container>

      <!-- Projects / Folder -->
      <ng-container *ngSwitchCase="'folder'">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
      </ng-container>

      <!-- Tasks / CheckSquare -->
      <ng-container *ngSwitchCase="'check-square'">
        <path d="m9 11 3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </ng-container>

      <!-- Calendar -->
      <ng-container *ngSwitchCase="'calendar'">
        <path d="M8 2v4"/><path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
      </ng-container>

      <!-- Timeline / Gantt -->
      <ng-container *ngSwitchCase="'timeline'">
        <path d="M3 5v14"/><path d="M21 19H3"/>
        <rect x="7" y="6" width="6" height="3" rx="1"/>
        <rect x="11" y="11" width="8" height="3" rx="1"/>
      </ng-container>

      <!-- Kanban -->
      <ng-container *ngSwitchCase="'kanban'">
        <path d="M6 5v11"/><path d="M12 5v6"/><path d="M18 5v14"/>
        <rect width="18" height="18" x="3" y="3" rx="2"/>
      </ng-container>

      <!-- Clock / Time -->
      <ng-container *ngSwitchCase="'clock'">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </ng-container>

      <!-- Users / Team -->
      <ng-container *ngSwitchCase="'users'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </ng-container>

      <!-- User -->
      <ng-container *ngSwitchCase="'user'">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </ng-container>

      <!-- Chat / MessageSquare -->
      <ng-container *ngSwitchCase="'message-square'">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </ng-container>

      <!-- Documents / FileText -->
      <ng-container *ngSwitchCase="'file-text'">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
      </ng-container>

      <!-- BarChart / Reports -->
      <ng-container *ngSwitchCase="'bar-chart'">
        <line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>
      </ng-container>

      <!-- Analytics / TrendingUp -->
      <ng-container *ngSwitchCase="'trending-up'">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </ng-container>

      <!-- Activity -->
      <ng-container *ngSwitchCase="'activity'">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </ng-container>

      <!-- Zap / Quick -->
      <ng-container *ngSwitchCase="'zap'">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </ng-container>

      <!-- Sliders / Controls -->
      <ng-container *ngSwitchCase="'sliders'">
        <line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>
      </ng-container>

      <!-- Shield / Security -->
      <ng-container *ngSwitchCase="'shield'">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </ng-container>

      <!-- Bell / Notifications -->
      <ng-container *ngSwitchCase="'bell'">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </ng-container>

      <!-- Search -->
      <ng-container *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </ng-container>

      <!-- Plus -->
      <ng-container *ngSwitchCase="'plus'">
        <path d="M5 12h14"/><path d="M12 5v14"/>
      </ng-container>

      <!-- Chevron Down -->
      <ng-container *ngSwitchCase="'chevron-down'">
        <path d="m6 9 6 6 6-6"/>
      </ng-container>

      <!-- Chevron Up -->
      <ng-container *ngSwitchCase="'chevron-up'">
        <path d="m18 15-6-6-6 6"/>
      </ng-container>

      <!-- Chevron Right -->
      <ng-container *ngSwitchCase="'chevron-right'">
        <path d="m9 18 6-6-6-6"/>
      </ng-container>

      <!-- Chevron Left -->
      <ng-container *ngSwitchCase="'chevron-left'">
        <path d="m15 18-6-6 6-6"/>
      </ng-container>

      <!-- Check -->
      <ng-container *ngSwitchCase="'check'">
        <path d="M20 6 9 17l-5-5"/>
      </ng-container>

      <!-- X -->
      <ng-container *ngSwitchCase="'x'">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </ng-container>

      <!-- Filter -->
      <ng-container *ngSwitchCase="'filter'">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </ng-container>

      <!-- Download -->
      <ng-container *ngSwitchCase="'download'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
      </ng-container>

      <!-- Settings -->
      <ng-container *ngSwitchCase="'settings'">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </ng-container>

      <!-- Target / Goals -->
      <ng-container *ngSwitchCase="'target'">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </ng-container>

      <!-- AlertCircle -->
      <ng-container *ngSwitchCase="'alert-circle'">
        <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
      </ng-container>

      <!-- AlertTriangle -->
      <ng-container *ngSwitchCase="'alert-triangle'">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
      </ng-container>

      <!-- Play -->
      <ng-container *ngSwitchCase="'play'">
        <polygon points="6 3 20 12 6 21 6 3"/>
      </ng-container>

      <!-- Pause -->
      <ng-container *ngSwitchCase="'pause'">
        <rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>
      </ng-container>

      <!-- RefreshCw -->
      <ng-container *ngSwitchCase="'refresh-cw'">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
      </ng-container>

      <!-- Eye -->
      <ng-container *ngSwitchCase="'eye'">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
      </ng-container>

      <!-- Trash2 -->
      <ng-container *ngSwitchCase="'trash-2'">
        <path d="3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
      </ng-container>

      <!-- Edit2 -->
      <ng-container *ngSwitchCase="'edit-2'">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      </ng-container>

      <!-- Paperclip -->
      <ng-container *ngSwitchCase="'paperclip'">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </ng-container>

      <!-- Send -->
      <ng-container *ngSwitchCase="'send'">
        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
      </ng-container>

      <!-- Sun -->
      <ng-container *ngSwitchCase="'sun'">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
      </ng-container>

      <!-- Moon -->
      <ng-container *ngSwitchCase="'moon'">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </ng-container>

      <!-- Layers / Resources -->
      <ng-container *ngSwitchCase="'layers'">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </ng-container>

      <!-- Grid -->
      <ng-container *ngSwitchCase="'grid'">
        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
      </ng-container>

      <!-- List -->
      <ng-container *ngSwitchCase="'list'">
        <line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>
      </ng-container>

      <!-- More Vertical -->
      <ng-container *ngSwitchCase="'more-vertical'">
        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
      </ng-container>

      <!-- More Horizontal -->
      <ng-container *ngSwitchCase="'more-horizontal'">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </ng-container>

      <!-- Database -->
      <ng-container *ngSwitchCase="'database'">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
      </ng-container>

      <!-- Server -->
      <ng-container *ngSwitchCase="'server'">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>
      </ng-container>

      <!-- Lock -->
      <ng-container *ngSwitchCase="'lock'">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </ng-container>

      <!-- CreditCard / Billing -->
      <ng-container *ngSwitchCase="'credit-card'">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
      </ng-container>

      <!-- Pin -->
      <ng-container *ngSwitchCase="'pin'">
        <line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7.55l-1.78.89A2 2 0 0 0 5 15.24Z"/>
      </ng-container>

      <!-- Default Fallback Circle -->
      <ng-container *ngSwitchDefault>
        <circle cx="12" cy="12" r="9"/>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
    .orbit-icon {
      flex-shrink: 0;
      transition: stroke 0.15s ease, transform 0.15s ease;
    }
  `]
})
export class IconComponent {
  @Input() name: string = 'dashboard';
  @Input() size: number = 18;
  @Input() strokeWidth: number = 2;
  @Input() customClass: string = '';
}

