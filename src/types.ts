export interface Friend {
  senderId: string;
  recipientId: string;
  acceptTime?: Date;
}

export interface User {
  id: string;
  username: string;
}
