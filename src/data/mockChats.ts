export interface Conversation {
  id: string;
  userName: string;
  avatar:string;
  avatarInitial: string;
  lastMessage: string;
  lastMessageImage?: string; // Add optional last message image
  time: string;
  unreadCount: number;
  bookTitle: string;
  bookPrice: number;
  bookId?: string;
  isOnline: boolean;
}

