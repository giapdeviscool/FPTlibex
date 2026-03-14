export interface Order {
  id: string;
  bookTitle: string;
  bookImage: string;
  price: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  statusLabel: string;
  otherUser: string;
  date: string;
}

export let myPurchases: Order[] = [
  {
    id: '1',
    bookTitle: 'Clean Code',
    bookImage: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
    price: 85000,
    status: 'shipping',
    statusLabel: 'Đang giao',
    otherUser: 'Trần Thị B',
    date: '12/03/2026',
  },
  {
    id: '2',
    bookTitle: 'Nguyên lý Kế toán',
    bookImage: 'https://m.media-amazon.com/images/I/71s0lumKb-L._SL1500_.jpg',
    price: 45000,
    status: 'completed',
    statusLabel: 'Đã nhận',
    otherUser: 'Lê Văn C',
    date: '08/03/2026',
  },
  {
    id: '3',
    bookTitle: 'English Grammar in Use',
    bookImage: 'https://m.media-amazon.com/images/I/71KB-rEYSxL._SL1500_.jpg',
    price: 65000,
    status: 'cancelled',
    statusLabel: 'Đã huỷ',
    otherUser: 'Đỗ Thị F',
    date: '05/03/2026',
  },
];

export let mySales: Order[] = [
  {
    id: '4',
    bookTitle: 'Introduction to Algorithms',
    bookImage: 'https://m.media-amazon.com/images/I/61ZFuVSiBSL._SL1500_.jpg',
    price: 120000,
    status: 'confirmed',
    statusLabel: 'Đã xác nhận',
    otherUser: 'Nguyễn Văn A',
    date: '13/03/2026',
  },
  {
    id: '5',
    bookTitle: 'Head First Design Patterns',
    bookImage: 'https://m.media-amazon.com/images/I/61APhXCksuL._SL1500_.jpg',
    price: 95000,
    status: 'pending',
    statusLabel: 'Chờ xác nhận',
    otherUser: 'Phạm Thị D',
    date: '13/03/2026',
  },
  {
    id: '6',
    bookTitle: 'Marketing căn bản',
    bookImage: 'https://m.media-amazon.com/images/I/71wSMFCfKPL._SL1500_.jpg',
    price: 55000,
    status: 'completed',
    statusLabel: 'Hoàn thành',
    otherUser: 'Hoàng Văn E',
    date: '01/03/2026',
  },
];
