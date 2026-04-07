const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "appointment_confirmed",
                "appointment_canceled",
                "appointment_reminder",
                "appointment_rescheduled",
            ],
            required: true,
        },
        title: { type: String, required: true },
        titleAr: { type: String },
        message: { type: String, required: true },
        messageAr: { type: String },
        isRead: { type: Boolean, default: false },
        relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
