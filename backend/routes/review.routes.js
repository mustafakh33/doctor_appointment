const express = require("express");
const {
    createReview,
    getReviewsByDoctor,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
} = require("../controllers/review.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/").get(getAllReviews).post(protect, createReview);
router.route("/:id").get(getReviewById).patch(protect, updateReview).delete(protect, deleteReview);
router.route("/doctor/:doctorId").get(getReviewsByDoctor);

module.exports = router;