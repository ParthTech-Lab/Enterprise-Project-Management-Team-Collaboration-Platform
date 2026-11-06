import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge-pill variant-' + variant + ' size-' + size + (dot ? ' has-dot' : '')">
      <span *ngIf="dot" class="badge-dot"></span>
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-weight: 500;
      border-radius: 9999px;
      letter-spacing: -0.01em;
      white-space: nowrap;
      transition: all 0.15s ease;
      line-height: 1;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background-color: currentColor;
    }
    .size-sm {
      padding: 3px 8px;
      font-size: 11px;
    }
    .size-md {
      padding: 5px 10px;
      font-size: 12px;
    }

    /* WCAG AA High Contrast Badges (Strictly No Blue) */
    .variant-emerald {
      background: rgba(16, 185, 129, 0.12);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.28);
    }
    .variant-amber {
      background: rgba(245, 158, 11, 0.12);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.28);
    }
    .variant-crimson {
      background: rgba(239, 68, 68, 0.12);
      color: #F87171;
      border: 1px solid rgba(239, 68, 68, 0.28);
    }
    .variant-purple {
      background: rgba(139, 92, 246, 0.12);
      color: #C4B5FD;
      border: 1px solid rgba(139, 92, 246, 0.28);
    }
    .variant-graphite {
      background: #27272A;
      color: #D4D4D8;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .variant-gold {
      background: rgba(234, 179, 8, 0.12);
      color: #FACC15;
      border: 1px solid rgba(234, 179, 8, 0.28);
    }
    .variant-neutral {
      background: rgba(255, 255, 255, 0.06);
      color: #F4F4F5;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
  `]
})
export class BadgeComponent {
  @Input() variant: 'emerald' | 'amber' | 'crimson' | 'purple' | 'graphite' | 'gold' | 'neutral' = 'graphite';
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() dot: boolean = false;
}
