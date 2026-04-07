const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getMe, updateMe } = require("../controllers/user.controller");
const {
    uploadProfileAssets,
    processProfileAssets,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/me", protect, getMe);
router.patch("/me", protect, uploadProfileAssets, processProfileAssets, updateMe);

module.exports = router;
