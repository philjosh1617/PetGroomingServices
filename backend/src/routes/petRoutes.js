import express from "express";
import multer from "multer";
import path from "path";
import Pet from "../models/Pet.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pets/"); // ✅ Ensure trailing slash
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/* ================= GET PETS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.userId });
    console.log(`✅ Found ${pets.length} pets for user ${req.userId}`);
    res.status(200).json(pets);
  } catch (error) {
    console.error("Get pets error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ================= ADD PET ================= */
router.post(
  "/",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const {
        name,
        breed,
        age,
        gender,
        size,
        medicalCondition,
        behavioralConcern,
        treat,
        rabiesExpiry,
      } = req.body;

      if (!name || !breed || !size) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      // ✅ Fix: Ensure proper path construction with forward slash
      const imageUrl = req.file
        ? `http://192.168.100.19:3000/uploads/pets/${req.file.filename}` // Note the slash after 'pets'
        : "";

      console.log("📷 Image uploaded:", {
        filename: req.file?.filename,
        path: req.file?.path,
        imageUrl: imageUrl
      });

      const pet = new Pet({
        userId: req.userId,
        name,
        breed,
        age,
        gender,
        size,
        medicalCondition,
        behavioralConcern,
        treat,
        rabiesExpiry,
        profileImage: imageUrl,
      });

      await pet.save();
      console.log("✅ Pet created successfully:", pet);
      res.status(201).json(pet);
    } catch (error) {
      console.error("❌ Create pet error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


/* ================= UPDATE PET ================= */
router.put(
  "/:petId",
  authMiddleware,
  upload.single("profileImage"), // optional image update
  async (req, res) => {
    try {
      const { petId } = req.params;

      const updatedData = {
        name: req.body.name,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        size: req.body.size,
        medicalCondition: req.body.medicalCondition,
        behavioralConcern: req.body.behavioralConcern,
        treat: req.body.treat,
        rabiesExpiry: req.body.rabiesExpiry,
      };

      // ✅ If user uploads a new image, replace it
      if (req.file) {
        updatedData.profileImage = `http://192.168.100.19:3000/uploads/pets/${req.file.filename}`;
      }

      const pet = await Pet.findOneAndUpdate(
        { _id: petId, userId: req.userId }, // 🔐 security check
        updatedData,
        { new: true }
      );

      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      console.log("✅ Pet updated:", pet._id);
      res.status(200).json(pet);
    } catch (error) {
      console.error("❌ Update pet error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);



/* ================= DELETE PET ================= */
router.delete("/:petId", authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.petId,
      userId: req.userId,
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    console.log("✅ Pet deleted:", req.params.petId);
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("❌ Delete pet error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;