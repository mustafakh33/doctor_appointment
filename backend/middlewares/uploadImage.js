const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const categoriesUploadDir = path.join(__dirname, "..", "uploads", "categories");
const doctorsUploadDir = path.join(__dirname, "..", "uploads", "doctors");

const ensureUploadDirectories = () => {
    fs.mkdirSync(categoriesUploadDir, { recursive: true });
    fs.mkdirSync(doctorsUploadDir, { recursive: true });
};

ensureUploadDirectories();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image")) {
        cb(null, true);
        return;
    }

    cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadCategoryImage = upload.single("icon");
const uploadDoctorImage = upload.single("image");

const resizeCategoryImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }

    const imageFileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(categoriesUploadDir, imageFileName));

    req.body.icon = imageFileName;
    next();
});

const resizeDoctorImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }

    const imageFileName = `doctor-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(doctorsUploadDir, imageFileName));

    req.body.image = imageFileName;
    next();
});

module.exports = {
    uploadCategoryImage,
    uploadDoctorImage,
    resizeCategoryImage,
    resizeDoctorImage,
};