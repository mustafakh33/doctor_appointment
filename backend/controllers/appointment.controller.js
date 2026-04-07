const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const Slot = require("../models/slot.model");
const { isPastSlot } = require("./slot.controller");

const isValidId = (id) => mongoose.isValidObjectId(id);

const buildError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const normalizeStatusInput = (status = "") => {
    const value = String(status || "").toLowerCase();
    if (value === "cancelled") return "canceled";
    return value;
};

const shapeAppointment = (appointment) => {
    const record = appointment?.toObject ? appointment.toObject() : appointment;
    if (!record) return record;

    return {
        ...record,
        status: normalizeStatusInput(record.status),
    };
};

const createAppointment = asyncHandler(async (req, res) => {
    const {
        userName,
        email,
        phone,
        notes,
        date,
        time,
        doctor,
        schedule,
        slotId,
        slot,
        timeSlot,
    } = req.body;

    if (!doctor || !isValidId(doctor)) {
        throw buildError("Valid doctor id is required", 400);
    }

    const doctorExists = await Doctor.findById(doctor).select("_id");
    if (!doctorExists) {
        throw buildError("Doctor not found", 404);
    }

    const selectedSlotId = slotId || slot || timeSlot;
    let finalDate = date;
    let finalTime = time;
    let slotDoc = null;

    if (selectedSlotId) {
        if (!isValidId(selectedSlotId)) {
            throw buildError("Invalid slot id", 400);
        }

        slotDoc = await Slot.findById(selectedSlotId);
        if (!slotDoc) {
            throw buildError("Slot not found", 404);
        }

        if (String(slotDoc.doctor) !== String(doctor)) {
            throw buildError("Slot does not belong to this doctor", 400);
        }

        if (slotDoc.isBooked) {
            throw buildError("This slot is already booked", 409);
        }

        if (isPastSlot(slotDoc.date, slotDoc.time)) {
            throw buildError("This slot is in the past", 400);
        }

        finalDate = slotDoc.date;
        finalTime = slotDoc.time;
    }

    if (!finalDate || !finalTime) {
        throw buildError("date and time are required", 400);
    }

    if (isPastSlot(finalDate, finalTime)) {
        throw buildError("Cannot book an appointment in the past", 400);
    }

    const appointment = await Appointment.create({
        userName: userName || req.user?.name || "Patient",
        email: email || req.user?.email,
        phone: phone || req.user?.phone || "",
        notes: notes || "",
        user: req.user?._id,
        date: finalDate,
        time: finalTime,
        doctor,
        schedule: schedule || undefined,
        slot: slotDoc?._id || (isValidId(slot) ? slot : undefined),
        timeSlot: isValidId(timeSlot) ? timeSlot : undefined,
        status: "pending",
    });

    if (slotDoc) {
        slotDoc.isBooked = true;
        await slotDoc.save();
    }

    const populated = await Appointment.findById(appointment._id)
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    res.status(201).json({
        success: true,
        data: shapeAppointment(populated),
    });
});

const getAllAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
        .populate("doctor")
        .populate("user", "name email phone profileImage")
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments.map(shapeAppointment),
    });
});

const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    const appointment = await Appointment.findById(id)
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    res.status(200).json({ success: true, data: shapeAppointment(appointment) });
});

const getMyAppointments = asyncHandler(async (req, res) => {
    const query = req.user?._id
        ? { $or: [{ user: req.user._id }, { email: req.user.email }] }
        : { _id: null };

    const appointments = await Appointment.find(query)
        .populate("doctor")
        .populate("user", "name email phone profileImage")
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments.map(shapeAppointment),
    });
});

const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    const updates = { ...req.body };
    if (updates.status) {
        updates.status = normalizeStatusInput(updates.status);
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    })
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    res.status(200).json({ success: true, data: shapeAppointment(appointment) });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const status = normalizeStatusInput(req.body?.status);
    const allowedStatuses = ["pending", "confirmed", "canceled", "completed"];

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    if (!allowedStatuses.includes(status)) {
        throw buildError("Invalid appointment status", 400);
    }

    const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true },
    )
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    res.status(200).json({ success: true, data: shapeAppointment(appointment) });
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reason = req.body?.reason || "";

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    appointment.status = "canceled";
    appointment.cancelReason = reason;
    await appointment.save();

    if (appointment.slot && isValidId(appointment.slot)) {
        await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });
    }

    const populated = await Appointment.findById(appointment._id)
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    res.status(200).json({ success: true, data: shapeAppointment(populated) });
});

const rescheduleAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    if (!date || !time) {
        throw buildError("date and time are required", 400);
    }

    if (isPastSlot(date, time)) {
        throw buildError("Cannot reschedule to a past time", 400);
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = "confirmed";
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
        .populate("doctor")
        .populate("user", "name email phone profileImage");

    res.status(200).json({ success: true, data: shapeAppointment(populated) });
});

const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw buildError("Appointment not found", 404);
    }

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
        throw buildError("Appointment not found", 404);
    }

    if (appointment.slot && isValidId(appointment.slot)) {
        await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });
    }

    res.status(200).json({
        success: true,
        data: {
            id,
            deleted: true,
        },
    });
});

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getMyAppointments,
    cancelAppointment,
    rescheduleAppointment,
};
