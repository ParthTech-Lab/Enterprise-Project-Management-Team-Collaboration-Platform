export type MemberStatus = 'online' | 'away' | 'busy' | 'offline';
export type UserRole = 'admin' | 'project_manager' | 'team_lead' | 'developer' | 'designer' | 'employee' | 'viewer';

export interface UserSkill {
  name: string;
  level: 'expert' | 'proficient' | 'intermediate';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  status: MemberStatus;
  statusMessage?: string;
  timezone: string;
  location: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
  activeProjectsCount: number;
  openTasksCount: number;
  completedTasksCount: number;
  workloadPercentage: number; // 0-100+
  skills: UserSkill[];
  bio?: string;
  teamIds: string[];
}

