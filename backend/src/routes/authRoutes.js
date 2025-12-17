import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createNotification } from "./notificationRoutes.js";

const router = express.Router();

/* ================= TOKEN ================= */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

/* ================= REGISTER WITH WELCOME NOTIFICATION ================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 6) {
      return res
        .status(400)
        .json({ message: "Username should be at least 6 characters long" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email Address already used" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already used" });
    }

    const profileImage = `https://api.dicebear.com/9.x/croodles/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    // ✅ Send welcome notification
    await createNotification(
      user._id,
      "WELCOME",
      "Welcome to HappyPaws! 🐾",
      `Hi ${username}! We're so glad to have you. Let's make today pawsome for you and your furry friend!`
    );

    // ✅ Send promotional notification after 3 seconds
    setTimeout(async () => {
      await createNotification(
        user._id,
        "PROMOTION",
        "Special Welcome Offer! 🎉",
        "Enjoy 20% off on your first grooming session — treat your pup to a fresh new look today!"
      );
    }, 3000);

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    // ❌ EMAIL NOT FOUND
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    // ❌ WRONG PASSWORD
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ SUCCESS
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin,
      photos: user.photos,
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: req.userId },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Check if email is already taken by another user
    if (email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: req.userId },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ================= MULTER CONFIGURATION ================= */
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/profile-pictures";
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

/* ================= UPLOAD PROFILE IMAGE ================= */
router.post("/upload-profile-image", authMiddleware, uploadProfile.single("image"), async (req, res) => {
  try {
    console.log("📤 Received profile image upload request");
    console.log("File:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if it exists and is not the default dicebear image
    if (user.profileImage && !user.profileImage.includes("dicebear.com")) {
      try {
        // Extract filename from URL
        const oldFilename = user.profileImage.split("/").pop();
        const oldFilePath = path.join(process.cwd(), "uploads", "profile-pictures", oldFilename);
        
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("🗑️ Deleted old profile picture:", oldFilename);
        }
      } catch (err) {
        console.log("⚠️ Could not delete old profile picture:", err.message);
      }
    }

    // Create image URL - using relative path
    const imageUrl = `/uploads/profile-pictures/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();

    console.log("✅ Profile picture saved:", imageUrl);

    return res.status(200).json({
      message: "Profile picture updated successfully",
      imageUrl,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    
    // Delete uploaded file if database operation fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ message: "Failed to upload profile picture" });
  }
});

export default router;