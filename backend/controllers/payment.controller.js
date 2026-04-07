const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_missing_key");
const Appointment = require("../models/appointment.model");
const ApiError = require("../utils/apiError");

const createPaymentIntent = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate("doctor");

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    const amount = appointment.doctor?.appointment_fee
        ? appointment.doctor.appointment_fee * 100
        : 10000;

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "egp",
        metadata: { appointmentId: appointment._id.toString() },
    });

    res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});

const confirmPayment = asyncHandler(async (req, res) => {
    const { appointmentId, paymentIntentId, amountPaid } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
            paymentStatus: "paid",
            paymentIntentId,
            amountPaid,
        },
        { new: true, runValidators: true }
    );

    if (!appointment) {
        throw new ApiError("Appointment not found", 404);
    }

    res.status(200).json({ success: true, message: "Payment confirmed" });
});

module.exports = {
    createPaymentIntent,
    confirmPayment,
};