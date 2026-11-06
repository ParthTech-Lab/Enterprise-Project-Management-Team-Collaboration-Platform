export type ProjectStatus = 'planning' | 'active' | 'at_risk' | 'on_hold' | 'completed' | 'archived';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  tasksCount: number;
  completedTasksCount: number;
}

export interface ProjectRisk {
  id: string;
  title: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  ownerName: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  teamId: string;
  teamName: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number;
  startDate: string;
  deadline: string;
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  health: 'healthy' | 'needs_attention' | 'at_risk';
  healthScore: number; // 0-100
  memberIds: string[];
  tasksCount: number;
  completedTasksCount: number;
  tags: string[];
  milestones: ProjectMilestone[];
  risks?: ProjectRisk[];
  updatedAt: string;
}

