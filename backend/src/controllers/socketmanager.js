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
        if (!messages[roomKey]) {
          messages[roomKey] = [];
        }

        messages[roomKey].push({
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
    socket.on("disconnect", async () => {
      let roomKey = null;
      console.log("called");

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
          if (connectedSocketId !== socket.id) {
            io.to(connectedSocketId).emit("user-left", socket.id);
          }
        });

        // Remove the user from the room
        connections[roomKey] = connections[roomKey].filter(
          (connectedSocketId) => connectedSocketId !== socket.id
        );

        // If the room is empty, save the meeting data and delete it
        if (connections[roomKey].length === 0) {
          const chatData = messages[roomKey] || [];
          const participants = connections[roomKey].map(id => {
            const socket = io.sockets.sockets.get(id);
            return {
              user: socket?.userId || null, // Use stored userId if available
              username: socket?.username || "Guest",
            };
          });

          try {
            const newMeeting = new meeting({
              meeting_id: roomKey,
              chats: chatData.map(msg => ({
                sender: msg.sender,
                message: msg.data,
                createdAt: new Date(),
              })),
              participants: participants,
            });
            await newMeeting.save();

            // Link meeting to user's history if authenticated
            if (socket.userId) {
              await User.findByIdAndUpdate(socket.userId, {
                $push: { history: { meetingID: newMeeting._id } },
              });
            }

            console.log(`Meeting ${roomKey} saved to database`);
          } catch (error) {
            console.error("Error saving meeting:", error);
          }

          delete connections[roomKey];
          delete messages[roomKey]; // Clean up messages
        }
      }

      console.log(`User ${socket.id} disconnected from room ${roomKey}`);
      delete timeonline[socket.id]; // Clean up user-specific data
    });
  });

  return io;
};

export default connnectToserver;