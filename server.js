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

const allowedOrigins = [
  "http://localhost:3000",
  "https://68fe3546114e4e61ba0fdbd1--stellular-mousse-67013d.netlify.app",
  "https://stellular-mousse-67013d.netlify.app"
];


// Cấu hình CORS cho Express
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin); // Debug origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// BẮT BUỘC: Xử lý preflight request
app.options("*", cors()); // Hoặc để mặc định trong cors() là đủ


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
