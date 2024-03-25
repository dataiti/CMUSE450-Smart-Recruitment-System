import io from "socket.io-client";

let socket;

const connectSocket = ({ userId }) => {
  if (userId) {
    socket = io(process.env.REACT_APP_URL_SERVER_SOCKET, {
      query: `userId=${userId}`,
    });
  }
};

export { socket, connectSocket };
