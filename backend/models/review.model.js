const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            minlength: [2, "User name must be at least 2 characters long"],
        },
        userName_ar: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        userProfileImage: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: [true, "Doctor is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating cannot be below 1"],
            max: [5, "Rating cannot exceed 5"],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index({ user: 1, doctor: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (doctorId) {
    const result = await this.aggregate([
        { $match: { doctor: doctorId } },
        {
            $group: {
                _id: "$doctor",
                avgRating: { $avg: "$rating" },
                numRatings: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
            ratingsAverage: result[0].avgRating,
            ratingsQuantity: result[0].numRatings,
        });
    } else {
        await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post("save", async function () {
    await this.constructor.calculateAverageRating(this.doctor);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await doc.constructor.calculateAverageRating(doc.doctor);
    }
});

module.exports = mongoose.model("Review", reviewSchema);