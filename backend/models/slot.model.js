const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: [true, "Doctor reference is required"],
            index: true,
        },
        date: {
            type: String,
            required: [true, "Slot date is required"],
            match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
            index: true,
        },
        time: {
            type: String,
            required: [true, "Slot time is required"],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format"],
            index: true,
        },
        isBooked: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

slotSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
