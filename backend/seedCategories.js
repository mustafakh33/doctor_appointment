const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const Category = require("./models/category.model");

const DB_URI = process.env.DB_URI;
const FRONTEND_ASSET_BASE_URL =
    process.env.FRONTEND_ASSET_BASE_URL || "http://localhost:3000";
const categoriesAssetsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "assets",
    "img",
    "Categories"
);

const categoriesSeedData = [
    { name_en: "Cardiology", name_ar: "طب القلب", image: "Cardiology.png" },
    {
        name_en: "Dermatology",
        name_ar: "طب الأمراض الجلدية",
        image: "Dermatology.png",
    },
    {
        name_en: "Facial Plastic Surgery",
        name_ar: "جراحة تجميل الوجه",
        image: "Facial Plastic Surgery.png",
    },
    {
        name_en: "Gastroenterology",
        name_ar: "طب الجهاز الهضمي",
        image: "Gastroenterology.png",
    },
    { name_en: "Gynecology", name_ar: "أمراض النساء", image: "Gynecology.png" },
    {
        name_en: "Neurology",
        name_ar: "طب المخ والأعصاب",
        image: "Neurology.png",
    },
    {
        name_en: "Ophthalmology",
        name_ar: "طب وجراحة العيون",
        image: "Ophthalmology.png",
    },
    {
        name_en: "Oral Health",
        name_ar: "صحة الفم والأسنان",
        image: "Oral Health.png",
    },
    {
        name_en: "Orthopedics",
        name_ar: "طب وجراحة العظام",
        image: "Orthopedics.png",
    },
    { name_en: "Otology", name_ar: "طب الأذن", image: "Otology.png" },
    {
        name_en: "Pulmonology",
        name_ar: "طب الأمراض الصدرية",
        image: "Pulmonology.png",
    },
    { name_en: "Rhinology", name_ar: "طب الأنف", image: "Rhinology.png" },
    {
        name_en: "Urology",
        name_ar: "طب المسالك البولية",
        image: "Urology.png",
    },
];

const buildImageUrl = (fileName) => {
    const encodedFileName = encodeURIComponent(fileName).replace(/%2F/g, "/");
    return `${FRONTEND_ASSET_BASE_URL}/assets/img/Categories/${encodedFileName}`;
};

const validateAssetsOrThrow = () => {
    const missingFiles = categoriesSeedData
        .map((item) => item.image)
        .filter((fileName) => !fs.existsSync(path.join(categoriesAssetsDir, fileName)));

    if (missingFiles.length) {
        throw new Error(
            `Missing category image files: ${missingFiles.join(", ")}. Expected under ${categoriesAssetsDir}`
        );
    }
};

const normalizeSeedData = () => {
    const uniqueByEnglishName = new Map();

    categoriesSeedData.forEach((item) => {
        const key = String(item.name_en || "").trim().toLowerCase();
        if (!key) return;

        if (!uniqueByEnglishName.has(key)) {
            const imageUrl = buildImageUrl(item.image);

            uniqueByEnglishName.set(key, {
                name: item.name_en,
                name_en: item.name_en,
                name_ar: item.name_ar,
                icon: imageUrl,
                image: imageUrl,
            });
        }
    });

    return Array.from(uniqueByEnglishName.values());
};

const seedCategories = async () => {
    if (!DB_URI) {
        throw new Error("DB_URI is missing in backend/config.env");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);
    console.log("Database connected");

    validateAssetsOrThrow();

    const categories = normalizeSeedData();

    console.log("Deleting existing categories...");
    const deleteResult = await Category.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount || 0} category documents`);

    console.log("Inserting categories...");
    const inserted = await Category.insertMany(categories, { ordered: true });

    console.log(`Seeded ${inserted.length} categories successfully`);
    inserted.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} | ${item.name_ar}`);
    });
};

seedCategories()
    .then(async () => {
        await mongoose.disconnect();
        console.log("Done");
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("Category seeding failed:", error.message);
        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error("Disconnect failed:", disconnectError.message);
        }
        process.exit(1);
    });
