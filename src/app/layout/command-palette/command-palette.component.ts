import { Component, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { TimerService } from '../../core/services/timer.service';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'project' | 'task' | 'person' | 'document' | 'team' | 'action';
  icon: string;
  route?: string;
  action?: () => void;
  avatar?: string;
  badge?: string;
  badgeVariant?: 'emerald' | 'amber' | 'crimson' | 'purple' | 'graphite';
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent, AvatarComponent],
  template: `
    <div
      *ngIf="modalService.isCommandPaletteOpen()"
      class="palette-overlay"
      (click)="onBackdropClick($event)"
    >
      <div class="palette-dialog" (click)="$event.stopPropagation()">
        <!-- Search Input Bar -->
        <div class="palette-input-wrap">
          <app-icon name="search" [size]="18" customClass="palette-search-icon"></app-icon>
          <input
            type="text"
            class="palette-input"
            placeholder="Type a command or search projects, tasks, members, docs..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onQueryChange()"
            autofocus
          />
          <div class="palette-esc-badge" (click)="close()">
            <span class="esc-key">ESC</span>
          </div>
        </div>

        <!-- Filtered Results Container -->
        <div class="palette-results-list">
          <div *ngIf="filteredResults().length === 0" class="palette-empty">
            <app-icon name="alert-circle" [size]="24" customClass="empty-icon"></app-icon>
            <span class="empty-text">No matches found for "{{ searchQuery }}"</span>
            <span class="empty-sub">Try searching for "Istio", "Design", "Ananya", or "Tasks"</span>
          </div>

          <!-- Quick Actions Section when query is empty -->
          <div *ngIf="!searchQuery" class="result-group">
            <div class="group-title">QUICK ACTIONS</div>
            <div
              *ngFor="let item of quickActions"
              class="result-item"
              (click)="executeItem(item)"
            >
              <div class="item-icon-box action-icon">
                <app-icon [name]="item.icon" [size]="15"></app-icon>
              </div>
              <div class="item-meta">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-sub">{{ item.subtitle }}</span>
              </div>
              <app-badge variant="emerald" size="sm">Action</app-badge>
            </div>
          </div>

          <!-- Matching Grouped Results -->
          <div *ngIf="groupedResults().projects.length > 0" class="result-group">
            <div class="group-title">PROJECTS</div>
            <div
              *ngFor="let item of groupedResults().projects"
              class="result-item"
              (click)="executeItem(item)"
            >
              <div class="item-icon-box project-icon">
                <app-icon name="folder" [size]="15"></app-icon>
              </div>
              <div class="item-meta">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-sub">{{ item.subtitle }}</span>
              </div>
              <app-badge [variant]="item.badgeVariant || 'graphite'" size="sm">{{ item.badge }}</app-badge>
            </div>
          </div>

          <div *ngIf="groupedResults().tasks.length > 0" class="result-group">
            <div class="group-title">TASKS</div>
            <div
              *ngFor="let item of groupedResults().tasks"
              class="result-item"
              (click)="executeItem(item)"
            >
              <div class="item-icon-box task-icon">
                <app-icon name="check-square" [size]="15"></app-icon>
              </div>
              <div class="item-meta">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-sub">{{ item.subtitle }}</span>
              </div>
              <app-badge [variant]="item.badgeVariant || 'graphite'" size="sm">{{ item.badge }}</app-badge>
            </div>
          </div>

          <div *ngIf="groupedResults().people.length > 0" class="result-group">
            <div class="group-title">PEOPLE</div>
            <div
              *ngFor="let item of groupedResults().people"
              class="result-item"
              (click)="executeItem(item)"
            >
              <app-avatar [src]="item.avatar" [name]="item.title" size="sm"></app-avatar>
              <div class="item-meta">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-sub">{{ item.subtitle }}</span>
              </div>
              <app-badge variant="graphite" size="sm">Member</app-badge>
            </div>
          </div>

          <div *ngIf="groupedResults().documents.length > 0" class="result-group">
            <div class="group-title">DOCUMENTS</div>
            <div
              *ngFor="let item of groupedResults().documents"
              class="result-item"
              (click)="executeItem(item)"
            >
              <div class="item-icon-box doc-icon">
                <app-icon name="file-text" [size]="15"></app-icon>
              </div>
              <div class="item-meta">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-sub">{{ item.subtitle }}</span>
              </div>
              <app-badge variant="purple" size="sm">{{ item.badge }}</app-badge>
            </div>
          </div>
        </div>

        <!-- Command Palette Footer Navigation Hints -->
        <div class="palette-footer">
          <div class="hint-group">
            <span class="key-hint">↵</span>
            <span class="hint-text">to select</span>
          </div>
          <div class="hint-group">
            <span class="key-hint">ESC</span>
            <span class="hint-text">to close</span>
          </div>
          <div class="hint-group">
            <span class="key-hint">CTRL+K</span>
            <span class="hint-text">to toggle</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .palette-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 1200;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 12vh;
      animation: fadeIn 0.15s ease forwards;
    }

    .palette-dialog {
      width: 100%;
      max-width: 640px;
      background: var(--surface-primary);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-modal);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: zoomIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .palette-input-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .palette-search-icon {
      color: var(--accent-emerald);
      flex-shrink: 0;
    }

    .palette-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 15px;
      color: var(--text-primary);
    }

    .palette-input::placeholder {
      color: var(--text-muted);
    }

    .palette-esc-badge {
      cursor: pointer;
    }

    .esc-key {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-strong);
      border-radius: 4px;
      color: var(--text-muted);
    }

    .palette-results-list {
      max-height: 420px;
      overflow-y: auto;
      padding: 12px;
    }

    .palette-empty {
      padding: 40px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .empty-text {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .empty-sub {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .result-group {
      margin-bottom: 12px;
    }

    .group-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 6px 10px;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.12s ease;
    }

    .result-item:hover {
      background-color: var(--surface-secondary);
    }

    .item-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon {
      background: var(--accent-emerald-subtle);
      color: var(--accent-emerald);
    }

    .project-icon {
      background: var(--accent-amber-subtle);
      color: var(--accent-amber);
    }

    .task-icon {
      background: var(--surface-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
    }

    .doc-icon {
      background: var(--accent-purple-subtle);
      color: var(--accent-purple);
    }

    .item-meta {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .item-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .palette-footer {
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-top: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .hint-group {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .key-hint {
      font-size: 10px;
      font-weight: 700;
      padding: 1px 4px;
      background: var(--surface-tertiary);
      border: 1px solid var(--border-default);
      border-radius: 3px;
      color: var(--text-secondary);
    }

    .hint-text {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class CommandPaletteComponent {
  public modalService = inject(ModalService);
  public dataService = inject(DataService);
  public themeService = inject(ThemeService);
  public timerService = inject(TimerService);
  public router = inject(Router);

  public searchQuery = '';

  public quickActions: SearchResultItem[] = [
    {
      id: 'act-new-proj',
      title: 'Create New Enterprise Project',
      subtitle: 'Initialize project workspace, budget, and milestones',
      category: 'action',
      icon: 'plus',
      action: () => {
        this.close();
        this.modalService.openProjectModal();
      }
    },
    {
      id: 'act-new-task',
      title: 'Create New Task',
      subtitle: 'Add work ticket to backlog or sprint',
      category: 'action',
      icon: 'check-square',
      action: () => {
        this.close();
        this.modalService.openTaskModal();
      }
    },
    {
      id: 'act-start-timer',
      title: 'Start / Pause Live Stopwatch Timer',
      subtitle: 'Track active project billing hours',
      category: 'action',
      icon: 'clock',
      action: () => {
        this.close();
        this.timerService.toggle();
      }
    },
    {
      id: 'act-toggle-theme',
      title: 'Toggle Dark / Light Theme Mode',
      subtitle: 'Switch between Graphite Dark and Warm Neutral Light',
      category: 'action',
      icon: 'sun',
      action: () => {
        this.close();
        this.themeService.toggleTheme();
      }
    },
    {
      id: 'act-view-kanban',
      title: 'Open Kanban Sprint Board',
      subtitle: 'Interactive card columns and drag-drop flow',
      category: 'action',
      icon: 'kanban',
      route: '/kanban'
    }
  ];

  @HostListener('window:keydown', ['$event'])
  handleGlobalKey(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.modalService.toggleCommandPalette();
    } else if (event.key === 'Escape' && this.modalService.isCommandPaletteOpen()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    this.close();
  }

  close(): void {
    this.modalService.closeCommandPalette();
    this.searchQuery = '';
  }

  onQueryChange(): void {
    // reactive filter
  }

  public filteredResults = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResultItem[] = [];

    // Projects
    this.dataService.projects().forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        items.push({
          id: p.id,
          title: `${p.key}: ${p.name}`,
          subtitle: `${p.teamName} • ${p.status.toUpperCase()} • ${p.progress}% Complete`,
          category: 'project',
          icon: 'folder',
          route: `/projects/${p.id}`,
          badge: `${p.progress}%`,
          badgeVariant: p.progress > 70 ? 'emerald' : 'amber'
        });
      }
    });

    // Tasks
    this.dataService.tasks().forEach(t => {
      if (t.title.toLowerCase().includes(q) || t.key.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q))) {
        items.push({
          id: t.id,
          title: `${t.key}: ${t.title}`,
          subtitle: `${t.projectName} • Assignee: ${t.assigneeName}`,
          category: 'task',
          icon: 'check-square',
          action: () => {
            this.close();
            this.modalService.openTaskDrawer(t);
          },
          badge: t.status.replace('_', ' ').toUpperCase(),
          badgeVariant: t.status === 'completed' ? 'emerald' : t.status === 'blocked' ? 'crimson' : 'graphite'
        });
      }
    });

    // People
    this.dataService.users().forEach(u => {
      if (u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q) || u.roleTitle.toLowerCase().includes(q)) {
        items.push({
          id: u.id,
          title: u.name,
          subtitle: `${u.roleTitle} • ${u.department}`,
          category: 'person',
          icon: 'user',
          avatar: u.avatar,
          action: () => {
            this.close();
            this.modalService.openMemberDrawer(u);
          }
        });
      }
    });

    // Documents
    this.dataService.documents().forEach(d => {
      if (d.title.toLowerCase().includes(q) || d.folder.toLowerCase().includes(q)) {
        items.push({
          id: d.id,
          title: d.title,
          subtitle: `${d.folder} • ${d.size} • by ${d.ownerName}`,
          category: 'document',
          icon: 'file-text',
          route: '/documents',
          badge: d.version
        });
      }
    });

    return items;
  });

  public groupedResults = computed(() => {
    const list = this.filteredResults();
    return {
      projects: list.filter(i => i.category === 'project'),
      tasks: list.filter(i => i.category === 'task'),
      people: list.filter(i => i.category === 'person'),
      documents: list.filter(i => i.category === 'document')
    };
  });

  executeItem(item: SearchResultItem): void {
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.close();
      this.router.navigateByUrl(item.route);
    }
  }
}

