const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const uploadsRoot = path.join(__dirname, "..", "uploads");
const uploadFolders = {
    categories: path.join(uploadsRoot, "categories"),
    doctors: path.join(uploadsRoot, "doctors"),
    users: path.join(uploadsRoot, "users"),
    credentials: path.join(uploadsRoot, "credentials"),
};

Object.values(uploadFolders).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
            cb(null, true);
            return;
        }

        cb(new Error("Only image files are allowed"), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const mixedUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const mimeType = String(file.mimetype || "");
        const isImage = mimeType.startsWith("image/");
        const isPdf = mimeType === "application/pdf";

        if (isImage || isPdf) {
            cb(null, true);
            return;
        }

        cb(new Error("Only image or PDF files are allowed"), false);
    },
    limits: { fileSize: 8 * 1024 * 1024 },
});

const uploadCategoryImage = upload.single("icon");
const uploadDoctorImage = upload.single("image");
const uploadUserImage = upload.single("profileImage");
const uploadProfileAssets = mixedUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "credentials", maxCount: 5 },
]);

const createResizeMiddleware = ({ fieldName, folderName, size = 500 }) =>
    asyncHandler(async (req, res, next) => {
        if (!req.file) {
            next();
            return;
        }

        const fileName = `${fieldName}-${uuidv4()}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(size, size)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path.join(uploadFolders[folderName], fileName));

        req.body[fieldName] = fileName;
        next();
    });

const resizeCategoryImage = createResizeMiddleware({ fieldName: "icon", folderName: "categories", size: 500 });
const resizeDoctorImage = createResizeMiddleware({ fieldName: "image", folderName: "doctors", size: 500 });
const resizeUserImage = createResizeMiddleware({ fieldName: "profileImage", folderName: "users", size: 500 });

const credentialMimeToExt = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const resolveCredentialExt = (file) => {
    const mimeType = String(file?.mimetype || "");
    if (credentialMimeToExt[mimeType]) {
        return credentialMimeToExt[mimeType];
    }

    const fromOriginalName = path.extname(String(file?.originalname || "")).toLowerCase();
    return fromOriginalName || ".bin";
};

const processProfileAssets = asyncHandler(async (req, res, next) => {
    const fileMap = req.files || {};

    const profileImageFile = Array.isArray(fileMap.profileImage) ? fileMap.profileImage[0] : null;
    if (profileImageFile) {
        const fileName = `profileImage-${uuidv4()}-${Date.now()}.jpeg`;

        await sharp(profileImageFile.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path.join(uploadFolders.users, fileName));

        req.body.profileImage = fileName;
    }

    const credentialFiles = Array.isArray(fileMap.credentials) ? fileMap.credentials : [];
    if (credentialFiles.length) {
        const savedCredentials = [];

        for (const file of credentialFiles) {
            const extension = resolveCredentialExt(file);
            const fileName = `credential-${uuidv4()}-${Date.now()}${extension}`;

            await fs.promises.writeFile(
                path.join(uploadFolders.credentials, fileName),
                file.buffer
            );

            savedCredentials.push(fileName);
        }

        req.body.credentials = savedCredentials;
    }

    next();
});

module.exports = {
    uploadCategoryImage,
    uploadDoctorImage,
    uploadUserImage,
    uploadProfileAssets,
    resizeCategoryImage,
    resizeDoctorImage,
    resizeUserImage,
    processProfileAssets,
};