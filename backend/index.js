import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import connnectToserver from "./src/controllers/socketmanager.js";
import cors from "cors";
import userroute from "./src/routes/userrouts.js";
import Apierror from "./utils/Apierror.js"; // Ensure this import is correct
import dotenv from 'dotenv'

dotenv.config();
// Initialize Express app
const app = express();
const server = createServer(app); // Create HTTP server
const io = connnectToserver(server); // Initialize socket.io

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(cors());

// Routes
app.use("/api/v1/users", userroute);

// Database connection
const start = async () => {
  try {
    await mongoose.connect(
      `${process.env.ATLASDB_URL}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("MongoDB connected");

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit process with failure
  }
};

start();

// Error handling middleware
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

// Default route
app.get("/", (req, res) => {
  res.send("Server is working");
});