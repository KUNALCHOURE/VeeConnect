const { Server }=require("socket.io");

const connnectToserver=(server)=>{
    const io=new Server(server);
    return io;

}
module.exports=connnectToserver