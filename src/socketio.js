import { io } from "socket.io-client";

let socket = null;

export function createSocketConnection({token}) {
  socket= io('http://localhost:4000', {
    auth: {
      token
    },
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    transports: ['websocket']
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    console.log("Socket connection cleaned up");
  }
}

export const getSocket = () => socket;



export const SocketEvents={
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DIRECT_MESSAGE: 'direct_message',
  NEW_MESSAGE: 'new_message',
  ERROR: 'error',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing'
}
