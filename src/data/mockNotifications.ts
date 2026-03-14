export type NotificationType = 'order' | 'system' | 'chat' | 'promotion';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'Đơn hàng đã được xác nhận',
    message: 'Người bán Nguyễn Văn A đã xác nhận đơn mua "Giáo trình C cơ bản" của bạn.',
    time: '10 phút trước',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'chat',
    title: 'Tin nhắn mới',
    message: 'Lê Thị B: Bạn ơi sách này còn không ạ?',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Chào mừng đến với FPTlibex',
    message: 'Nền tảng trao đổi giáo trình lớn nhất dành cho sinh viên FPT đã chính thức ra mắt. Khám phá ngay!',
    time: '2 ngày trước',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'promotion',
    title: 'Code giảm giá 20% phí giao dịch',
    message: 'Nhập code "BACKTOSCHOOL" để được giảm 20% phí khi giao dịch trên app.',
    time: '3 ngày trước',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'order',
    title: 'Đơn hàng phát sinh',
    message: 'Đơn hàng mã #O1003 của bạn đã giao thành công. Vui lòng đánh giá người bán.',
    time: '4 ngày trước',
    isRead: true,
  },
];
