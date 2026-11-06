import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Task Detail Drawer
  public isTaskDrawerOpen = signal<boolean>(false);
  public selectedTask = signal<Task | null>(null);

  // Task Create/Edit Modal
  public isTaskModalOpen = signal<boolean>(false);
  public taskToEdit = signal<Task | null>(null);

  // Project Create Modal
  public isProjectModalOpen = signal<boolean>(false);

  // Member Profile Drawer
  public isMemberDrawerOpen = signal<boolean>(false);
  public selectedMember = signal<User | null>(null);

  // Event Create Modal
  public isEventModalOpen = signal<boolean>(false);

  // Quick Create Modal
  public isQuickCreateOpen = signal<boolean>(false);

  // Command Palette
  public isCommandPaletteOpen = signal<boolean>(false);

  public openTaskDrawer(task: Task): void {
    this.selectedTask.set(task);
    this.isTaskDrawerOpen.set(true);
  }

  public closeTaskDrawer(): void {
    this.isTaskDrawerOpen.set(false);
  }

  public openTaskModal(task?: Task): void {
    this.taskToEdit.set(task || null);
    this.isTaskModalOpen.set(true);
  }

  public closeTaskModal(): void {
    this.isTaskModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  public openProjectModal(): void {
    this.isProjectModalOpen.set(true);
  }

  public closeProjectModal(): void {
    this.isProjectModalOpen.set(false);
  }

  public openMemberDrawer(user: User): void {
    this.selectedMember.set(user);
    this.isMemberDrawerOpen.set(true);
  }

  public closeMemberDrawer(): void {
    this.isMemberDrawerOpen.set(false);
  }

  public openEventModal(): void {
    this.isEventModalOpen.set(true);
  }

  public closeEventModal(): void {
    this.isEventModalOpen.set(false);
  }

  public toggleQuickCreate(): void {
    this.isQuickCreateOpen.update(v => !v);
  }

  public closeQuickCreate(): void {
    this.isQuickCreateOpen.set(false);
  }

  public toggleCommandPalette(): void {
    this.isCommandPaletteOpen.update(v => !v);
  }

  public openCommandPalette(): void {
    this.isCommandPaletteOpen.set(true);
  }

  public closeCommandPalette(): void {
    this.isCommandPaletteOpen.set(false);
  }
}

