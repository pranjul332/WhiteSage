import io from "socket.io-client";

export const initSocket = (roomId, userName) => {
  const socket = io("http://localhost:5000", {
    query: {
      roomId,
      userName,
    },
  });

  return socket;
};
