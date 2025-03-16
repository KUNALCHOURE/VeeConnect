import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import connnectToserver from "./src/controllers/socketmanager.js";
import cors from "cors";
import User from "./src/modles/usermodel.js";
import userroute from"./src/routes/userrouts.js";
// Connection socket with app
const app = express();
const server = createServer(app); // createServer connects the server with the app (express instance)
const io = connnectToserver(server);

app.set("port", process.env.PORT || 3000);
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(cors());

app.use("/api/v1/users",userroute);




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

app.use((err, req, res, next) => {
  if (err instanceof Apierror) {
      return res.status(err.statuscode).json({
          success: false,
          status: err.statuscode,
          message: err.message || "An error occurred",
          errors: err.errors || [],
      });
  }

  res.status(500).json({
      success: false,
      status: 500,
      message: "Something went wrong",
      errors: [],
  });
});

app.get("/", (req, res) => {
  res.send("working");
});
