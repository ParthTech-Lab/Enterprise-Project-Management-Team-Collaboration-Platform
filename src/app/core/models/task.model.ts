import { PriorityLevel } from './project.model';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'blocked' | 'completed';

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeName?: string;
  dueDate?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url: string;
}

export interface TaskHistoryItem {
  id: string;
  actorName: string;
  actorAvatar: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  projectKey: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeRole: string;
  reporterId: string;
  reporterName: string;
  reporterAvatar: string;
  priority: PriorityLevel;
  status: TaskStatus;
  startDate?: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  history: TaskHistoryItem[];
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  updatedAt: string;
  blockedReason?: string;
}

