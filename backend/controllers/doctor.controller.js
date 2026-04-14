const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctor.model");
const Category = require("../models/category.model");
const Review = require("../models/review.model");
const { normalizeReviewListResponse } = require("../utils/normalizeReview");

const RESOURCE_NAME = "Doctor";
const CATEGORY_PROJECTION = "name name_en name_ar image icon";

const isValidId = (id) => mongoose.isValidObjectId(id);

const throwNotFound = (resource = RESOURCE_NAME) => {
    const error = new Error(`${resource} not found`);
    error.statusCode = 404;
    throw error;
};

const normalizeDoctorResponse = (doctorDoc) => {
    if (!doctorDoc) return doctorDoc;
    const doctor = doctorDoc.toObject ? doctorDoc.toObject() : doctorDoc;

    if (doctor.categoryId && typeof doctor.categoryId === "object") {
        doctor.category = doctor.categoryId;
    }

    return doctor;
};

const createDoctor = asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    payload.categoryId = payload.categoryId || payload.category;
    delete payload.category;

    const doctor = await Doctor.create(payload);
    await Category.findByIdAndUpdate(doctor.categoryId, {
        $addToSet: { doctors: doctor._id },
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
        "categoryId",
        CATEGORY_PROJECTION
    );

    res.status(201).json({ success: true, data: normalizeDoctorResponse(populatedDoctor) });
});

const getAllDoctors = asyncHandler(async (req, res) => {
    const { categoryId } = req.query;
    const filter = {};

    if (categoryId && isValidId(categoryId)) {
        filter.categoryId = categoryId;
    }

    const doctors = await Doctor.find(filter).populate("categoryId", CATEGORY_PROJECTION);
    res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors.map((doctor) => normalizeDoctorResponse(doctor)),
    });
});

const getDoctorById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const doctor = await Doctor.findById(id).populate("categoryId", CATEGORY_PROJECTION);

    if (!doctor) {
        throwNotFound();
    }

    const reviews = await Review.find({ doctor: id })
        .populate("user", "name name_ar profileImage")
        .populate("doctor", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: {
            ...normalizeDoctorResponse(doctor),
            reviews: normalizeReviewListResponse(reviews),
        },
    });
});

const updateDoctor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const existingDoctor = await Doctor.findById(id).select("_id categoryId");
    if (!existingDoctor) {
        throwNotFound();
    }

    const payload = { ...req.body };
    payload.categoryId = payload.categoryId || payload.category;
    delete payload.category;

    const doctor = await Doctor.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("categoryId", CATEGORY_PROJECTION);

    if (String(existingDoctor.categoryId) !== String(doctor.categoryId)) {
        await Promise.all([
            Category.findByIdAndUpdate(existingDoctor.categoryId, {
                $pull: { doctors: doctor._id },
            }),
            Category.findByIdAndUpdate(doctor.categoryId, {
                $addToSet: { doctors: doctor._id },
            }),
        ]);
    }

    res.status(200).json({ success: true, data: normalizeDoctorResponse(doctor) });
});

const deleteDoctor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throwNotFound();
    }

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
        throwNotFound();
    }

    await Category.findByIdAndUpdate(doctor.categoryId, {
        $pull: { doctors: doctor._id },
    });

    res.status(200).json({
        success: true,
        message: `${RESOURCE_NAME} deleted successfully`,
        data: doctor,
    });
});

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};