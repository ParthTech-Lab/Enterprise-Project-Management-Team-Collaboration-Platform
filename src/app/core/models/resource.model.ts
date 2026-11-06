export interface MemberCapacityDay {
  date: string; // YYYY-MM-DD
  dayName: string;
  assignedHours: number;
  totalCapacityHours: number;
  status: 'normal' | 'overloaded' | 'underutilized';
}

export interface MemberWorkload {
  userId: string;
  userName: string;
  userAvatar: string;
  roleTitle: string;
  department: string;
  weeklyCapacity: number; // e.g. 40
  assignedHours: number; // e.g. 36
  utilizationPercentage: number; // e.g. 90
  status: 'overloaded' | 'optimal' | 'available';
  days: MemberCapacityDay[];
  assignedProjects: { projectId: string; projectName: string; hours: number }[];
}

