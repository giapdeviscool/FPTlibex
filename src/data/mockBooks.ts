export type Condition = 'Như mới' | 'Tốt' | 'Khá' | 'Cũ' | '';
export type Faculty = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ' | 'Thiết kế' | 'Marketing' | 'Khác' | '';

export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  condition: Condition;
  image: string;
  seller: string;
  faculty: Faculty;
  createdAt: string;
  updatedAt: string;
}

export const categories = [
  { id: '1', name: 'Tất cả', icon: 'apps' },
  { id: '2', name: 'CNTT', icon: 'laptop' },
  { id: '3', name: 'Kinh tế', icon: 'trending-up' },
  { id: '4', name: 'Ngoại ngữ', icon: 'language' },
  { id: '5', name: 'Thiết kế', icon: 'brush' },
  { id: '6', name: 'Marketing', icon: 'megaphone' },
];

export let mockBooks: Book[] = [
  {
    _id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    price: 120000,
    originalPrice: 350000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/61ZFuVSiBSL._SL1500_.jpg',
    seller: 'Nguyễn Văn A',
    faculty: 'CNTT',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 85000,
    originalPrice: 250000,
    condition: 'Như mới',
    image: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
    seller: 'Trần Thị B',
    faculty: 'CNTT',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Nguyên lý Kế toán',
    author: 'PGS.TS Nguyễn Văn Công',
    price: 45000,
    originalPrice: 120000,
    condition: 'Khá',
    image: 'https://m.media-amazon.com/images/I/71s0lumKb-L._SL1500_.jpg',
    seller: 'Lê Văn C',
    faculty: 'Kinh tế',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '4',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman',
    price: 95000,
    originalPrice: 280000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/61APhXCksuL._SL1500_.jpg',
    seller: 'Phạm Thị D',
    faculty: 'CNTT',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '5',
    title: 'Marketing căn bản',
    author: 'Philip Kotler',
    price: 55000,
    originalPrice: 180000,
    condition: 'Như mới',
    image: 'https://m.media-amazon.com/images/I/71wSMFCfKPL._SL1500_.jpg',
    seller: 'Hoàng Văn E',
    faculty: 'Marketing',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    _id: '6',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    price: 65000,
    originalPrice: 200000,
    condition: 'Tốt',
    image: 'https://m.media-amazon.com/images/I/71KB-rEYSxL._SL1500_.jpg',
    seller: 'Đỗ Thị F',
    faculty: 'Ngoại ngữ',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
];
