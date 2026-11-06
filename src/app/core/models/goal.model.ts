export type GoalType = 'company' | 'team' | 'project' | 'individual';

export interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'on_track' | 'behind' | 'at_risk' | 'completed';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  teamId?: string;
  teamName?: string;
  targetQuarter: string; // e.g. Q4 2026
  progress: number; // 0-100
  status: 'on_track' | 'behind' | 'at_risk' | 'completed';
  keyResults: KeyResult[];
  deadline: string;
  relatedProjectIds: string[];
}

