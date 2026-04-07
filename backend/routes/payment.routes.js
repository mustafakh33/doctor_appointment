const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { createPaymentIntent, confirmPayment } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);

module.exports = router;