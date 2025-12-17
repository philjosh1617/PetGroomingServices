import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= MULTER CONFIGURATION ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/user-photos";
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
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

/* ================= UPLOAD PHOTO TO GALLERY ================= */
router.post("/upload-photo", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("📤 Received photo upload request");
    console.log("File:", req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create photo URL - using relative path
    const photoUrl = `/uploads/user-photos/${req.file.filename}`;

    // Add photo to user's gallery
    user.photos.push({
      uri: photoUrl,
      uploadedAt: new Date(),
    });

    await user.save();

    // Get the newly added photo
    const newPhoto = user.photos[user.photos.length - 1];

    console.log("✅ Photo uploaded successfully:", photoUrl);

    return res.status(200).json({
      message: "Photo uploaded successfully",
      _id: newPhoto._id,
      imageUrl: photoUrl,
      uploadedAt: newPhoto.uploadedAt,
    });
  } catch (error) {
    console.error("❌ Error uploading photo:", error);
    
    // Delete uploaded file if database operation fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ message: "Failed to upload photo" });
  }
});

/* ================= GET USER PHOTOS ================= */
router.get("/photos", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("photos");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform photos to match frontend expectations
    const photos = (user.photos || []).map(photo => ({
      _id: photo._id,
      imageUrl: photo.uri,
      uploadedAt: photo.uploadedAt,
    }));

    console.log("📷 Fetched photos for user:", photos.length);

    return res.status(200).json(photos);
  } catch (error) {
    console.error("❌ Error fetching photos:", error);
    return res.status(500).json({ message: "Failed to fetch photos" });
  }
});

/* ================= DELETE PHOTO ================= */
router.delete("/photos/:photoId", authMiddleware, async (req, res) => {
  try {
    const { photoId } = req.params;

    console.log("🗑️ Deleting photo:", photoId);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the photo
    const photo = user.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete file from filesystem
    try {
      const filename = photo.uri.split("/").pop();
      const filePath = path.join(process.cwd(), "uploads", "user-photos", filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("✅ Deleted photo file:", filename);
      }
    } catch (err) {
      console.log("⚠️ Could not delete photo file:", err.message);
    }

    // Remove photo from database
    user.photos.pull(photoId);
    await user.save();

    console.log("✅ Photo removed from database");

    return res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting photo:", error);
    return res.status(500).json({ message: "Failed to delete photo" });
  }
});

export default router;