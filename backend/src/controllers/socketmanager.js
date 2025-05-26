import { Server } from "socket.io";
import meeting from "../modles/meetingmodel.js"; // Import meeting model
import User from "../modles/usermodel.js"; // Import User model

let connections = {};   // Stores the connections rooms:ids of persons
let messages = {};      // Stores the message in a particular room  room:message[sender ,message]
let timeonline = {};

const connnectToserver = (server) => {
  const io = new Server(server, {   // Instance of the server is created
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {     // Listen for new connections
    console.log("A user connected:", socket.id);

    // When a user joins a call
    socket.on("join-call", (path, userId, username) => {   
      if (!connections[path]) {      // If path doesn't exist it creates a new path
        connections[path] = [];
      }
  
      connections[path].push(socket.id);  // Add the user in the room 
      timeonline[socket.id] = new Date();
      socket.path = path; // Store the room path in the socket
      socket.userId = userId; // Store userId from authenticated user (optional, null for guests)
      socket.username = username || "Guest"; // Store username, default to "Guest" if not provided
      console.log(`👤 New user joined: ${socket.id} | Room: ${path} | Username: ${socket.username} | UserId: ${socket.userId}`);
      console.log(`📢 Sending "user-joined" to:`, connections[path]);

      // Notify all other users in the room with the joining user's username and userId
      connections[path].forEach((connectedSocketId) => {
        io.to(connectedSocketId).emit("user-joined", socket.id, connections[path], socket.username, socket.userId);
      });

      // Send chat history to the new user
      if (messages[path]) {
        messages[path].forEach((msg) => {
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
    socket.on("chat-message", (message, username) => {
      if (!messages[socket.path]) {
        messages[socket.path] = [];
      }
      messages[socket.path].push({
        data: message,
        sender: username,
        "socket-id-sender": socket.id
      });
      io.to(socket.path).emit("chat-message", message, username, socket.id);
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      let roomKey = null;

      // Find the room this socket was in
      for (const [key, value] of Object.entries(connections)) {
        if (value.includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (roomKey) {
        // Remove the disconnected socket from the room
        connections[roomKey] = connections[roomKey].filter(id => id !== socket.id);

        // Notify other users in the room
        connections[roomKey].forEach((connectedSocketId) => {
          io.to(connectedSocketId).emit("user-left", socket.id);
        });

        // If the room is empty, clean up
        if (connections[roomKey].length === 0) {
          delete connections[roomKey];
          delete messages[roomKey];
        }
      }

      console.log(`User ${socket.id} disconnected from room ${roomKey}`);
      delete timeonline[socket.id];
    });
  });

  return io;
};

export default connnectToserver;