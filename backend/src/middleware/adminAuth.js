import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user to check admin status
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.userId = decoded.userId;
    req.isAdmin = true;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};