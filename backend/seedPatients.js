const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const User = require("./models/user.model");
const Doctor = require("./models/doctor.model");
const Appointment = require("./models/appointment.model");
const Review = require("./models/review.model");
const Notification = require("./models/notification.model");

const DB_URI = process.env.DB_URI;
const FRONTEND_ASSET_BASE_URL =
    process.env.FRONTEND_ASSET_BASE_URL || "http://localhost:3000";

const userAssetsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "assets",
    "img",
    "user",
);

const patientBlueprints = [
    {
        name: "Mustafa Khaled",
        name_ar: "مصطفى خالد",
        email: "patient1@doccura.local",
        phone: "01030000001",
        cityArea: "Cairo",
        cityArea_ar: "القاهرة",
    },
    {
        name: "Menna Ashraf",
        name_ar: "منة أشرف",
        email: "patient2@doccura.local",
        phone: "01030000002",
        cityArea: "Giza",
        cityArea_ar: "الجيزة",
    },
    {
        name: "Omar Hany",
        name_ar: "عمر هاني",
        email: "patient3@doccura.local",
        phone: "01030000003",
        cityArea: "Alexandria",
        cityArea_ar: "الإسكندرية",
    },
    {
        name: "Nour Adel",
        name_ar: "نور عادل",
        email: "patient4@doccura.local",
        phone: "01030000004",
        cityArea: "Mansoura",
        cityArea_ar: "المنصورة",
    },
    {
        name: "Yasmin Tarek",
        name_ar: "ياسمين طارق",
        email: "patient5@doccura.local",
        phone: "01030000005",
        cityArea: "Tanta",
        cityArea_ar: "طنطا",
    },
];

const reviewSnippets = [
    "Professional doctor, very clear explanation and excellent follow-up.",
    "Great experience, highly recommended and clinic staff were very helpful.",
    "Doctor listened carefully and gave a practical treatment plan.",
    "Very good consultation and clear next steps for recovery.",
    "Excellent communication and accurate diagnosis.",
];

const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM"];

const buildImageUrl = (fileName) => {
    const encoded = encodeURIComponent(fileName).replace(/%2F/g, "/");
    return `${FRONTEND_ASSET_BASE_URL}/assets/img/user/${encoded}`;
};

const getPatientImageFiles = () => {
    if (!fs.existsSync(userAssetsDir)) {
        throw new Error(`User image directory not found: ${userAssetsDir}`);
    }

    const files = fs
        .readdirSync(userAssetsDir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
        .sort((a, b) => a.localeCompare(b));

    if (files.length < patientBlueprints.length) {
        throw new Error(
            `Need at least ${patientBlueprints.length} user images, found ${files.length}`,
        );
    }

    return files.slice(0, patientBlueprints.length);
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const buildPastDate = (offsetDays) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offsetDays);
    return formatDate(date);
};

const seedPatients = async () => {
    if (!DB_URI) {
        throw new Error("DB_URI is missing in backend/config.env");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);
    console.log("Database connected");

    const doctors = await Doctor.find({}, { _id: 1, name: 1 }).lean();
    if (!doctors.length) {
        throw new Error("No doctors found. Run npm run seed:doctors first.");
    }

    console.log("Resetting patient-linked collections (notifications, appointments, reviews)...");
    await Notification.deleteMany({});
    await Appointment.deleteMany({});
    await Review.deleteMany({});
    console.log("Patient-linked collections cleared");

    const deletedUsers = await User.deleteMany({ role: "user" });
    console.log(`Deleted ${deletedUsers.deletedCount || 0} patient users`);

    const images = getPatientImageFiles();
    const createdPatients = [];

    console.log("Creating 5 patient users...");
    for (let index = 0; index < patientBlueprints.length; index += 1) {
        const blueprint = patientBlueprints[index];
        const patient = await User.create({
            ...blueprint,
            password: "User@123",
            role: "user",
            isVerified: true,
            profileImage: buildImageUrl(images[index]),
        });
        createdPatients.push(patient);
    }

    console.log("Creating completed appointments and reviews for all doctors...");
    let appointmentCount = 0;
    let reviewCount = 0;

    for (let patientIndex = 0; patientIndex < createdPatients.length; patientIndex += 1) {
        const patient = createdPatients[patientIndex];

        for (let doctorIndex = 0; doctorIndex < doctors.length; doctorIndex += 1) {
            const doctor = doctors[doctorIndex];
            const uniqueOffset = 5 + patientIndex * doctors.length + doctorIndex;

            await Appointment.create({
                userName: patient.name,
                email: patient.email,
                phone: patient.phone,
                notes: "Auto-generated seed appointment for demo data.",
                user: patient._id,
                doctor: doctor._id,
                date: buildPastDate(uniqueOffset),
                time: timeSlots[(patientIndex + doctorIndex) % timeSlots.length],
                status: "completed",
            });
            appointmentCount += 1;

            const rating = 4 + ((patientIndex + doctorIndex) % 2);
            const snippet = reviewSnippets[(patientIndex + doctorIndex) % reviewSnippets.length];

            await Review.create({
                userName: patient.name,
                userName_ar: patient.name_ar,
                email: patient.email,
                userProfileImage: patient.profileImage,
                user: patient._id,
                doctor: doctor._id,
                rating,
                comment: `${snippet} (${doctor.name})`,
            });
            reviewCount += 1;
        }
    }

    console.log("\nSeeding complete:");
    console.log(`- Patients created: ${createdPatients.length}`);
    console.log(`- Appointments created: ${appointmentCount}`);
    console.log(`- Reviews created: ${reviewCount}`);
    console.log("\nPatient login password for all seeded users: User@123");
    createdPatients.forEach((patient, index) => {
        console.log(`${index + 1}. ${patient.email}`);
    });
};

seedPatients()
    .then(async () => {
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("Patient seeding failed:", error.message);
        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error("Disconnect failed:", disconnectError.message);
        }
        process.exit(1);
    });
