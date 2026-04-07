const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

const generateToken = (payload) =>
    jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "30d",
    });

module.exports = generateToken;