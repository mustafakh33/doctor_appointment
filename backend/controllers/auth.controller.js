const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError");
const generateToken = require("../utils/token");
const sendEmail = require("../utils/sendEmail");

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    return user;
};

const buildAuthResponse = (userDoc) => {
    const user = sanitizeUser(userDoc);
    const token = generateToken({ id: user._id, role: user.role });

    return {
        token,
        user,
    };
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

const register = asyncHandler(async (req, res) => {
    const {
        name,
        name_ar,
        email,
        password,
        phone,
        cityArea,
        cityArea_ar,
        profileImage,
        credentials,
        role = "user",
        categoryId,
        category,
        address,
        address_ar,
        about,
        about_ar,
        year_of_experience,
        appointment_fee,
    } = req.body;

    const normalizedRole = role === "doctor" ? "doctor" : "user";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError("Email already exists", 400);
    }

    const user = await User.create({
        name,
        name_ar,
        email,
        password,
        phone,
        cityArea,
        cityArea_ar,
        profileImage,
        role: normalizedRole,
    });

    let doctorProfile = null;

    if (normalizedRole === "doctor") {
        const resolvedCategoryId = categoryId || category;
        const categoryExists = await Category.findById(resolvedCategoryId);
        if (!categoryExists) {
            await User.findByIdAndDelete(user._id);
            throw new ApiError("Invalid specialty", 400);
        }

        try {
            doctorProfile = await Doctor.create({
                name,
                name_ar,
                address,
                address_ar,
                about,
                about_ar,
                phone,
                year_of_experience,
                image: profileImage,
                credentials: normalizeCredentialList(credentials),
                categoryId: resolvedCategoryId,
                appointment_fee,
                user: user._id,
            });
        } catch (error) {
            await User.findByIdAndDelete(user._id);
            throw error;
        }
    }

    res.status(201).json({
        success: true,
        data: {
            ...buildAuthResponse(user),
            doctor: doctorProfile,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, identifier, password } = req.body;
    const loginValue = String(identifier || email || "").trim();

    const user = await User.findOne({
        $or: [
            { email: loginValue.toLowerCase() },
            { phone: loginValue },
        ],
    }).select("+password");
    if (!user) {
        throw new ApiError("Invalid email or password", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError("Invalid email or password", 401);
    }

    res.status(200).json({
        success: true,
        data: buildAuthResponse(user),
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError("No account found with this email", 404);
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.passwordResetCode = code;
    user.passwordResetExpires = expires;
    user.passwordResetVerified = false;
    await user.save({ validateBeforeSave: false });

    const text = `Your password reset code is ${code}. It expires in 10 minutes.`;

    try {
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await sendEmail({
                email,
                subject: "Password Reset Code",
                text,
                html: `<p>${text}</p>`,
            });
        }
    } catch (error) {
        // Keep response shape stable for frontend; expose transport issues only in logs.
        console.error("Failed to send reset email:", error.message);
    }

    res.status(200).json({
        success: true,
        data: {
            email,
            message: "Reset code sent",
            ...(process.env.NODE_ENV !== "production" ? { code } : {}),
        },
    });
});

const verifyResetCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email }).select(
        "+passwordResetCode +passwordResetExpires +passwordResetVerified"
    );

    if (!user) {
        throw new ApiError("No account found with this email", 404);
    }

    const isExpired = !user.passwordResetExpires || user.passwordResetExpires < new Date();
    const isInvalid = !user.passwordResetCode || user.passwordResetCode !== String(code);

    if (isExpired || isInvalid) {
        throw new ApiError("Invalid or expired reset code", 400);
    }

    user.passwordResetVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: {
            email,
            verified: true,
        },
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email }).select(
        "+password +passwordResetCode +passwordResetExpires +passwordResetVerified"
    );

    if (!user) {
        throw new ApiError("No account found with this email", 404);
    }

    const isExpired = !user.passwordResetExpires || user.passwordResetExpires < new Date();
    const isInvalidCode = !user.passwordResetCode || user.passwordResetCode !== String(code);

    if (isExpired || isInvalidCode || !user.passwordResetVerified) {
        throw new ApiError("Reset code is not verified or has expired", 400);
    }

    user.password = password;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            message: "Password reset successfully",
        },
    });
});

module.exports = {
    register,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
};