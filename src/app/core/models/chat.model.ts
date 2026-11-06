export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
  reactions?: { emoji: string; count: number; users: string[] }[];
  pinned?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'channel' | 'direct' | 'project';
  topic?: string;
  isPrivate: boolean;
  unreadCount: number;
  memberIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
  status?: string;
}

