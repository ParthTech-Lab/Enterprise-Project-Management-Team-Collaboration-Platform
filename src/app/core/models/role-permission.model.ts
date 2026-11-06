import { UserRole } from './user.model';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage' | 'export';
export type ResourceDomain = 'projects' | 'tasks' | 'financials' | 'team_members' | 'reports' | 'system_settings' | 'integrations' | 'audit_logs';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  userCount: number;
  badgeColor: string;
  permissions: Record<ResourceDomain, PermissionAction[]>;
}

