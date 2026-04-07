const sendEmail = require("./sendEmail");
const { createEmailTemplate } = require("./emailTemplates");

const buildAppointmentDetails = (appointment, doctor, locale = "en") => {
    const isAr = locale === "ar";
    const doctorName = doctor?.name || appointment?.doctor?.name || "Doctor";

    return `
        <div style="line-height: 1.8; font-size: 15px;">
            <p style="margin: 0 0 16px;">${isAr ? "مرحباً" : "Hello"} ${appointment?.userName || ""},</p>
            <p style="margin: 0 0 16px;">${isAr ? "تفاصيل الموعد:" : "Your appointment details:"}</p>
            <ul style="padding-left: 20px; margin: 0;">
                <li><strong>${isAr ? "الطبيب" : "Doctor"}:</strong> ${doctorName}</li>
                <li><strong>${isAr ? "التاريخ" : "Date"}:</strong> ${appointment?.date || ""}</li>
                <li><strong>${isAr ? "الوقت" : "Time"}:</strong> ${appointment?.time || ""}</li>
                <li><strong>${isAr ? "الحالة" : "Status"}:</strong> ${appointment?.status || "confirmed"}</li>
            </ul>
        </div>`;
};

const sendBookingConfirmation = async (appointment, doctor) => {
    if (!appointment?.email) return;

    const locale = appointment?.locale || "en";
    const html = createEmailTemplate({
        title: locale === "ar" ? "تم تأكيد موعدك" : "Your appointment is confirmed",
        body: buildAppointmentDetails(appointment, doctor, locale),
        locale,
    });

    await sendEmail({
        email: appointment.email,
        subject: locale === "ar" ? "تأكيد الموعد" : "Appointment Confirmation",
        html,
    });
};

const sendBookingCancellation = async (appointment, doctor) => {
    if (!appointment?.email) return;

    const locale = appointment?.locale || "en";
    const html = createEmailTemplate({
        title: locale === "ar" ? "تم إلغاء موعدك" : "Your appointment was canceled",
        body: `${buildAppointmentDetails(appointment, doctor, locale)}<p style="margin-top: 16px; color: #e74c3c;">${locale === "ar" ? "تم إلغاء الموعد. إذا أردت إعادة الحجز، يرجى زيارة الموقع." : "The appointment has been canceled. If you want to book again, please visit the site."}</p>`,
        locale,
    });

    await sendEmail({
        email: appointment.email,
        subject: locale === "ar" ? "إلغاء الموعد" : "Appointment Cancellation",
        html,
    });
};

const sendBookingReminder = async (appointment, doctor) => {
    if (!appointment?.email) return;

    const locale = appointment?.locale || "en";
    const html = createEmailTemplate({
        title: locale === "ar" ? "موعدك غداً" : "Your appointment is tomorrow",
        body: buildAppointmentDetails(appointment, doctor, locale),
        locale,
    });

    await sendEmail({
        email: appointment.email,
        subject: locale === "ar" ? "تذكير بالموعد" : "Appointment Reminder",
        html,
    });
};

module.exports = {
    sendBookingConfirmation,
    sendBookingCancellation,
    sendBookingReminder,
};