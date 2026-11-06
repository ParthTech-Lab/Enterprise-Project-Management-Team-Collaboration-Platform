export type NotificationCategory = 'tasks' | 'projects' | 'mentions' | 'comments' | 'deadlines' | 'assignments' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actorName?: string;
  actorAvatar?: string;
  priority?: 'normal' | 'urgent';
}

