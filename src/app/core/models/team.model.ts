export interface Team {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  leadId: string;
  leadName: string;
  leadAvatar: string;
  memberIds: string[];
  activeProjectIds: string[];
  productivityScore: number; // 0-100
  averageWorkload: number; // 0-100
  color: string;
  tags: string[];
}

