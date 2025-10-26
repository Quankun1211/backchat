import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

// Dùng chung allowedOrigins
const allowedOrigins = [
  "http://localhost:3000",
  "https://68fe22095ce7792a7e94ab2d--thriving-sundae-adaf5e.netlify.app",
  "https://68fe379b114e4e6ea20fdb58--golden-brigadeiros-c5bc0e.netlify.app", // Thêm origin mới
  "https://stellular-mousse-67013d.netlify.app",
  "https://golden-brigadeiros-c5bc0e.netlify.app",
  "https://68fe3c73d22b697a431602ed--imaginative-creponne-1f6f19.netlify.app",
  "https://imaginative-creponne-1f6f19.netlify.app"
];

// Cấu hình CORS cho HTTP API
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);
app.use(express.json());

// Cấu hình Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Dùng chung allowedOrigins
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Quản lý userSocketMap
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Hàm lấy socket ID của receiver
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || null; // Trả về null nếu không tìm thấy
};

export { app, io, server };
