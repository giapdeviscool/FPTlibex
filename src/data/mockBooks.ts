import { User } from "./mockUsers";

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
  seller: User;
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
