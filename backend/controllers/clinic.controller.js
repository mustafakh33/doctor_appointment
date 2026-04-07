const asyncHandler = require("express-async-handler");
const Clinic = require("../models/clinic.model");

const getOrCreateClinic = async () => {
    let clinic = await Clinic.findOne();

    if (!clinic) {
        clinic = await Clinic.create({});
    }

    return clinic;
};

const getClinic = asyncHandler(async (req, res) => {
    const clinic = await getOrCreateClinic();
    res.status(200).json({ success: true, data: clinic });
});

const updateClinic = asyncHandler(async (req, res) => {
    const clinic = await getOrCreateClinic();
    const updatedClinic = await Clinic.findByIdAndUpdate(clinic._id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedClinic });
});

module.exports = {
    getClinic,
    updateClinic,
};
