const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Review = require("../models/review.model");
const Appointment = require("../models/appointment.model");

const RESOURCE_NAME = "Review";

const isValidId = (id) => mongoose.isValidObjectId(id);

const throwNotFound = (resource = RESOURCE_NAME) => {
    const error = new Error(`${resource} not found`);
    error.statusCode = 404;
    throw error;
};

const throwBadRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
};

const buildAbsoluteUserImageUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }

    const baseUrl = String(process.env.BASE_URL || "").replace(/\/$/, "");
    if (!baseUrl) return value;

    if (value.startsWith("/")) {
        return `${baseUrl}${value}`;
    }

    if (value.startsWith("uploads/")) {
        return `${baseUrl}/${value}`;
    }

    return `${baseUrl}/uploads/users/${value}`;
};

const normalizeReviewResponse = (reviewDoc) => {
    if (!reviewDoc) return reviewDoc;

    const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;
    const populatedUserImage = buildAbsoluteUserImageUrl(review?.user?.profileImage || "");
    const fallbackUserImage = buildAbsoluteUserImageUrl(review?.userProfileImage || "");
    const normalizedUserImage = populatedUserImage || fallbackUserImage;

    if (review.user && typeof review.user === "object") {
        review.user.profileImage = normalizedUserImage;
    }

    review.userProfileImage = normalizedUserImage;
    return review;
};

const createReview = asyncHandler(async (req, res) => {
    if (!req.user) {
        throwBadRequest("Authentication is required to create a review");
    }

    const { doctor } = req.body;

    if (!doctor || !isValidId(doctor)) {
        throwBadRequest("Valid doctor id is required");
    }

    const completedAppointment = await Appointment.findOne({
        doctor,
        status: "completed",
        $or: [
            { user: req.user._id },
            { email: req.user.email },
        ],
    }).select("_id");

    if (!completedAppointment) {
        throwBadRequest("You can review a doctor only after a completed appointment");
    }

    try {
        const payload = {
            ...req.body,
            user: req.user._id,
            userName: req.user.name,
            userName_ar: req.user.name_ar || "",
            email: req.user.email,
            userProfileImage: req.user.profileImage || "",
        };

        const review = await Review.create(payload);
        const populatedReview = await Review.findById(review._id)
            .populate("doctor", "name")
            .populate("user", "name name_ar profileImage");

        res.status(201).json({ success: true, data: normalizeReviewResponse(populatedReview) });
    } catch (error) {
        if (error && error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "You have already reviewed this doctor",
            });
            return;
        }

        throw error;
    }
});

const getReviewsByDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!isValidId(doctorId)) {
        throwNotFound("Doctor");
    }

    const reviews = await Review.find({ doctor: doctorId })
        .populate("doctor", "name")
        .populate("user", "name name_ar profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews.map((review) => normalizeReviewResponse(review)),
    });
});

const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
        .populate("doctor", "name")
        .populate("user", "name name_ar profileImage");

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews.map((review) => normalizeReviewResponse(review)),
    });
});

const getReviewById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const review = await Review.findById(id)
        .populate("doctor", "name")
        .populate("user", "name name_ar profileImage");

    if (!review) {
        throwNotFound();
    }

    res.status(200).json({ success: true, data: normalizeReviewResponse(review) });
});

const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const review = await Review.findByIdAndUpdate(
        id,
        { rating, comment },
        { new: true, runValidators: true }
    );

    if (!review) {
        throwNotFound();
    }

    await Review.calculateAverageRating(review.doctor);

    const populatedReview = await Review.findById(review._id)
        .populate("doctor", "name")
        .populate("user", "name name_ar profileImage");

    res.status(200).json({ success: true, data: normalizeReviewResponse(populatedReview) });
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        throwNotFound();
    }

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});

module.exports = {
    createReview,
    getReviewsByDoctor,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};