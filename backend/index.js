import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import connnectToserver from "./src/constrollers/socketmanager.js";
import cors from "cors";
import User from "./src/modles/usermodel.js";

// Connection socket with app
const app = express();
const server = createServer(app); // createServer connects the server with the app (express instance)
const io = connnectToserver(server);

app.set("port", process.env.PORT || 3000);
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("working");
});

const start = async () => {
  const connectdb = await mongoose.connect(
    "mongodb+srv://chourekunal4:kkavideocall@cluster0.clojo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("mongo connected");
  server.listen(app.get("port"), () => {
    console.log("listening");
  });
};

start();
