export interface Activity {
  id: string;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  action: 'created' | 'updated' | 'completed' | 'commented' | 'assigned' | 'deleted' | 'deployed' | 'status_change';
  targetType: 'project' | 'task' | 'document' | 'milestone' | 'member' | 'goal' | 'release';
  targetId: string;
  targetTitle: string;
  projectId?: string;
  projectName?: string;
  details?: string;
  timestamp: string;
}

