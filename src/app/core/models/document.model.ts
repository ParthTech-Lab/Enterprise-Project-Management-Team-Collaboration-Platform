export interface DocumentItem {
  id: string;
  title: string;
  folder: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'sheet' | 'figma' | 'markdown' | 'presentation';
  size: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  lastModified: string;
  sharedStatus: 'internal' | 'team_only' | 'restricted' | 'public';
  tags: string[];
  favorite: boolean;
  contentSnippet?: string;
  version: string;
}

