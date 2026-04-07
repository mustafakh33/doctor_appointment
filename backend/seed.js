const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const Category = require("./models/category.model");
const Doctor = require("./models/doctor.model");
const Review = require("./models/review.model");

const DB_URI = process.env.DB_URI;

const CATEGORY_FILENAMES = [
    "cat_cardiology.png",
    "cat_orthopedics.png",
    "cat_dermatology.png",
    "cat_pediatrics.png",
    "cat_neurology.png",
    "cat_ophthalmology.png",
    "cat_dentistry.png",
];

const DOCTOR_FILENAMES = [
    "doc1.png",
    "doc2.png",
    "doc3.png",
    "doc4.png",
    "doc5.png",
    "doc6.png",
    "doc7.png",
    "doc8.png",
    "doc9.png",
    "doc10.png",
    "doc11.png",
    "doc12.png",
    "doc13.png",
    "doc14.png",
    "doc15.png",
];

const categoriesData = [
    { name: "Cardiology", name_ar: "طب القلب", icon: "cat_cardiology.png" },
    { name: "Orthopedics", name_ar: "جراحة العظام", icon: "cat_orthopedics.png" },
    { name: "Dermatology", name_ar: "الجلدية", icon: "cat_dermatology.png" },
    { name: "Pediatrics", name_ar: "طب الأطفال", icon: "cat_pediatrics.png" },
    { name: "Neurology", name_ar: "طب الأعصاب", icon: "cat_neurology.png" },
    { name: "Ophthalmology", name_ar: "طب العيون", icon: "cat_ophthalmology.png" },
    { name: "Dentistry", name_ar: "طب الأسنان", icon: "cat_dentistry.png" },
];

const doctorsData = [
    {
        name: "Dr Ahmed Hassan",
        name_ar: "د. أحمد حسن",
        category: "Cardiology",
        image: "doc1.png",
        address: "Cairo, Nasr City",
        address_ar: "القاهرة، مدينة نصر",
        year_of_experience: 20,
        appointment_fee: 500,
        phone: "01012345678",
        about: "Experienced cardiologist specializing in heart diseases and cardiac catheterization",
        about_ar: "طبيب قلب متمرس متخصص في أمراض القلب وقسطرة القلب",
    },
    {
        name: "Dr Fatma El-Sayed",
        name_ar: "د. فاطمة السيد",
        category: "Cardiology",
        image: "doc2.png",
        address: "Alexandria, Smouha",
        address_ar: "الإسكندرية، سموحة",
        year_of_experience: 12,
        appointment_fee: 400,
        phone: "01123456789",
        about: "Expert in cardiovascular medicine with focus on preventive cardiology",
        about_ar: "خبيرة في طب القلب والأوعية الدموية مع التركيز على الوقاية من أمراض القلب",
    },
    {
        name: "Dr Youssef Tarek",
        name_ar: "د. يوسف طارق",
        category: "Orthopedics",
        image: "doc3.png",
        address: "Mansoura",
        address_ar: "المنصورة",
        year_of_experience: 15,
        appointment_fee: 300,
        phone: "01055555555",
        about: "Bone and joint specialist with expertise in sports injuries and joint replacement",
        about_ar: "أخصائي عظام ومفاصل بخبرة في إصابات الملاعب واستبدال المفاصل",
    },
    {
        name: "Dr Nour Abdallah",
        name_ar: "د. نور عبد الله",
        category: "Orthopedics",
        image: "doc4.png",
        address: "Cairo, Maadi",
        address_ar: "القاهرة، المعادي",
        year_of_experience: 10,
        appointment_fee: 350,
        phone: "01234567890",
        about: "Orthopedic surgeon specializing in spine and knee surgery",
        about_ar: "جراح عظام متخصص في جراحات العمود الفقري والركبة",
    },
    {
        name: "Dr Hana Mostafa",
        name_ar: "د. هنا مصطفى",
        category: "Dermatology",
        image: "doc5.png",
        address: "Giza, Dokki",
        address_ar: "الجيزة، الدقي",
        year_of_experience: 8,
        appointment_fee: 250,
        phone: "01098765432",
        about: "Dermatologist specializing in skincare, acne treatment, and cosmetic procedures",
        about_ar: "طبيبة جلدية متخصصة في العناية بالبشرة وعلاج حب الشباب والإجراءات التجميلية",
    },
    {
        name: "Dr Omar Khaled",
        name_ar: "د. عمر خالد",
        category: "Dermatology",
        image: "doc6.png",
        address: "Cairo, Heliopolis",
        address_ar: "القاهرة، مصر الجديدة",
        year_of_experience: 14,
        appointment_fee: 300,
        phone: "01567890123",
        about: "Skin specialist with expertise in laser treatments and allergic conditions",
        about_ar: "أخصائي جلدية بخبرة في جلسات الليزر وحالات الحساسية الجلدية",
    },
    {
        name: "Dr Sara Ibrahim",
        name_ar: "د. سارة إبراهيم",
        category: "Pediatrics",
        image: "doc7.png",
        address: "Cairo, Zamalek",
        address_ar: "القاهرة، الزمالك",
        year_of_experience: 18,
        appointment_fee: 200,
        phone: "01111222333",
        about: "Pediatrician with special focus on newborn care and childhood immunizations",
        about_ar: "طبيبة أطفال متخصصة في رعاية حديثي الولادة وتطعيمات الأطفال",
    },
    {
        name: "Dr Mohamed Adel",
        name_ar: "د. محمد عادل",
        category: "Pediatrics",
        image: "doc8.png",
        address: "Tanta",
        address_ar: "طنطا",
        year_of_experience: 7,
        appointment_fee: 180,
        phone: "01222333444",
        about: "General pediatrician treating common childhood illnesses and developmental issues",
        about_ar: "طبيب أطفال عام يعالج الأمراض الشائعة ومتابعة النمو والتطور لدى الأطفال",
    },
    {
        name: "Dr Layla Mansour",
        name_ar: "د. ليلى منصور",
        category: "Neurology",
        image: "doc9.png",
        address: "Cairo, Garden City",
        address_ar: "القاهرة، جاردن سيتي",
        year_of_experience: 22,
        appointment_fee: 600,
        phone: "01333444555",
        about: "Senior neurologist specializing in epilepsy, stroke recovery, and neurodegenerative diseases",
        about_ar: "استشارية أعصاب متخصصة في الصرع والتعافي بعد السكتات الدماغية والأمراض التنكسية العصبية",
    },
    {
        name: "Dr Karim Samy",
        name_ar: "د. كريم سامي",
        category: "Neurology",
        image: "doc10.png",
        address: "Alexandria, Stanley",
        address_ar: "الإسكندرية، ستانلي",
        year_of_experience: 16,
        appointment_fee: 450,
        phone: "01444555666",
        about: "Neurologist with expertise in headache disorders and multiple sclerosis",
        about_ar: "طبيب أعصاب بخبرة في اضطرابات الصداع والتصلب المتعدد",
    },
    {
        name: "Dr Amira Gamal",
        name_ar: "د. أميرة جمال",
        category: "Ophthalmology",
        image: "doc11.png",
        address: "Cairo, New Cairo",
        address_ar: "القاهرة، القاهرة الجديدة",
        year_of_experience: 11,
        appointment_fee: 350,
        phone: "01555666777",
        about: "Eye specialist performing LASIK, cataract surgery, and treating glaucoma",
        about_ar: "أخصائية عيون تجري عمليات الليزك والمياه البيضاء وتعالج المياه الزرقاء",
    },
    {
        name: "Dr Hassan Fouad",
        name_ar: "د. حسن فؤاد",
        category: "Ophthalmology",
        image: "doc12.png",
        address: "Mansoura",
        address_ar: "المنصورة",
        year_of_experience: 19,
        appointment_fee: 400,
        phone: "01666777888",
        about: "Senior ophthalmologist with extensive experience in retinal surgery",
        about_ar: "استشاري عيون بخبرة واسعة في جراحات الشبكية",
    },
    {
        name: "Dr Mariam Rizk",
        name_ar: "د. مريم رزق",
        category: "Dentistry",
        image: "doc13.png",
        address: "Cairo, Mohandessin",
        address_ar: "القاهرة، المهندسين",
        year_of_experience: 9,
        appointment_fee: 200,
        phone: "01777888999",
        about: "Cosmetic dentist specializing in dental implants, veneers, and smile design",
        about_ar: "طبيبة أسنان تجميلية متخصصة في زراعة الأسنان والفينير وتجميل الابتسامة",
    },
    {
        name: "Dr Ali Nasser",
        name_ar: "د. علي ناصر",
        category: "Dentistry",
        image: "doc14.png",
        address: "Giza, 6th October",
        address_ar: "الجيزة، السادس من أكتوبر",
        year_of_experience: 13,
        appointment_fee: 250,
        phone: "01888999000",
        about: "General dentist with expertise in root canal treatment and dental crowns",
        about_ar: "طبيب أسنان عام متخصص في علاج الجذور وتركيبات الأسنان",
    },
    {
        name: "Dr Dina Samir",
        name_ar: "د. دينا سمير",
        category: "Dentistry",
        image: "doc15.png",
        address: "Cairo, Nasr City",
        address_ar: "القاهرة، مدينة نصر",
        year_of_experience: 6,
        appointment_fee: 180,
        phone: "01999000111",
        about: "Pediatric dentist specialized in children's dental care and preventive dentistry",
        about_ar: "طبيبة أسنان أطفال متخصصة في رعاية أسنان الأطفال وطب الأسنان الوقائي",
    },
];

const reviewsData = [
    {
        doctor: "Dr Ahmed Hassan",
        userName: "Mahmoud Ali",
        email: "mahmoud@gmail.com",
        rating: 5,
        comment: "Excellent doctor! He explained everything clearly about my heart condition.",
    },
    {
        doctor: "Dr Ahmed Hassan",
        userName: "Salma Ahmed",
        email: "salma@gmail.com",
        rating: 4,
        comment: "Very professional and caring. The waiting time was a bit long though.",
    },
    {
        doctor: "Dr Fatma El-Sayed",
        userName: "Khaled Mostafa",
        email: "khaled.m@gmail.com",
        rating: 5,
        comment: "Saved my father's life! Best cardiologist in Alexandria.",
    },
    {
        doctor: "Dr Fatma El-Sayed",
        userName: "Nadia Hassan",
        email: "nadia.h@gmail.com",
        rating: 5,
        comment: "Very knowledgeable and takes time to listen to patients.",
    },
    {
        doctor: "Dr Youssef Tarek",
        userName: "Tarek Saeed",
        email: "tarek.s@gmail.com",
        rating: 4,
        comment: "Great orthopedic doctor. My knee is much better after treatment.",
    },
    {
        doctor: "Dr Youssef Tarek",
        userName: "Reem Adel",
        email: "reem.a@gmail.com",
        rating: 5,
        comment: "After years of back pain, Dr Youssef finally diagnosed my issue.",
    },
    {
        doctor: "Dr Nour Abdallah",
        userName: "Amr Magdy",
        email: "amr.m@gmail.com",
        rating: 4,
        comment: "Good doctor for sports injuries. Very knowledgeable and helpful.",
    },
    {
        doctor: "Dr Nour Abdallah",
        userName: "Yasmin Ezzat",
        email: "yasmin.e@gmail.com",
        rating: 3,
        comment: "Decent experience. The clinic was clean but had to wait too long.",
    },
    {
        doctor: "Dr Hana Mostafa",
        userName: "Mona Fathi",
        email: "mona.f@gmail.com",
        rating: 5,
        comment: "My skin has never looked better! Amazing dermatologist.",
    },
    {
        doctor: "Dr Hana Mostafa",
        userName: "Ahmed Zaki",
        email: "ahmed.z@gmail.com",
        rating: 4,
        comment: "Very good dermatologist. Solved my acne problem effectively.",
    },
    {
        doctor: "Dr Omar Khaled",
        userName: "Heba Salah",
        email: "heba.s@gmail.com",
        rating: 3,
        comment: "Good doctor but the clinic needs better organization and scheduling.",
    },
    {
        doctor: "Dr Omar Khaled",
        userName: "Yasser Nabil",
        email: "yasser.n@gmail.com",
        rating: 4,
        comment: "Experienced and friendly. Recommended for skin allergies and eczema.",
    },
    {
        doctor: "Dr Sara Ibrahim",
        userName: "Doaa Mohamed",
        email: "doaa.m@gmail.com",
        rating: 5,
        comment: "The best pediatrician for my kids! Very patient and gentle.",
    },
    {
        doctor: "Dr Sara Ibrahim",
        userName: "Hatem Ibrahim",
        email: "hatem.i@gmail.com",
        rating: 5,
        comment: "Dr Sara took amazing care of our newborn. Truly the best.",
    },
    {
        doctor: "Dr Mohamed Adel",
        userName: "Asmaa Ragab",
        email: "asmaa.r@gmail.com",
        rating: 4,
        comment: "Good pediatrician in Tanta. My son's fever was handled quickly.",
    },
    {
        doctor: "Dr Mohamed Adel",
        userName: "Wael Shaker",
        email: "wael.s@gmail.com",
        rating: 3,
        comment: "Average experience. He seems competent but rushes through appointments.",
    },
    {
        doctor: "Dr Layla Mansour",
        userName: "Sameh Gamal",
        email: "sameh.g@gmail.com",
        rating: 5,
        comment: "Best neurologist in Egypt. Very thorough and knowledgeable.",
    },
    {
        doctor: "Dr Layla Mansour",
        userName: "Fatma Youssef",
        email: "fatma.y@gmail.com",
        rating: 4,
        comment: "Very thorough examination and detailed diagnosis. Highly recommend.",
    },
    {
        doctor: "Dr Karim Samy",
        userName: "Ola Nasser",
        email: "ola.n@gmail.com",
        rating: 4,
        comment: "Great neurologist. Helped my mother with stroke rehabilitation.",
    },
    {
        doctor: "Dr Karim Samy",
        userName: "Ibrahim Farag",
        email: "ibrahim.f@gmail.com",
        rating: 5,
        comment: "Very caring doctor. Takes time to explain everything in detail.",
    },
    {
        doctor: "Dr Amira Gamal",
        userName: "Shady Hossam",
        email: "shady.h@gmail.com",
        rating: 4,
        comment: "Excellent LASIK surgery experience. My vision is perfect now.",
    },
    {
        doctor: "Dr Amira Gamal",
        userName: "Rania Tamer",
        email: "rania.t@gmail.com",
        rating: 5,
        comment: "Dr Amira is a genius! Best eye doctor I've ever visited.",
    },
    {
        doctor: "Dr Hassan Fouad",
        userName: "Said Mahmoud",
        email: "said.m@gmail.com",
        rating: 5,
        comment: "Performed my cataract surgery perfectly. Vision is crystal clear now.",
    },
    {
        doctor: "Dr Hassan Fouad",
        userName: "Neveen Ali",
        email: "neveen.a@gmail.com",
        rating: 4,
        comment: "Very experienced ophthalmologist. Professional clinic environment.",
    },
    {
        doctor: "Dr Mariam Rizk",
        userName: "Tamer Hosny",
        email: "tamer.h@gmail.com",
        rating: 5,
        comment: "Got dental implants done. The result is amazing and natural-looking!",
    },
    {
        doctor: "Dr Mariam Rizk",
        userName: "Aisha Kamel",
        email: "aisha.k@gmail.com",
        rating: 4,
        comment: "Great cosmetic dentist. My teeth whitening turned out perfect.",
    },
    {
        doctor: "Dr Ali Nasser",
        userName: "Hesham Fouad",
        email: "hesham.f@gmail.com",
        rating: 3,
        comment: "Decent dentist. Root canal was painless but the wait was very long.",
    },
    {
        doctor: "Dr Ali Nasser",
        userName: "Dalia Samy",
        email: "dalia.s@gmail.com",
        rating: 4,
        comment: "Good experience overall. Clean clinic and professional staff.",
    },
    {
        doctor: "Dr Dina Samir",
        userName: "Magdy Rateb",
        email: "magdy.r@gmail.com",
        rating: 5,
        comment: "My kids love Dr Dina! She makes dental visits fun for children.",
    },
    {
        doctor: "Dr Dina Samir",
        userName: "Ghada Osman",
        email: "ghada.o@gmail.com",
        rating: 4,
        comment: "Wonderful pediatric dentist. Very patient and gentle with kids.",
    },
];

const FRONTEND_CATEGORIES_DIR = path.join(
    __dirname,
    "..",
    "appointment_app",
    "public",
    "assets",
    "img",
    "Categories"
);

const FRONTEND_DOCTORS_DIR = path.join(
    __dirname,
    "..",
    "appointment_app",
    "public",
    "assets",
    "img",
    "Doctors"
);

const BACKEND_CATEGORIES_DIR = path.join(__dirname, "uploads", "categories");
const BACKEND_DOCTORS_DIR = path.join(__dirname, "uploads", "doctors");

function clearDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isFile()) {
            fs.unlinkSync(entryPath);
        }
    }
}

function copyImages(sourceDir, destinationDir) {
    if (!fs.existsSync(sourceDir)) {
        throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    fs.mkdirSync(destinationDir, { recursive: true });
    clearDirectory(destinationDir);

    const files = fs
        .readdirSync(sourceDir)
        .filter((file) => fs.statSync(path.join(sourceDir, file)).isFile());

    for (const file of files) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(destinationDir, file));
    }

    return files;
}

function assertExpectedFiles(files, expected, typeLabel) {
    const missing = expected.filter((file) => !files.includes(file));
    if (missing.length > 0) {
        throw new Error(
            `${typeLabel} source is missing expected files: ${missing.join(", ")}`
        );
    }
}

async function seed() {
    const startTime = Date.now();

    try {
        if (!DB_URI) {
            throw new Error("DB_URI is missing in config.env");
        }

        console.log("📁 Preparing image files...");
        const copiedCategoryFiles = copyImages(
            FRONTEND_CATEGORIES_DIR,
            BACKEND_CATEGORIES_DIR
        );
        const copiedDoctorFiles = copyImages(FRONTEND_DOCTORS_DIR, BACKEND_DOCTORS_DIR);

        assertExpectedFiles(copiedCategoryFiles, CATEGORY_FILENAMES, "Category images");
        assertExpectedFiles(copiedDoctorFiles, DOCTOR_FILENAMES, "Doctor images");

        console.log(`📁 Copied ${copiedCategoryFiles.length} category images`);
        console.log(`📁 Copied ${copiedDoctorFiles.length} doctor images`);

        await mongoose.connect(DB_URI);
        console.log("✅ Connected to MongoDB");

        await Review.deleteMany({});
        await Doctor.deleteMany({});
        await Category.deleteMany({});
        console.log("✅ All existing data deleted");

        const categoryMap = {};
        for (const categoryData of categoriesData) {
            const category = await Category.create(categoryData);
            categoryMap[category.name] = category;
        }
        console.log(`✅ Categories created: ${Object.keys(categoryMap).length}`);

        const doctors = [];
        const doctorMap = {};
        for (const doctorData of doctorsData) {
            const category = categoryMap[doctorData.category];
            const doctor = await Doctor.create({
                name: doctorData.name,
                name_ar: doctorData.name_ar,
                address: doctorData.address,
                address_ar: doctorData.address_ar,
                about: doctorData.about,
                about_ar: doctorData.about_ar,
                phone: doctorData.phone,
                year_of_experience: doctorData.year_of_experience,
                image: doctorData.image,
                category: category._id,
                appointment_fee: doctorData.appointment_fee,
            });

            doctors.push(doctor);
            doctorMap[doctor.name] = doctor;
        }
        console.log(`✅ Doctors created: ${doctors.length}`);

        for (const categoryName of Object.keys(categoryMap)) {
            const doctorIds = doctors
                .filter((doctor) => String(doctor.category) === String(categoryMap[categoryName]._id))
                .map((doctor) => doctor._id);

            await Category.findByIdAndUpdate(categoryMap[categoryName]._id, {
                doctors: doctorIds,
            });
        }
        console.log("✅ Categories updated with doctor references");

        let reviewsCreated = 0;
        for (const reviewData of reviewsData) {
            const doctor = doctorMap[reviewData.doctor];
            if (!doctor) {
                throw new Error(`Doctor not found for review: ${reviewData.doctor}`);
            }

            const review = new Review({
                userName: reviewData.userName,
                email: reviewData.email,
                doctor: doctor._id,
                rating: reviewData.rating,
                comment: reviewData.comment,
            });

            await review.save();
            reviewsCreated += 1;
        }
        console.log(`✅ Reviews created: ${reviewsCreated}`);

        const doctorsWithRatings = await Doctor.find({})
            .select("name ratingsAverage ratingsQuantity")
            .sort({ name: 1 })
            .lean();

        console.log("\nDoctor Ratings Summary");
        console.table(
            doctorsWithRatings.map((doctor) => ({
                name: doctor.name,
                ratingsAverage: doctor.ratingsAverage,
                ratingsQuantity: doctor.ratingsQuantity,
            }))
        );

        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Categories created total: ${Object.keys(categoryMap).length}`);
        console.log(`✅ Doctors created total: ${doctors.length}`);
        console.log(`✅ Reviews created total: ${reviewsCreated}`);
        console.log(`✅ Total time taken: ${elapsedSeconds}s`);

        await mongoose.disconnect();
        console.log("✅ MongoDB disconnected");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        try {
            await mongoose.disconnect();
            console.log("✅ MongoDB disconnected after error");
        } catch (disconnectError) {
            console.error("❌ Failed to disconnect MongoDB:", disconnectError);
        }
        process.exit(1);
    }
}

seed();
