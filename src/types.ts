export type MessageType = 'text' | 'image' | 'voice' | 'audio' | 'document' | 'location' | 'lossless_file';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  isLossless?: boolean;
  selfDestructSeconds?: number; // e.g. 10s, 30s
  expiresAt?: number; // timestamp when it self destructs
  isViewOnce?: boolean;
  isBurned?: boolean;
  voiceDuration?: number; // in seconds
  voiceWaveform?: number[];
  voiceBookmarks?: { id: string; time: number; label: string }[];
  isProtected?: boolean; // restricted from copying or forwarding
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: { [emoji: string]: string[] }; // emoji -> array of userIds
  isStarred?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  isOnline: boolean;
  lastSeen: string;
  isMetaAI?: boolean;
}

export type ChatCategory = 'all' | 'personal' | 'work' | 'groups' | 'channels';
export type EnvironmentWorkspace = 'all' | 'personal' | 'work' | 'family' | 'vault';

export interface Chat {
  id: string;
  isGroup: boolean;
  name: string;
  phone?: string;
  avatar: string;
  about?: string;
  category: 'personal' | 'work' | 'groups' | 'channels';
  workspace?: 'personal' | 'work' | 'family' | 'vault';
  isProtectedChat?: boolean; // prevents forwarding or copying
  members?: string[];
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isTyping?: boolean;
  isMetaAI?: boolean;
  isChannel?: boolean;
  channelSubscribers?: number;
  lastMessage?: Message;
}

export interface TodoTask {
  id: string;
  chatId: string;
  title: string;
  isDone: boolean;
  createdAt: string;
  priority?: 'high' | 'normal';
}

export interface ChatNote {
  chatId: string;
  text: string;
  updatedAt: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  type: 'image' | 'text';
  content: string; // image url or text
  caption?: string;
  backgroundColor?: string;
  viewed: boolean;
}

export interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export type AppTab = 'chats' | 'status' | 'calls' | 'settings';
export type Language = 'bn' | 'en';
