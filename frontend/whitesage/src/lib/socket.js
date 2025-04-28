import io from "socket.io-client";

export const initSocket = (roomId, userName, userId, token) => {
  const socket = io("http://localhost:5000", {
    query: {
      roomId,
      userName,
      userId,
    },
    auth: {
      token,
    },
  });

  return socket;
};
