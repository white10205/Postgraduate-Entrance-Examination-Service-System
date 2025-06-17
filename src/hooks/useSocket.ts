let socket = null;

export const useSocket = () => {
  if (!socket) {
    socket = new WebSocket("ws://localhost:5173/commonSocket");
  }
  return socket;
};
