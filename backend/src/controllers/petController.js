import Pet from "../models/Pet.js";

export const createPet = async (req, res) => {
  try {
    const pet = new Pet({
      userId: req.userId, // ✅ MUST match routes
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      gender: req.body.gender,
      size: req.body.size,
      medicalCondition: req.body.medicalCondition,
      behavioralConcern: req.body.behavioralConcern,
      treat: req.body.treat,
      rabiesExpiry: req.body.rabiesExpiry,
      profileImage: req.file
        ? `http://192.168.100.19:3000/uploads/pets/${req.file.filename}`
        : "",
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error("Create pet error:", error);
    res.status(500).json({ message: "Failed to create pet" });
  }
};
