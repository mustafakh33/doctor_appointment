const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const User = require("./models/user.model");
const Doctor = require("./models/doctor.model");
const Category = require("./models/category.model");
const dbConnection = require("./db/database");

const resetAndSeedTestDoctor = async () => {
    try {
        await dbConnection();
        console.log("Connected to database");

        const doctorEmail = "ahmed.hassan.doc@example.com";
        const doctorPassword = "Doctor@123";

        // Delete existing doctor user and profile
        const existingUser = await User.findOne({ email: doctorEmail });
        if (existingUser) {
            // Delete doctor profile first
            await Doctor.deleteMany({ user: existingUser._id });
            console.log("Deleted existing doctor profile");

            // Delete user
            await User.deleteOne({ email: doctorEmail });
            console.log("Deleted existing doctor user");
        }

        // Get Cardiology category
        const category = await Category.findOne({ name: "Cardiology" });
        if (!category) {
            console.log("⚠️  Cardiology category not found. Run: node seed.js first");
            process.exit(1);
        }

        // Create new doctor user
        const doctorUser = await User.create({
            name: "Dr Ahmed Hassan",
            email: doctorEmail,
            password: doctorPassword,
            phone: "01012345678",
            cityArea: "Cairo, Nasr City",
            role: "doctor",
        });

        console.log(`✓ Doctor user created: ${doctorEmail}`);
        console.log(`  Password: ${doctorPassword}`);

        // Create doctor profile linked to the user
        const doctorProfile = await Doctor.create({
            name: "Dr Ahmed Hassan",
            address: "Cairo, Nasr City",
            about: "Experienced cardiologist specializing in heart diseases and cardiac catheterization",
            phone: "01012345678",
            year_of_experience: 20,
            appointment_fee: 500,
            category: category._id,
            user: doctorUser._id, // Link to user
        });

        console.log(`✓ Doctor profile created and linked to user`);
        console.log(`\n✅ Test doctor account ready to use!`);
        console.log(`\nLogin credentials:`);
        console.log(`  Email: ${doctorEmail}`);
        console.log(`  Password: ${doctorPassword}`);

        process.exit(0);
    } catch (error) {
        console.error("Error resetting test doctor:", error.message);
        process.exit(1);
    }
};

resetAndSeedTestDoctor();
