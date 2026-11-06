import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  public isRunning = signal<boolean>(false);
  public elapsedSeconds = signal<number>(0);
  public activeProject = signal<string>('ORB-101 Core Infrastructure Migration');
  public activeTask = signal<string>('Design multi-region failover architecture');
  
  private intervalId: any = null;

  public formattedTime = computed(() => {
    const total = this.elapsedSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  public start(project?: string, task?: string): void {
    if (project) this.activeProject.set(project);
    if (task) this.activeTask.set(task);

    if (this.isRunning()) return;
    this.isRunning.set(true);

    this.intervalId = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);
    }, 1000);
  }

  public pause(): void {
    if (!this.isRunning()) return;
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public reset(): void {
    this.pause();
    this.elapsedSeconds.set(0);
  }

  public toggle(): void {
    if (this.isRunning()) {
      this.pause();
    } else {
      this.start();
    }
  }
}

