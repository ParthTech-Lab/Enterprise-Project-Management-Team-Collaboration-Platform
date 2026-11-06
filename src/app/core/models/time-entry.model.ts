export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskTitle?: string;
  description: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number; // in minutes
  billable: boolean;
  status: 'submitted' | 'approved' | 'rejected' | 'draft';
}

