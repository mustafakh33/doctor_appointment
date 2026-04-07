const express = require("express");
const validate = require("../middlewares/validate.middleware");
const {
    uploadProfileAssets,
    processProfileAssets,
} = require("../middlewares/upload.middleware");
const {
    registerSchema,
    loginSchema,
} = require("../utils/validators/auth.validator");
const {
    register,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post(
    "/register",
    uploadProfileAssets,
    processProfileAssets,
    validate(registerSchema),
    register
);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
