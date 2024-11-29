const express=require("express");
const{createServer}=require("node:http");
const{Server} = require("socket.io");
const mongoose=require("mongoose");
const connnectToserver=require("./src/constrollers/socketmanager")
const cors=require('cors')
// connection socket with app
const app=express();
const server=createServer(app); //cerateServer is connecting server with app (express instance)
const io=connnectToserver(server);


app.set("port",(process.env.PORT||3000));
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}))
app.use(cors())

app.get("/",(req,res)=>{
    res.send("working ");
})


const start=async()=>{
    const connectdb=await mongoose.connect("mongodb+srv://chourekunal4:kkavideocall@cluster0.clojo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("mongo connected");
    server.listen(app.get("port"),()=>{
        console.log("listning");
    })
}

start();