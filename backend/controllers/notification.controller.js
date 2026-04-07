const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification.model");

const isValidId = (id) => mongoose.isValidObjectId(id);

const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .populate("relatedAppointment")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: notifications.length, data: notifications });
});

const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    const notification = await Notification.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ success: true, data: notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
});

const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.status(200).json({ success: true, data: { count } });
});

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
