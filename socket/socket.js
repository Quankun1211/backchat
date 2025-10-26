import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Dùng chung allowedOrigins từ server.js
const allowedOrigins = [
  "http://localhost:3000",
  "https://68fe22095ce7792a7e94ab2d--thriving-sundae-adaf5e.netlify.app",
];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Dùng chung allowedOrigins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return useSocketMap[receiverId];
};

const useSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") useSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(useSocketMap));

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    delete useSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(useSocketMap));
  });
});

export { app, io, server };
