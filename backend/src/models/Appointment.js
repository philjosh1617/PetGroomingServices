import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  // Reference to user who booked
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Reference to pet
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true
  },
  
  // Services selected (array of service objects)
  services: [{
    serviceName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  
  // Appointment details
  appointmentDate: {
    type: String, // "Nov 11, 2025"
    required: true
  },
  
  appointmentTime: {
    type: String, // "10:00 AM - 12:00 PM"
    required: true
  },
  
  // Total amount
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ["CREDIT_CARD", "OVER_THE_COUNTER"],
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },
  
  // Appointment status
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLAIMED"],
    default: "PENDING"
  },
  
  // Admin notes (optional)
  adminNotes: {
    type: String,
    default: ""
  },
  
  // Cancellation reason (if cancelled)
  cancellationReason: {
    type: String,
    default: ""
  }
  
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;