import { io } from "socket.io-client";

let socket = null; // Singleton instance

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000"); // Your backend URL
  }
  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
