export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
}

export const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Chào bạn, sách Clean Code còn không?', isMe: false, time: '10:20' },
    { id: '2', text: 'Chào bạn! Còn nha, sách mình giữ rất kỹ 📚', isMe: true, time: '10:21' },
    { id: '3', text: 'Mình xem ảnh thực tế được không?', isMe: false, time: '10:22' },
    { id: '4', text: 'Được nha, đây bạn xem nhé!', isMe: true, time: '10:23' },
    { id: '5', text: 'Sách còn không bạn? Mình muốn mua nè', isMe: false, time: '10:30' },
  ],
  '2': [
    { id: '1', text: 'Mình muốn mua sách Nguyên lý Kế toán', isMe: true, time: '09:00' },
    { id: '2', text: 'Được bạn ơi, 45k thôi nha', isMe: false, time: '09:05' },
    { id: '3', text: 'OK mình lấy, giao ở đâu bạn?', isMe: true, time: '09:10' },
    { id: '4', text: 'Mình ở tòa Alpha, bạn qua lấy được không?', isMe: false, time: '09:12' },
    { id: '5', text: 'OK bạn, mình gửi sách ngày mai nhé!', isMe: false, time: '09:15' },
  ],
  '3': [
    { id: '1', text: 'Sách Design Patterns giá bao nhiêu vậy bạn?', isMe: false, time: '08:00' },
    { id: '2', text: '95k bạn nhé, sách còn rất mới', isMe: true, time: '08:05' },
    { id: '3', text: 'Giảm thêm được không bạn ơi? 😊', isMe: false, time: '08:10' },
  ],
  '4': [
    { id: '1', text: 'Mình chuyển khoản 120k rồi nhé', isMe: false, time: '14:00' },
    { id: '2', text: 'Mình đã chuyển khoản rồi, bạn kiểm tra giúp', isMe: false, time: '14:01' },
  ],
};
