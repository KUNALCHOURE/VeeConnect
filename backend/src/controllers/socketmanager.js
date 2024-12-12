import { Server } from "socket.io";

let connections = {};
let message = {};
let timeonline = {};

const connnectToserver = (server) => {
  const io = new Server(server,{
    cors:{
      origin:'*',
      methods:["GET","POST"],
      allowedHeaders:["*"],
      credentials:true
    }
  });

  io.on("connection", (socket) => {

    console.log("something connected");
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }

      connections[path].push(socket.id);
      timeonline[socket.id] = new Date();

      // Notify other users in the room
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
      }

      // Send existing messages to the new user
      if (message[path] !== undefined) {
        for (let a = 0; a < message[path].length; a++) {
          io.to(socket.id).emit(
            "chat-message",
            message[path][a]["data"],
            message[path][a]["sender"],
            message[path][a]["socket-id-sender"]
          );
        }
      }
    });

    socket.on("signal", (toid, signalMessage) => {
      io.to(toid).emit("signal", socket.id, signalMessage);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (found) {
        if (message[matchingRoom] === undefined) {
          message[matchingRoom] = [];
        }

        message[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((ele) => {
          io.to(ele).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      // Handle disconnection logic here

      var diiftime=Math.abs(timeonline[socket.id]-new Date())

      var key;
      for(const[k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
        for(let a=0;a<v.length;a++){
          if(v[a]===socket.id){
            key=k;

            for(let a=0 ;a<connections[key].length;a++){
              io.to(connections[key][a].emit('user-left',socket.id))
            }

            var index=connections[key].indexof(socket.id);

            connections[key].splice(index,1);

            if(connections[key].length===0){
              delete connections[key]
            }
          }
        }
      }
    });
  });
};

export default connnectToserver;
