const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const dbConnection = require("./db/database");
const User = require("./models/user.model");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@doccura.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "System Admin";

const seedAdmin = async () => {
    try {
        await dbConnection();

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

        if (existingAdmin) {
            existingAdmin.name = ADMIN_NAME;
            existingAdmin.role = "admin";
            existingAdmin.password = ADMIN_PASSWORD;
            existingAdmin.isVerified = true;
            await existingAdmin.save();

            console.log("Updated existing admin account");
        } else {
            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: "admin",
                isVerified: true,
            });

            console.log("Created new admin account");
        }

        console.log("Admin login credentials:");
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed admin account:", error.message);
        process.exit(1);
    }
};

seedAdmin();
