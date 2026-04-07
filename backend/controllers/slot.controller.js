const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Schedule = require("../models/schedule.model");
const Slot = require("../models/slot.model");
const Doctor = require("../models/doctor.model");

const WEEK_DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const isValidId = (id) => mongoose.isValidObjectId(id);

const throwBadRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
};

const throwNotFound = (resource = "Resource") => {
    const error = new Error(`${resource} not found`);
    error.statusCode = 404;
    throw error;
};

const toMinutes = (timeStr) => {
    const [hours, minutes] = String(timeStr).split(":").map(Number);
    return hours * 60 + minutes;
};

const toTimeString = (totalMinutes) => {
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

const getLocalDateString = (dateValue = new Date()) => {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getWeekdayKey = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return WEEK_DAYS[date.getDay()] || "";
};

const isPastSlot = (dateString, timeString) => {
    const target = new Date(`${dateString}T${timeString}:00`);
    if (Number.isNaN(target.getTime())) {
        return true;
    }
    return target.getTime() <= Date.now();
};

const getOrCreateDoctorSchedule = async (doctorId) => {
    let schedule = await Schedule.findOne({ doctor: doctorId });
    if (schedule) {
        return schedule;
    }

    const doctor = await Doctor.findById(doctorId).select("_id");
    if (!doctor) {
        throwNotFound("Doctor");
    }

    schedule = await Schedule.create({
        doctor: doctorId,
        availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        startTime: "09:00",
        endTime: "17:00",
        slotDurationMinutes: 30,
    });

    return schedule;
};

const generateDailyTimes = (schedule, dateString) => {
    const dayKey = getWeekdayKey(dateString);
    if (!dayKey) {
        return [];
    }

    const availableDays = Array.isArray(schedule?.availableDays)
        ? schedule.availableDays
        : [];

    if (!availableDays.includes(dayKey)) {
        return [];
    }

    const start = toMinutes(schedule.startTime);
    const end = toMinutes(schedule.endTime);
    const duration = Number(schedule.slotDurationMinutes || 30);

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return [];
    }

    if (!Number.isFinite(duration) || duration < 5) {
        return [];
    }

    const times = [];
    for (let current = start; current + duration <= end; current += duration) {
        times.push(toTimeString(current));
    }

    return times;
};

const getAvailableSlots = asyncHandler(async (req, res) => {
    const { doctorId, date, includeBooked } = req.query;

    if (!doctorId || !date) {
        throwBadRequest("doctorId and date are required");
    }

    if (!isValidId(doctorId)) {
        throwBadRequest("Invalid doctorId");
    }

    if (!isValidDateString(date)) {
        throwBadRequest("Date must be in YYYY-MM-DD format");
    }

    const schedule = await getOrCreateDoctorSchedule(doctorId);
    const generatedTimes = generateDailyTimes(schedule, date);

    if (!generatedTimes.length) {
        return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const existing = await Slot.find({
        doctor: doctorId,
        date,
        time: { $in: generatedTimes },
    }).select("time");

    const existingTimes = new Set(existing.map((slot) => String(slot.time)));

    const missingTimes = generatedTimes.filter((time) => !existingTimes.has(time));
    if (missingTimes.length) {
        await Slot.insertMany(
            missingTimes.map((time) => ({
                doctor: doctorId,
                date,
                time,
                isBooked: false,
            })),
            { ordered: false }
        ).catch(() => null);
    }

    await Slot.deleteMany({
        doctor: doctorId,
        date,
        time: { $nin: generatedTimes },
        isBooked: false,
    });

    const showBooked = String(includeBooked) === "true";

    let slots = await Slot.find({
        doctor: doctorId,
        date,
        time: { $in: generatedTimes },
    })
        .sort({ time: 1 })
        .lean();

    slots = slots.filter((slot) => !isPastSlot(slot.date, slot.time));

    if (!showBooked) {
        slots = slots.filter((slot) => !slot.isBooked);
    }

    res.status(200).json({ success: true, count: slots.length, data: slots });
});

module.exports = {
    getAvailableSlots,
    isPastSlot,
};
