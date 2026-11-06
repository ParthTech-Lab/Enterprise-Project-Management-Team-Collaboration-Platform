import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
      class="sparkline-svg"
    >
      <defs>
        <linearGradient [id]="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" [attr.stop-color]="strokeColor" stop-opacity="0.25"/>
          <stop offset="100%" [attr.stop-color]="strokeColor" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <polygon
        *ngIf="fillPath"
        [attr.points]="fillPath"
        [attr.fill]="'url(#' + gradientId + ')'"
      />
      <polyline
        [attr.points]="linePath"
        fill="none"
        [attr.stroke]="strokeColor"
        [attr.stroke-width]="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      line-height: 0;
    }
    .sparkline-svg {
      overflow: visible;
    }
  `]
})
export class SparklineComponent {
  @Input() data: number[] = [12, 18, 14, 25, 22, 30, 28, 35, 42];
  @Input() width: number = 80;
  @Input() height: number = 24;
  @Input() strokeColor: string = '#10B981'; // Emerald
  @Input() strokeWidth: number = 2;

  public gradientId = 'spark_grad_' + Math.random().toString(36).substring(2, 8);

  get linePath(): string {
    if (!this.data || this.data.length < 2) return '';
    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;
    const padding = 2;
    const effectiveHeight = this.height - padding * 2;
    const stepX = (this.width - padding * 2) / (this.data.length - 1);

    return this.data
      .map((val, idx) => {
        const x = padding + idx * stepX;
        const y = padding + effectiveHeight - ((val - min) / range) * effectiveHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  get fillPath(): string {
    const line = this.linePath;
    if (!line) return '';
    const padding = 2;
    const lastX = this.width - padding;
    const firstX = padding;
    const bottomY = this.height;
    return `${firstX},${bottomY} ${line} ${lastX},${bottomY}`;
  }
}

