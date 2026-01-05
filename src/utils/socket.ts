import { io, Socket } from 'socket.io-client';

export const socket: Socket = io(import.meta.env.VITE_API_SOCKET, {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket', 'polling']
});
