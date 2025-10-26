import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protectRoute = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Cookie jwt:", token); // Debug
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("ProtectRoute error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default protectRoute;
