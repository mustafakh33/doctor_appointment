const express = require("express");
const { getClinic, updateClinic } = require("../controllers/clinic.controller");

const router = express.Router();

router.route("/").get(getClinic).patch(updateClinic);

module.exports = router;
