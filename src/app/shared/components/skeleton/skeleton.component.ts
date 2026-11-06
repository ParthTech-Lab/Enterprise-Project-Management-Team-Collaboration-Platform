import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton-item skeleton-shimmer"
      [style.width]="width"
      [style.height]="height"
      [style.border-radius]="radius"
      [class.circle]="variant === 'circle'"
      [class.card]="variant === 'card'"
    ></div>
  `,
  styles: [`
    .skeleton-item {
      display: inline-block;
      position: relative;
      overflow: hidden;
    }
    .circle {
      border-radius: 9999px !important;
    }
    .card {
      border-radius: var(--radius-lg) !important;
      border: 1px solid var(--border-subtle);
    }
  `]
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '16px';
  @Input() radius: string = '6px';
  @Input() variant: 'text' | 'circle' | 'card' = 'text';
}

