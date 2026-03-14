export interface User {
  id: string;
  studentId: string;
  name: string;
  password: string; // Plaintext for mock purposes
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    studentId: 'SE172344',
    name: 'Nguyễn Văn A',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: 'u2',
    studentId: 'HE123456',
    name: 'Lê Thị B',
    password: '123',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'u3',
    studentId: 'SS111111',
    name: 'Test Account',
    password: '1', // Super simple for testing
  },
];
