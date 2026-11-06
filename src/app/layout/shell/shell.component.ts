import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopnavComponent } from '../topnav/topnav.component';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';
import { QuickCreateModalComponent } from '../quick-create/quick-create-modal.component';
import { TaskDetailDrawerComponent } from '../../shared/components/task-detail-drawer/task-detail-drawer.component';
import { TaskFormModalComponent } from '../../shared/components/task-form-modal/task-form-modal.component';
import { ProjectFormModalComponent } from '../../shared/components/project-form-modal/project-form-modal.component';
import { MemberProfileDrawerComponent } from '../../shared/components/member-profile-drawer/member-profile-drawer.component';
import { EventFormModalComponent } from '../../shared/components/event-form-modal/event-form-modal.component';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopnavComponent,
    CommandPaletteComponent,
    QuickCreateModalComponent,
    TaskDetailDrawerComponent,
    TaskFormModalComponent,
    ProjectFormModalComponent,
    MemberProfileDrawerComponent,
    EventFormModalComponent,
    ToastContainerComponent
  ],
  template: `
    <div class="orbit-app-layout">
      <!-- Left Collapsible Sidebar -->
      <app-sidebar
        [collapsed]="isSidebarCollapsed()"
        [mobileOpen]="isMobileSidebarOpen()"
        (toggleCollapse)="toggleSidebar()"
        (closeMobile)="closeMobileSidebar()"
      ></app-sidebar>

      <!-- Mobile Backdrop -->
      <div
        *ngIf="isMobileSidebarOpen()"
        class="mobile-backdrop"
        (click)="closeMobileSidebar()"
      ></div>

      <!-- Main Workspace Viewport -->
      <div class="orbit-main-viewport">
        <!-- Top Navigation Bar -->
        <app-topnav
          (toggleMobileSidebar)="toggleMobileSidebar()"
        ></app-topnav>

        <!-- Routed Feature Page Container -->
        <main class="orbit-content-area">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Global Modals, Drawers & Palettes -->
      <app-command-palette></app-command-palette>
      <app-quick-create-modal></app-quick-create-modal>
      <app-task-detail-drawer></app-task-detail-drawer>
      <app-task-form-modal></app-task-form-modal>
      <app-project-form-modal></app-project-form-modal>
      <app-member-profile-drawer></app-member-profile-drawer>
      <app-event-form-modal></app-event-form-modal>

      <!-- Global Toasts -->
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .orbit-app-layout {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-app);
      position: relative;
    }

    .orbit-main-viewport {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      height: 100vh;
      overflow: hidden;
    }

    .orbit-content-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: var(--bg-canvas);
      display: flex;
      flex-direction: column;
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
      z-index: 150;
    }
  `]
})
export class ShellComponent {
  public isSidebarCollapsed = signal<boolean>(false);
  public isMobileSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(v => !v);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}

