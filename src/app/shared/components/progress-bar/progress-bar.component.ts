import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="progress-track"
      [style.height.px]="height"
      role="progressbar"
      [attr.aria-valuenow]="clampedValue"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="progress-fill"
        [ngClass]="'fill-' + getVariant()"
        [style.width.%]="clampedValue"
      ></div>
    </div>
  `,
  styles: [`
    .progress-track {
      width: 100%;
      background-color: #27272A;
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 800ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .fill-emerald {
      background-color: #059669;
    }
    .fill-amber {
      background-color: #F59E0B;
    }
    .fill-crimson {
      background-color: #EF4444;
    }
    .fill-purple {
      background-color: #8B5CF6;
    }
  `]
})
export class ProgressBarComponent {
  @Input() value: number = 0;
  @Input() height: number = 6;
  @Input() variant?: 'emerald' | 'amber' | 'crimson' | 'purple';

  get clampedValue(): number {
    return Math.min(100, Math.max(0, this.value));
  }

  getVariant(): string {
    if (this.variant) return this.variant;
    if (this.clampedValue >= 75) return 'emerald';
    if (this.clampedValue >= 40) return 'amber';
    return 'crimson';
  }
}
