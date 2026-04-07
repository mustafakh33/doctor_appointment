const express = require("express");
const { protect, allowedTo } = require("../middlewares/auth.middleware");
const {
    getDashboard,
    updateAppointmentStatus,
    getDoctorAppointments,
    getDoctorPatients,
    updateDoctorProfile,
} = require("../controllers/doctor.dashboard.controller");
const {
    uploadProfileAssets,
    processProfileAssets,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(protect, allowedTo("doctor"));

router.get("/dashboard", getDashboard);
router.get("/bookings", getDoctorAppointments);
router.get("/patients", getDoctorPatients);
router.patch("/profile", uploadProfileAssets, processProfileAssets, updateDoctorProfile);
router.patch("/appointments/:id/status", updateAppointmentStatus);

module.exports = router;