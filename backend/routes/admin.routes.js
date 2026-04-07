const express = require("express");
const {
    getStats,
    getAllPatients,
    getAllAppointmentsAdmin,
    updateAppointmentStatus,
    getReports,
} = require("../controllers/admin.controller");
const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctor.controller");
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");
const { protect, allowedTo } = require("../middlewares/auth.middleware");
const {
    uploadDoctorImage,
    resizeDoctorImage,
    uploadCategoryImage,
    resizeCategoryImage,
} = require("../middlewares/uploadImage");

const router = express.Router();

router.use(protect, allowedTo("admin"));

router.get("/stats", getStats);
router.get("/patients", getAllPatients);
router.get("/appointments", getAllAppointmentsAdmin);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.get("/reports", getReports);

router
    .route("/doctors")
    .get(getAllDoctors)
    .post(uploadDoctorImage, resizeDoctorImage, createDoctor);

router
    .route("/doctors/:id")
    .get(getDoctorById)
    .patch(uploadDoctorImage, resizeDoctorImage, updateDoctor)
    .delete(deleteDoctor);

router
    .route("/categories")
    .get(getAllCategories)
    .post(uploadCategoryImage, resizeCategoryImage, createCategory);

router
    .route("/categories/:id")
    .patch(uploadCategoryImage, resizeCategoryImage, updateCategory)
    .delete(deleteCategory);

module.exports = router;
