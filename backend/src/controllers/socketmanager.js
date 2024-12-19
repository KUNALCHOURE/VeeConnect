import { Server } from "socket.io";

let connections = {};   //stores the connections rooms:ids of persons
let message = {};  //stores the message in a particular room  room:message[sender ,message]
let timeonline = {};

const connnectToserver = (server) => {
  const io = new Server(server, {   //instace of the server is created
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {     //listen for new connections
    console.log("A user connected:", socket.id);

    // When a user joins a call
    socket.on("join-call", (path) => {   
      if (!connections[path]) {      //if path doesnt exist it create a new path
        connections[path] = [];
      }
  
      connections[path].push(socket.id);  //Add the user in the room 
      timeonline[socket.id] = new Date();

      // Notify all other users in the room
      connections[path].forEach((connectedSocketId) => {
        io.to(connectedSocketId).emit("user-joined", socket.id, connections[path]);
      });

      // Send chat history to the new user
      if (message[path]) {
        message[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg["data"],
            msg["sender"],
            msg["socket-id-sender"]
          );
        });
      }
    });

    // Handle signaling for WebRTC connections
    socket.on("signal", (toid, signalMessage) => {
      io.to(toid).emit("signal", socket.id, signalMessage);
    });

    // Handle chat messages
    socket.on("chat-message", (data, sender) => {
      let roomKey = null;

      // Find the room the sender is in
      for (const [key, value] of Object.entries(connections)) {
        if (value.includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (roomKey) {
        if (!message[roomKey]) {
          message[roomKey] = [];
        }

        message[roomKey].push({
          sender,
          data,
          "socket-id-sender": socket.id,
        });

        console.log("Message received in room:", roomKey, data);

        // Broadcast the message to all users in the room
        connections[roomKey].forEach((connectedSocketId) => {
          io.to(connectedSocketId).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      let roomKey = null;

      // Find the room the user was in
      for (const [key, value] of Object.entries(connections)) {
        if (value.includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (roomKey) {
        // Notify other users in the room
        connections[roomKey].forEach((connectedSocketId) => {
          io.to(connectedSocketId).emit("user-left", socket.id);
        });

        // Remove the user from the room
        connections[roomKey] = connections[roomKey].filter(
          (connectedSocketId) => connectedSocketId !== socket.id
        );

        // If the room is empty, delete it
        if (connections[roomKey].length === 0) {
          delete connections[roomKey];
        }
      }

      console.log(`User ${socket.id} disconnected from room ${roomKey}`);
      delete timeonline[socket.id];
    });
  });

  return io;
};

export default connnectToserver;
