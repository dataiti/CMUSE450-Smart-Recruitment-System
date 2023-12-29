import io from "socket.io-client";

let socket;

const connectSocket = ({ userId }) => {
  if (userId) {
    socket = io("http://localhost:5000", {
      query: `userId=${userId}`,
    });
  }
};

export { socket, connectSocket };
