export interface User {
  id: string;
  email: string;
  businessId: string;
  businessName: string;
}

export interface Business {
  id: string;
  name: string;
  webhookChatRecordUrl?: string;
  webhookSendMessageUrl?: string;
  webhookUserReplyUrl?: string;
}

export interface Chat {
  id: string;
  businessId: string;
  chatId: string;
  contactName?: string;
  notes?: string;
  status: string;
  lastMessage?: string;
  lastMessageTime?: string;
  labels: Label[];
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  chatId: string;
  direction: 'incoming' | 'outgoing';
  content: string;
  timestamp: string;
}

export interface Label {
  id: string;
  chatId: string;
  name: string;
  color: string;
}
