export interface Friend {
  id: string;
  senderId: string;
  recipientId: string;
  acceptTime?: Date;
}

export interface User {
  id: string;
  username: string;
  friendRelationId?: string;
}
