import path from 'path';
import connect from "./db/connectDB.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRouts.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();

// Thêm route gốc để Render không log 404 liên tục
app.get("/", (req, res) => {
  res.status(200).json({ message: "Chat API is running!" });
});

app.use(
  cors({
    origin: [
      `http://localhost:3000`, // Sửa: frontend thường chạy trên 3000, không phải 5000
      "https://68ee71790278f06dc181d881--tranquil-bonbon-41a99c.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);

// Nếu sau này muốn serve frontend từ cùng backend (tùy chọn)
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
  connect();
  console.log(`Server Running on port ${PORT}`);
});
