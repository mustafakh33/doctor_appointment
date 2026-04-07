const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const ApiError = require("../utils/apiError");

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    return user;
};

const normalizeCredentialList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
};

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const doctorProfile = user.role === "doctor"
        ? await Doctor.findOne({ user: user._id })
        : null;

    res.status(200).json({
        success: true,
        data: {
            ...sanitizeUser(user),
            ...(doctorProfile ? { doctor: doctorProfile } : {}),
        },
    });
});

const updateMe = asyncHandler(async (req, res) => {
    const updates = {
        name: req.body.name,
        name_ar: req.body.name_ar,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        cityArea: req.body.cityArea,
        cityArea_ar: req.body.cityArea_ar,
    };

    Object.keys(updates).forEach((key) => {
        if (updates[key] === undefined) delete updates[key];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    let doctorProfile = null;

    if (user.role === "doctor") {
        const doctorUpdates = {};

        if (req.body.profileImage !== undefined) {
            doctorUpdates.image = req.body.profileImage;
        }

        if (req.body.credentials !== undefined) {
            doctorUpdates.credentials = normalizeCredentialList(req.body.credentials);
        }

        if (Object.keys(doctorUpdates).length) {
            doctorProfile = await Doctor.findOneAndUpdate(
                { user: req.user._id },
                doctorUpdates,
                { new: true, runValidators: true }
            );
        } else {
            doctorProfile = await Doctor.findOne({ user: req.user._id });
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...sanitizeUser(user),
            ...(doctorProfile ? { doctor: doctorProfile } : {}),
        },
    });
});

module.exports = {
    getMe,
    updateMe,
};
