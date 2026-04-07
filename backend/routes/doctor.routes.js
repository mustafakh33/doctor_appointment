const express = require("express");
const {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctor.controller");
const {
    uploadDoctorImage,
    resizeDoctorImage,
} = require("../middlewares/uploadImage");

const router = express.Router();

router
    .route("/")
    .get(getAllDoctors)
    .post(uploadDoctorImage, resizeDoctorImage, createDoctor);

router
    .route("/:id")
    .get(getDoctorById)
    .put(uploadDoctorImage, resizeDoctorImage, updateDoctor)
    .patch(uploadDoctorImage, resizeDoctorImage, updateDoctor)
    .delete(deleteDoctor);

module.exports = router;
