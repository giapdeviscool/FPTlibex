export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  condition: 'Như mới' | 'Tốt' | 'Khá' | 'Cũ';
  image: string;
  seller: string;
  faculty: string;
  postedAt: string;
}

export const categories = [
  { id: '1', name: 'Tất cả', icon: 'apps' },
  { id: '2', name: 'CNTT', icon: 'laptop' },
  { id: '3', name: 'Kinh tế', icon: 'trending-up' },
  { id: '4', name: 'Ngoại ngữ', icon: 'language' },
  { id: '5', name: 'Thiết kế', icon: 'brush' },
  { id: '6', name: 'Marketing', icon: 'megaphone' },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    price: 120000,
    originalPrice: 350000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/61ZFuVSiBSL._SL1500_.jpg',
    seller: 'Nguyễn Văn A',
    faculty: 'CNTT',
    postedAt: '2 giờ trước',
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 85000,
    originalPrice: 250000,
    condition: 'Như mới',
    image: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
    seller: 'Trần Thị B',
    faculty: 'CNTT',
    postedAt: '5 giờ trước',
  },
  {
    id: '3',
    title: 'Nguyên lý Kế toán',
    author: 'PGS.TS Nguyễn Văn Công',
    price: 45000,
    originalPrice: 120000,
    condition: 'Khá',
    image: 'https://m.media-amazon.com/images/I/71s0lumKb-L._SL1500_.jpg',
    seller: 'Lê Văn C',
    faculty: 'Kinh tế',
    postedAt: '1 ngày trước',
  },
  {
    id: '4',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman',
    price: 95000,
    originalPrice: 280000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/61APhXCksuL._SL1500_.jpg',
    seller: 'Phạm Thị D',
    faculty: 'CNTT',
    postedAt: '1 ngày trước',
  },
  {
    id: '5',
    title: 'Marketing căn bản',
    author: 'Philip Kotler',
    price: 55000,
    originalPrice: 180000,
    condition: 'Như mới',
    image: 'https://m.media-amazon.com/images/I/71wSMFCfKPL._SL1500_.jpg',
    seller: 'Hoàng Văn E',
    faculty: 'Marketing',
    postedAt: '3 ngày trước',
  },
  {
    id: '6',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    price: 65000,
    originalPrice: 200000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/71KB-rEYSxL._SL1500_.jpg',
    seller: 'Đỗ Thị F',
    faculty: 'Ngoại ngữ',
    postedAt: '4 ngày trước',
  },
];
