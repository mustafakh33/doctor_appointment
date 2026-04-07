const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, html, text }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Doctor Appointment" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
    });
};

module.exports = sendEmail;