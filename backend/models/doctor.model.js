const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Doctor name is required"],
            trim: true,
            minlength: [2, "Doctor name must be at least 2 characters long"],
        },
        name_ar: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Doctor address is required"],
            trim: true,
            minlength: [5, "Doctor address must be at least 5 characters long"],
        },
        address_ar: {
            type: String,
            trim: true,
        },
        location: {
            address: {
                type: String,
                trim: true,
            },
            coordinates: {
                type: [Number],
                validate: {
                    validator: function (value) {
                        return !value || value.length === 2;
                    },
                    message: "Location coordinates must contain [longitude, latitude]",
                },
            },
        },
        about: {
            type: String,
            required: [true, "Doctor about section is required"],
            trim: true,
            minlength: [10, "Doctor about section must be at least 10 characters long"],
        },
        about_ar: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        phone: {
            type: String,
            required: [true, "Doctor phone is required"],
            trim: true,
        },
        year_of_experience: {
            type: Number,
            required: [true, "Year of experience is required"],
            min: [0, "Year of experience cannot be negative"],
        },
        image: {
            type: String,
            trim: true,
        },
        credentials: [
            {
                type: String,
                trim: true,
            },
        ],
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Doctor category is required"],
        },
        appointment_fee: {
            type: Number,
            required: [true, "Appointment fee is required"],
            min: [0, "Appointment fee cannot be negative"],
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [0, "Rating must be above 0"],
            max: [5, "Rating must be below 5"],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [0, "Ratings quantity cannot be negative"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

doctorSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id",
    justOne: true,
});

doctorSchema.index({ "location.coordinates": "2dsphere" });

const setDoctorImageUrl = (doc) => {
    if (!doc) return;

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) return;

    if (doc.image && !String(doc.image).startsWith("http")) {
        doc.image = baseUrl + "/uploads/doctors/" + doc.image;
    }

    if (Array.isArray(doc.credentials)) {
        doc.credentials = doc.credentials.map((fileName) => {
            if (!fileName || String(fileName).startsWith("http")) {
                return fileName;
            }

            return `${baseUrl}/uploads/credentials/${fileName}`;
        });
    }
};

doctorSchema.post("init", (doc) => {
    setDoctorImageUrl(doc);
});

doctorSchema.post("save", (doc) => {
    setDoctorImageUrl(doc);
});

module.exports = mongoose.model("Doctor", doctorSchema);