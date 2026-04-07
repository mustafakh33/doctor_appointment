const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

const isValidId = (id) => mongoose.isValidObjectId(id);

const getLastSixMonthsStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 5, 1);
};

const formatMonthKey = (year, month) => {
    return `${year}-${String(month).padStart(2, "0")}`;
};

const getStats = asyncHandler(async (req, res) => {
    const [
        doctors,
        appointments,
        patients,
        categories,
        ratingAgg,
        confirmed,
        canceled,
    ] = await Promise.all([
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        User.countDocuments({ role: "user" }),
        Category.countDocuments(),
        Doctor.aggregate([{ $group: { _id: null, avgRating: { $avg: "$ratingsAverage" } } }]),
        Appointment.countDocuments({ status: "confirmed" }),
        Appointment.countDocuments({ status: "canceled" }),
    ]);

    const avgRating = Number((ratingAgg[0]?.avgRating || 0).toFixed(1));

    res.status(200).json({
        success: true,
        data: {
            doctors,
            appointments,
            patients,
            categories,
            avgRating,
            confirmed,
            canceled,
        },
    });
});

const getAllPatients = asyncHandler(async (req, res) => {
    const patients = await User.find({ role: "user" })
        .select("name email phone createdAt")
        .sort({ createdAt: -1 })
        .lean();

    const appointmentCounts = await Appointment.aggregate([
        {
            $match: {
                user: { $in: patients.map((patient) => patient._id) },
            },
        },
        {
            $group: {
                _id: "$user",
                count: { $sum: 1 },
            },
        },
    ]);

    const countMap = new Map(
        appointmentCounts.map((item) => [String(item._id), item.count])
    );

    const data = patients.map((patient) => ({
        ...patient,
        appointmentsCount: countMap.get(String(patient._id)) || 0,
    }));

    res.status(200).json({ success: true, count: data.length, data });
});

const getAllAppointmentsAdmin = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
        query.status = status;
    }

    const [total, appointments] = await Promise.all([
        Appointment.countDocuments(query),
        Appointment.find(query)
            .populate("doctor")
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
    ]);

    res.status(200).json({
        success: true,
        count: appointments.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit) || 1,
        },
        data: appointments,
    });
});

const getReports = asyncHandler(async (req, res) => {
    const startDate = getLastSixMonthsStart();

    const [appointmentsPerMonthRaw, topDoctorsRaw, appointmentsByStatusRaw, newPatientsRaw] =
        await Promise.all([
            Appointment.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Appointment.aggregate([
                {
                    $group: {
                        _id: "$doctor",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "doctors",
                        localField: "_id",
                        foreignField: "_id",
                        as: "doctor",
                    },
                },
                { $unwind: "$doctor" },
                {
                    $project: {
                        _id: 0,
                        doctorId: "$doctor._id",
                        name: "$doctor.name",
                        name_ar: "$doctor.name_ar",
                        count: 1,
                    },
                },
            ]),
            Appointment.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                    },
                },
            ]),
            User.aggregate([
                { $match: { role: "user", createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
        ]);

    const appointmentsPerMonth = appointmentsPerMonthRaw.map((item) => ({
        month: formatMonthKey(item._id.year, item._id.month),
        count: item.count,
    }));

    const newPatientsPerMonth = newPatientsRaw.map((item) => ({
        month: formatMonthKey(item._id.year, item._id.month),
        count: item.count,
    }));

    const appointmentsByStatus = {
        pending: 0,
        confirmed: 0,
        canceled: 0,
        completed: 0,
    };

    appointmentsByStatusRaw.forEach((item) => {
        if (item._id in appointmentsByStatus) {
            appointmentsByStatus[item._id] = item.count;
        }
    });

    res.status(200).json({
        success: true,
        data: {
            appointmentsPerMonth,
            topDoctors: topDoctorsRaw,
            appointmentsByStatus,
            newPatientsPerMonth,
        },
    });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    const allowedStatuses = ["pending", "confirmed", "canceled", "completed"];
    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid appointment status");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    )
        .populate("doctor")
        .populate("user", "name email phone");

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ success: true, data: appointment });
});

module.exports = {
    getStats,
    getAllPatients,
    getAllAppointmentsAdmin,
    getReports,
    updateAppointmentStatus,
};
