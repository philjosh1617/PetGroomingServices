import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["BOY", "GIRL"],
    required: true
  },
  size: {
    type: String,
    enum: ["SMALL", "MEDIUM", "LARGE", "XLARGE"],
    required: true
  },
  medicalCondition: {
    type: String,
    default: ""
  },
  behavioralConcern: {
    type: String,
    default: ""
  },
  treat: {
    type: String,
    default: ""
  },
  rabiesExpiry: {
    type: String,
    default: ""
  },
  profileImage: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const Pet = mongoose.model("Pet", petSchema);
export default Pet;