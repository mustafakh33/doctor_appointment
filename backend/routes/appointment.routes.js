const express = require("express");
const {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getMyAppointments,
    cancelAppointment,
    rescheduleAppointment,
} = require("../controllers/appointment.controller");
const { protect, allowedTo } = require("../middlewares/auth.middleware");

const router = express.Router();

// Protected routes (require login)
router.route("/my").get(protect, allowedTo("user"), getMyAppointments);
router
    .route("/:id/cancel")
    .patch(protect, allowedTo("doctor", "admin"), cancelAppointment);
router
    .route("/:id/status")
    .patch(protect, allowedTo("doctor", "admin"), updateAppointmentStatus);
router
    .route("/:id/reschedule")
    .patch(protect, allowedTo("doctor", "admin"), rescheduleAppointment);

// Public/general routes
router.route("/").get(getAllAppointments).post(protect, allowedTo("user"), createAppointment);
router
    .route("/:id")
    .get(getAppointmentById)
    .patch(protect, allowedTo("doctor", "admin"), updateAppointment)
    .delete(deleteAppointment);

module.exports = router;
