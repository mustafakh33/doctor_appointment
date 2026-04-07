const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");
const Schedule = require("../models/schedule.model");

const STATUSES = ["pending", "confirmed", "canceled", "completed"];

const resolveDoctorProfile = async (user) => {
    if (!user) return null;

    let doctor = await Doctor.findOne({ user: user._id }).populate("categoryId");
    if (doctor) return doctor;

    if (user.name) {
        doctor = await Doctor.findOne({ name: user.name }).populate("categoryId");
    }

    return doctor;
};

const getDoctorAppointments = asyncHandler(async (req, res) => {
    const doctor = await resolveDoctorProfile(req.user);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
        });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
        .populate("user", "name email phone profileImage")
        .populate("doctor")
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
});

const getDoctorPatients = asyncHandler(async (req, res) => {
    const doctor = await resolveDoctorProfile(req.user);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
        });
    }

    const patients = await Appointment.aggregate([
        { $match: { doctor: new mongoose.Types.ObjectId(doctor._id) } },
        {
            $group: {
                _id: {
                    user: "$user",
                    email: "$email",
                    userName: "$userName",
                    phone: "$phone",
                },
                count: { $sum: 1 },
                latestDate: { $max: "$createdAt" },
            },
        },
        { $sort: { latestDate: -1 } },
    ]);

    res.status(200).json({
        success: true,
        count: patients.length,
        data: patients.map((item) => ({
            id: item._id.user || item._id.email,
            name: item._id.userName || item._id.email || "Patient",
            email: item._id.email || "",
            phone: item._id.phone || "",
            appointmentsCount: item.count,
            latestDate: item.latestDate,
        })),
    });
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
    const doctor = await resolveDoctorProfile(req.user);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
        });
    }

    const userUpdates = {};
    const doctorUpdates = {};

    ["name", "phone", "cityArea", "profileImage"].forEach((key) => {
        if (req.body[key] !== undefined) {
            userUpdates[key] = req.body[key];
        }
    });

    ["name", "address", "about", "categoryId", "category", "appointment_fee", "year_of_experience", "image", "credentials"].forEach((key) => {
        if (req.body[key] !== undefined) {
            doctorUpdates[key] = req.body[key];
        }
    });

    if (doctorUpdates.category && !doctorUpdates.categoryId) {
        doctorUpdates.categoryId = doctorUpdates.category;
    }
    delete doctorUpdates.category;

    if (doctorUpdates.credentials && typeof doctorUpdates.credentials === "string") {
        try {
            doctorUpdates.credentials = JSON.parse(doctorUpdates.credentials);
        } catch {
            doctorUpdates.credentials = [];
        }
    }

    if (doctorUpdates.year_of_experience !== undefined) {
        doctorUpdates.year_of_experience = Number(doctorUpdates.year_of_experience);
    }

    if (doctorUpdates.appointment_fee !== undefined) {
        doctorUpdates.appointment_fee = Number(doctorUpdates.appointment_fee);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, userUpdates, {
        new: true,
        runValidators: true,
    });

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctor._id, doctorUpdates, {
        new: true,
        runValidators: true,
    }).populate("categoryId");

    if (!updatedUser || !updatedDoctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
        });
    }

    res.status(200).json({
        success: true,
        data: {
            ...updatedUser.toObject(),
            doctor: updatedDoctor,
        },
    });
});

const getDashboard = asyncHandler(async (req, res) => {
    const doctor = await resolveDoctorProfile(req.user);

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
        });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
        .populate("user", "name email phone")
        .populate("doctor")
        .sort({ createdAt: -1 })
        .lean();

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(`${appointment.date}T00:00:00`);
        return appointmentDate >= todayStart && appointmentDate < tomorrowStart;
    });

    const upcomingAppointments = appointments.filter((appointment) => {
        const appointmentDateTime = new Date(`${appointment.date}T${String(appointment.time || "00:00").replace(" PM", "").replace(" AM", "")}`);
        return appointment.status !== "canceled" && appointmentDateTime >= now;
    });

    const appointmentsByStatus = STATUSES.reduce((accumulator, status) => {
        accumulator[status] = appointments.filter((appointment) => appointment.status === status).length;
        return accumulator;
    }, {});

    const monthlyRaw = await Appointment.aggregate([
        { $match: { doctor: new mongoose.Types.ObjectId(doctor._id) } },
        {
            $group: {
                _id: {
                    year: { $year: { $dateFromString: { dateString: "$date" } } },
                    month: { $month: { $dateFromString: { dateString: "$date" } } },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const appointmentsPerMonth = monthlyRaw.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
        count: item.count,
    }));

    const patients = await Appointment.aggregate([
        { $match: { doctor: new mongoose.Types.ObjectId(doctor._id) } },
        {
            $group: {
                _id: {
                    user: "$user",
                    email: "$email",
                    userName: "$userName",
                    phone: "$phone",
                },
                count: { $sum: 1 },
                latestDate: { $max: "$createdAt" },
            },
        },
        { $sort: { latestDate: -1 } },
    ]);

    res.status(200).json({
        success: true,
        data: {
            doctor,
            stats: {
                totalAppointments: appointments.length,
                todayAppointments: todayAppointments.length,
                upcomingAppointments: upcomingAppointments.length,
                completedAppointments: appointmentsByStatus.completed,
                canceledAppointments: appointmentsByStatus.canceled,
                uniquePatients: patients.length,
            },
            appointmentsByStatus,
            appointmentsPerMonth,
            recentAppointments: appointments.slice(0, 8),
            upcomingAppointments: upcomingAppointments.slice(0, 8),
            patients: patients.slice(0, 10).map((item) => ({
                id: item._id.user || item._id.email,
                name: item._id.userName || item._id.email || "Patient",
                email: item._id.email || "",
                phone: item._id.phone || "",
                appointmentsCount: item.count,
                latestDate: item.latestDate,
            })),
        },
    });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const doctor = await resolveDoctorProfile(req.user);

    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid appointment status" });
    }

    const appointment = await Appointment.findOneAndUpdate(
        { _id: id, doctor: doctor._id },
        { status },
        { new: true, runValidators: true }
    )
        .populate("doctor")
        .populate("user", "name email phone");

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
});

module.exports = {
    getDashboard,
    updateAppointmentStatus,
    getDoctorAppointments,
    getDoctorPatients,
    updateDoctorProfile,
};