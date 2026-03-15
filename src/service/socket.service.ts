import { io, Socket } from 'socket.io-client';
import { FPTLIBEX_API } from '@env';

const BASE_URL = 'https://fptlibex-api.gphan.website';

// For socket.io, we often need the host without the subpath if it's handled by a proxy, 
// but here it seems the backend might be under /fptlibex.
// We'll use the base URL and let socket.io handle the defaults.
class SocketService {
  public static socket: Socket | null = null;

  static connect(token: string) {
    if (SocketService.socket) return;

    SocketService.socket = io(BASE_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket'],
    });

    SocketService.socket.on('connect', () => {
      console.log('Socket connected:', SocketService.socket?.id);
    });

    SocketService.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    SocketService.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  static joinRoom(roomId: string) {
    if (SocketService.socket) {
      SocketService.socket.emit('join_room', roomId);
    }
  }

  static leaveRoom(roomId: string) {
    if (SocketService.socket) {
      SocketService.socket.emit('leave_room', roomId);
    }
  }

  static sendMessage(data: any) {
    if (SocketService.socket) {
      SocketService.socket.emit('send_message', data);
    }
  }

  static disconnect() {
    if (SocketService.socket) {
      SocketService.socket.disconnect();
      SocketService.socket = null;
    }
  }
}

export default SocketService;
