const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format"],
        },
        isBooked: {
            type: Boolean,
            default: false,
        },
    }
);

const scheduleSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: [true, "Doctor reference is required"],
            unique: true,
        },
        availableDays: {
            type: [String],
            required: [true, "Available days are required"],
            validate: {
                validator: function (days) {
                    return Array.isArray(days) && days.length > 0;
                },
                message: "At least one available day is required",
            },
            enum: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ],
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:mm format"],
        },
        endTime: {
            type: String,
            required: [true, "End time is required"],
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format"],
        },
        slotDurationMinutes: {
            type: Number,
            default: 30,
            min: [5, "Slot duration must be at least 5 minutes"],
        },
        timeSlots: {
            type: [timeSlotSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

const toTimeString = (totalMinutes) => {
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return hours + ":" + minutes;
};

scheduleSchema.methods.generateTimeSlots = function () {
    const start = toMinutes(this.startTime);
    const end = toMinutes(this.endTime);

    if (end <= start) {
        throw new Error("End time must be after start time");
    }

    const existingSlots = new Map(
        (this.timeSlots || []).map((slot) => [slot.time, Boolean(slot.isBooked)])
    );

    const generatedSlots = [];
    for (let current = start; current + this.slotDurationMinutes <= end; current += this.slotDurationMinutes) {
        const time = toTimeString(current);
        generatedSlots.push({
            time,
            isBooked: existingSlots.get(time) || false,
        });
    }

    this.timeSlots = generatedSlots;
};

scheduleSchema.pre("validate", function () {
    if (
        this.isModified("startTime") ||
        this.isModified("endTime") ||
        this.isModified("slotDurationMinutes") ||
        this.isNew
    ) {
        this.generateTimeSlots();
    }
});

module.exports = mongoose.model("Schedule", scheduleSchema);
