import { Server } from "socket.io";

let connections={};
let message={};
let timeonline={};

const connnectToserver = (server) => {
  const io = new Server(server);

  io.on("connection",(socket)=>{

    socket.on("join-call",(path)=>{
       if(connections[path]===undefined){
         connections[path]=[]
       }

       connections[path].push(socket.id);
       timeonline[socket.id]=new Date();

       for(let a ; a<connections[path].lenght;a++){ 
         /* sample connection key and array pair used in this */    
 /*  const connections={"path1": ["socketId1", "socketId2", "socketId3"], */
           io.to(connections[path][a]).emit("user-joinded",socket.id,connections[path]);
       }



       /*
       sample message format
       const message = {
    "path1": [
        { data: "Hello!", sender: "User1", "socket-id-sender": "socketId1" },
        { data: "How are you?", sender: "User2", "socket-id-sender": "socketId2" }
    ]
};
 */
 if( message[path]!==undefined){
       for(let a ; a<message[path].lenght;a++){ 
          io.to(socket.id).emit("chat-message",message[path][a]['data'],message[path][a]['sender'],message[path][a]['socket-id-sender']);
      }}
    })
    

    socket.on("signal",(toid,message)=>{
      io.to(toid).emit("signal",socket.id,message);

    })
   
     socket.on("chat-message",(data,sender)=>{

     })

     socket.on("disconnect",()=>{

     })

  })
  
};

export default connnectToserver;
