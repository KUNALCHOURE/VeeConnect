import { Server } from "socket.io";

const connnectToserver = (server) => {
  const io = new Server(server);
  return io;
};

export default connnectToserver;
