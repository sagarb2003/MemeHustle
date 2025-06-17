import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  static instance;
  socket;

  constructor() {
    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  subscribe(event, callback) {
    this.socket.on(event, callback);
  }

  unsubscribe(event) {
    this.socket.off(event);
  }
}

export const socketService = SocketService.getInstance();
