const cron = require("node-cron");
const Appointment = require("../models/appointment.model");
const { sendBookingReminder } = require("./sendBookingEmail");

cron.schedule("0 9 * * *", async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        const appointments = await Appointment.find({
            date: { $regex: tomorrowStr },
            status: { $in: ["confirmed", "pending"] },
        }).populate("doctor");

        for (const appointment of appointments) {
            if (appointment.doctor) {
                await sendBookingReminder(appointment, appointment.doctor);
            }
        }

        console.log(`[CRON] Sent ${appointments.length} appointment reminders`);
    } catch (error) {
        console.error("[CRON] Appointment reminder job failed:", error.message);
    }
});

module.exports = {};