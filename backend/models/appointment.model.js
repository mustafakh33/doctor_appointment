const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "User name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String,
      required: [true, "Appointment date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
      trim: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "cancelled", "completed"],
      default: "pending",
    },
    cancelReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);