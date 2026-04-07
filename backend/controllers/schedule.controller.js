const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Schedule = require("../models/schedule.model");
const Doctor = require("../models/doctor.model");

const RESOURCE_NAME = "Schedule";

const isValidId = (id) => mongoose.isValidObjectId(id);

const throwNotFound = (resource = RESOURCE_NAME) => {
    const error = new Error(resource + " not found");
    error.statusCode = 404;
    throw error;
};

const throwBadRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
};

const resolveDoctorId = async (req) => {
    if (req.user && req.user.role === "doctor") {
        const doctor = await Doctor.findOne({ user: req.user._id }).select("_id");
        if (!doctor) {
            throwNotFound("Doctor profile");
        }
        return doctor._id;
    }

    if (!req.body.doctor && !req.params.doctorId) {
        throwBadRequest("Doctor id is required");
    }

    const doctorId = req.body.doctor || req.params.doctorId;

    if (!isValidId(doctorId)) {
        throwBadRequest("Invalid doctor id");
    }

    const doctor = await Doctor.findById(doctorId).select("_id");
    if (!doctor) {
        throwNotFound("Doctor");
    }

    return doctor._id;
};

const setWorkingHours = asyncHandler(async (req, res) => {
    const { availableDays, startTime, endTime, slotDurationMinutes } = req.body;
    const doctorId = await resolveDoctorId(req);

    if (!availableDays || !startTime || !endTime) {
        throwBadRequest("availableDays, startTime, and endTime are required");
    }

    let schedule = await Schedule.findOne({ doctor: doctorId });

    if (!schedule) {
        schedule = new Schedule({ doctor: doctorId });
    }

    schedule.availableDays = availableDays;
    schedule.startTime = startTime;
    schedule.endTime = endTime;

    if (slotDurationMinutes) {
        schedule.slotDurationMinutes = slotDurationMinutes;
    }

    schedule.generateTimeSlots();
    await schedule.save();

    res.status(200).json({ success: true, data: schedule });
});

const generateTimeSlots = asyncHandler(async (req, res) => {
    const doctorId = await resolveDoctorId(req);
    const schedule = await Schedule.findOne({ doctor: doctorId });

    if (!schedule) {
        throwNotFound();
    }

    schedule.generateTimeSlots();
    await schedule.save();

    res.status(200).json({ success: true, data: schedule });
});

const getDoctorSchedule = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!isValidId(doctorId)) {
        throwBadRequest("Invalid doctor id");
    }

    let schedule = await Schedule.findOne({ doctor: doctorId }).populate("doctor", "name categoryId");

    if (!schedule) {
        const doctor = await Doctor.findById(doctorId).select("_id name categoryId");
        if (!doctor) {
            throwNotFound("Doctor");
        }

        // Ensure patients can book even when doctor schedule is not configured yet.
        // Doctor/admin can still update these defaults later from dashboard.
        schedule = await Schedule.create({
            doctor: doctor._id,
            availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            startTime: "09:00",
            endTime: "17:00",
            slotDurationMinutes: 30,
        });

        schedule = await Schedule.findById(schedule._id).populate("doctor", "name categoryId");
    }

    res.status(200).json({ success: true, data: schedule });
});

module.exports = {
    setWorkingHours,
    generateTimeSlots,
    getDoctorSchedule,
};
