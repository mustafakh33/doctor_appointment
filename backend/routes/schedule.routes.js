const express = require("express");
const {
    setWorkingHours,
    generateTimeSlots,
    getDoctorSchedule,
} = require("../controllers/schedule.controller");
const { protect, allowedTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/doctor/:doctorId").get(getDoctorSchedule);
router.route("/").post(protect, allowedTo("doctor", "admin"), setWorkingHours);
router.route("/generate-slots").post(protect, allowedTo("doctor", "admin"), generateTimeSlots);

module.exports = router;
