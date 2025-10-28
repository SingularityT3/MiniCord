export interface User {
  id: string;
  username: string;
  friendRelationId?: string;
}

export interface Friend {
  id: string;
  senderId: string;
  recipientId: string;
  acceptTime?: Date;
}

export interface Conversation {
  id: string;
  title: string;
  type: string;
  members?: Member[];
}

export interface Member {
  id: string;
  userId: string;
  joinTime: Date;
}

export interface Message {
  id: string;
  authorId: string;
  author?: User;
  conversationId: string;
  sendTime: Date;
  content: string;
}
