const Notification = require("../models/notification.model");

const createNotification = async ({
    user,
    type,
    title,
    titleAr,
    message,
    messageAr,
    relatedAppointment,
}) => {
    try {
        await Notification.create({
            user,
            type,
            title,
            titleAr,
            message,
            messageAr,
            relatedAppointment,
        });
    } catch (error) {
        console.error("Failed to create notification:", error.message);
    }
};

module.exports = createNotification;
