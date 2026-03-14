export interface Conversation {
  id: string;
  userName: string;
  avatarInitial: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  bookTitle: string;
  bookPrice: number;
  isOnline: boolean;
}

export const mockConversations: Conversation[] = [
  {
    id: '1',
    userName: 'Trần Thị B',
    avatarInitial: 'T',
    lastMessage: 'Sách còn không bạn? Mình muốn mua nè',
    time: '2 phút',
    unreadCount: 3,
    bookTitle: 'Clean Code',
    bookPrice: 85000,
    isOnline: true,
  },
  {
    id: '2',
    userName: 'Lê Văn C',
    avatarInitial: 'L',
    lastMessage: 'OK bạn, mình gửi sách ngày mai nhé!',
    time: '15 phút',
    unreadCount: 0,
    bookTitle: 'Nguyên lý Kế toán',
    bookPrice: 45000,
    isOnline: true,
  },
  {
    id: '3',
    userName: 'Phạm Thị D',
    avatarInitial: 'P',
    lastMessage: 'Giảm thêm được không bạn ơi? 😊',
    time: '1 giờ',
    unreadCount: 1,
    bookTitle: 'Head First Design Patterns',
    bookPrice: 95000,
    isOnline: false,
  },
  {
    id: '4',
    userName: 'Nguyễn Văn A',
    avatarInitial: 'N',
    lastMessage: 'Mình đã chuyển khoản rồi, bạn kiểm tra giúp',
    time: '3 giờ',
    unreadCount: 0,
    bookTitle: 'Introduction to Algorithms',
    bookPrice: 120000,
    isOnline: false,
  },
  {
    id: '5',
    userName: 'Hoàng Văn E',
    avatarInitial: 'H',
    lastMessage: 'Bạn có sách lập trình C++ không?',
    time: '1 ngày',
    unreadCount: 0,
    bookTitle: 'Marketing căn bản',
    bookPrice: 55000,
    isOnline: false,
  },
  {
    id: '6',
    userName: 'Đỗ Thị F',
    avatarInitial: 'Đ',
    lastMessage: 'Cảm ơn bạn, sách rất tốt! ⭐⭐⭐⭐⭐',
    time: '2 ngày',
    unreadCount: 0,
    bookTitle: 'English Grammar in Use',
    bookPrice: 65000,
    isOnline: false,
  },
];
