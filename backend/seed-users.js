const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const User = require("./models/user.model");
const Doctor = require("./models/doctor.model");
const Category = require("./models/category.model");
const dbConnection = require("./db/database");

const seedTestUsers = async () => {
    try {
        await dbConnection();
        console.log("Connected to database");

        // Test doctor user
        const doctorEmail = "ahmed.hassan.doc@example.com";
        const doctorPassword = "Doctor@123";

        // Check if doctor user already exists
        const existingDoctor = await User.findOne({ email: doctorEmail });
        if (existingDoctor) {
            console.log(`Doctor user with email ${doctorEmail} already exists`);
            console.log("To reset the password, delete the user and run the seed again");
        } else {
            // Get a category ID (Cardiology)
            const category = await Category.findOne({ name: "Cardiology" });
            if (!category) {
                console.log("⚠️  Cardiology category not found. Run: node seed.js first");
                process.exit(1);
            }

            // Create doctor user
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

            // Create doctor profile
            const doctorProfile = await Doctor.create({
                name: "Dr Ahmed Hassan",
                address: "Cairo, Nasr City",
                about: "Experienced cardiologist specializing in heart diseases",
                phone: "01012345678",
                year_of_experience: 20,
                appointment_fee: 500,
                categoryId: category._id,
                user: doctorUser._id,
            });

            console.log(`✓ Doctor profile created`);
        }

        // Test regular user
        const userEmail = "user@example.com";
        const userPassword = "User@123";

        const existingUser = await User.findOne({ email: userEmail });
        if (existingUser) {
            console.log(`User with email ${userEmail} already exists`);
        } else {
            const regularUser = await User.create({
                name: "Test User",
                email: userEmail,
                password: userPassword,
                phone: "01212345678",
                cityArea: "Cairo",
                role: "user",
            });

            console.log(`✓ Regular user created: ${userEmail}`);
            console.log(`  Password: ${userPassword}`);
        }

        console.log("\n✅ Test users seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding test users:", error.message);
        process.exit(1);
    }
};

seedTestUsers();
