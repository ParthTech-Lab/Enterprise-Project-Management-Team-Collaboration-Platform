import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'my-work',
    loadComponent: () => import('./features/my-work/my-work.component').then(m => m.MyWorkComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent)
  },
  {
    path: 'kanban',
    loadComponent: () => import('./features/kanban/kanban.component').then(m => m.KanbanComponent)
  },
  {
    path: 'timeline',
    loadComponent: () => import('./features/timeline/timeline.component').then(m => m.TimelineComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'goals',
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./features/teams/teams.component').then(m => m.TeamsComponent)
  },
  {
    path: 'members',
    loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: 'time-tracking',
    loadComponent: () => import('./features/time-tracking/time-tracking.component').then(m => m.TimeTrackingComponent)
  },
  {
    path: 'activity',
    loadComponent: () => import('./features/activity/activity.component').then(m => m.ActivityComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'admin/organization',
    loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
  },
  {
    path: 'admin/roles',
    loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
  },
  {
    path: 'admin/integrations',
    loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
  },
  {
    path: 'admin/billing',
    loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
  },
  {
    path: 'admin/settings',
    loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
