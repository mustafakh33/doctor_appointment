const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config.env") });

const Doctor = require("./models/doctor.model");
const Category = require("./models/category.model");

const DB_URI = process.env.DB_URI;
const FRONTEND_ASSET_BASE_URL =
    process.env.FRONTEND_ASSET_BASE_URL || "http://localhost:3000";

const doctorsAssetsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "assets",
    "img",
    "Doctors"
);

const CATEGORY_NAME_MAP = {
    Cardiology: ["Cardiology"],
    Dermatology: ["Dermatology"],
    Neurology: ["Neurology"],
    Orthopedics: ["Orthopedics"],
    Pediatrics: ["Pediatrics"],
    Ophthalmology: ["Ophthalmology"],
    "Oral Health": ["Oral Health", "Dentistry"],
    Urology: ["Urology"],
    Pulmonology: ["Pulmonology"],
    Gastroenterology: ["Gastroenterology"],
};

const doctorBlueprints = [
    {
        name: "Dr Ahmed Hassan",
        name_ar: "د. أحمد حسن",
        categoryName: "Cardiology",
        address: "Cairo, Nasr City",
        address_ar: "القاهرة، مدينة نصر",
        year_of_experience: 18,
        appointment_fee: 500,
        phone: "01010000001",
        about: "Senior cardiology consultant specializing in hypertension, heart failure, and preventive cardiac care.",
        about_ar: "استشاري قلب أول متخصص في ضغط الدم وفشل عضلة القلب والوقاية القلبية.",
        ratingsAverage: 4.9,
        ratingsQuantity: 182,
    },
    {
        name: "Dr Fatma El Sayed",
        name_ar: "د. فاطمة السيد",
        categoryName: "Cardiology",
        address: "Alexandria, Smouha",
        address_ar: "الإسكندرية، سموحة",
        year_of_experience: 13,
        appointment_fee: 430,
        phone: "01010000002",
        about: "Cardiologist focused on noninvasive diagnostics, ECG interpretation, and long-term follow-up plans.",
        about_ar: "طبيبة قلب متخصصة في التشخيص غير التداخلي وقراءة رسم القلب وخطط المتابعة الطويلة.",
        ratingsAverage: 4.8,
        ratingsQuantity: 151,
    },
    {
        name: "Dr Youssef Tarek",
        name_ar: "د. يوسف طارق",
        categoryName: "Orthopedics",
        address: "Mansoura, University District",
        address_ar: "المنصورة، حي الجامعة",
        year_of_experience: 16,
        appointment_fee: 380,
        phone: "01010000003",
        about: "Orthopedic surgeon with expertise in sports injuries, arthroscopy, and modern rehabilitation protocols.",
        about_ar: "جراح عظام بخبرة في إصابات الملاعب والمناظير وبرامج التأهيل الحديثة.",
        ratingsAverage: 4.7,
        ratingsQuantity: 133,
    },
    {
        name: "Dr Nour Abdallah",
        name_ar: "د. نور عبد الله",
        categoryName: "Orthopedics",
        address: "Cairo, Maadi",
        address_ar: "القاهرة، المعادي",
        year_of_experience: 11,
        appointment_fee: 350,
        phone: "01010000004",
        about: "Specialist in spine and knee conditions with patient-centered treatment and pain management pathways.",
        about_ar: "متخصصة في العمود الفقري والركبة مع خطط علاج متمركزة حول المريض وإدارة الألم.",
        ratingsAverage: 4.6,
        ratingsQuantity: 112,
    },
    {
        name: "Dr Hana Mostafa",
        name_ar: "د. هنا مصطفى",
        categoryName: "Dermatology",
        address: "Giza, Dokki",
        address_ar: "الجيزة، الدقي",
        year_of_experience: 9,
        appointment_fee: 280,
        phone: "01010000005",
        about: "Dermatology specialist for acne, pigmentation, and laser skin rejuvenation treatments.",
        about_ar: "أخصائية جلدية لعلاج حب الشباب والتصبغات وتجديد البشرة بالليزر.",
        ratingsAverage: 4.8,
        ratingsQuantity: 167,
    },
    {
        name: "Dr Omar Khaled",
        name_ar: "د. عمر خالد",
        categoryName: "Dermatology",
        address: "Cairo, Heliopolis",
        address_ar: "القاهرة، مصر الجديدة",
        year_of_experience: 14,
        appointment_fee: 320,
        phone: "01010000006",
        about: "Clinical dermatologist experienced in eczema, psoriasis, and allergy-focused dermatology care.",
        about_ar: "طبيب جلدية إكلينيكي بخبرة في الإكزيما والصدفية وعلاجات الحساسية الجلدية.",
        ratingsAverage: 4.7,
        ratingsQuantity: 126,
    },
    {
        name: "Dr Sara Ibrahim",
        name_ar: "د. سارة إبراهيم",
        categoryName: "Pulmonology",
        address: "Cairo, Zamalek",
        address_ar: "القاهرة، الزمالك",
        year_of_experience: 17,
        appointment_fee: 260,
        phone: "01010000007",
        about: "Pulmonology consultant with strong focus on asthma control, chronic cough workup, and breathing function tests.",
        about_ar: "استشارية صدرية تركز على التحكم في الربو وتقييم السعال المزمن واختبارات وظائف التنفس.",
        ratingsAverage: 4.9,
        ratingsQuantity: 203,
    },
    {
        name: "Dr Mohamed Adel",
        name_ar: "د. محمد عادل",
        categoryName: "Otology",
        address: "Tanta, El Geish Street",
        address_ar: "طنطا، شارع الجيش",
        year_of_experience: 8,
        appointment_fee: 220,
        phone: "01010000008",
        about: "Otology specialist for middle ear infections, hearing loss evaluations, and balance disorders.",
        about_ar: "أخصائي طب الأذن لعلاج التهابات الأذن الوسطى وتقييم ضعف السمع واضطرابات الاتزان.",
        ratingsAverage: 4.6,
        ratingsQuantity: 97,
    },
    {
        name: "Dr Layla Mansour",
        name_ar: "د. ليلى منصور",
        categoryName: "Neurology",
        address: "Cairo, Garden City",
        address_ar: "القاهرة، جاردن سيتي",
        year_of_experience: 21,
        appointment_fee: 620,
        phone: "01010000009",
        about: "Neurology consultant for epilepsy, stroke recovery, and neurodegenerative disease management.",
        about_ar: "استشارية أعصاب للصرع والتعافي بعد الجلطات وإدارة الأمراض العصبية التنكسية.",
        ratingsAverage: 4.9,
        ratingsQuantity: 176,
    },
    {
        name: "Dr Karim Samy",
        name_ar: "د. كريم سامي",
        categoryName: "Neurology",
        address: "Alexandria, Stanley",
        address_ar: "الإسكندرية، ستانلي",
        year_of_experience: 15,
        appointment_fee: 470,
        phone: "01010000010",
        about: "Neurologist specialized in migraine, movement disorders, and neuromuscular evaluations.",
        about_ar: "طبيب أعصاب متخصص في الصداع النصفي واضطرابات الحركة وتقييم الأمراض العصبية العضلية.",
        ratingsAverage: 4.7,
        ratingsQuantity: 118,
    },
    {
        name: "Dr Amira Gamal",
        name_ar: "د. أميرة جمال",
        categoryName: "Ophthalmology",
        address: "Cairo, New Cairo",
        address_ar: "القاهرة، القاهرة الجديدة",
        year_of_experience: 12,
        appointment_fee: 390,
        phone: "01010000011",
        about: "Ophthalmology specialist for LASIK, cataract surgery planning, and glaucoma follow-up.",
        about_ar: "أخصائية عيون لعمليات الليزك والتجهيز لجراحات المياه البيضاء ومتابعة الجلوكوما.",
        ratingsAverage: 4.8,
        ratingsQuantity: 145,
    },
    {
        name: "Dr Hassan Fouad",
        name_ar: "د. حسن فؤاد",
        categoryName: "Ophthalmology",
        address: "Mansoura, Talkha",
        address_ar: "المنصورة، طلخا",
        year_of_experience: 20,
        appointment_fee: 430,
        phone: "01010000012",
        about: "Senior ophthalmologist with deep experience in retinal diseases and diabetic eye complications.",
        about_ar: "استشاري عيون بخبرة كبيرة في أمراض الشبكية ومضاعفات السكري على العين.",
        ratingsAverage: 4.9,
        ratingsQuantity: 162,
    },
    {
        name: "Dr Mariam Rizk",
        name_ar: "د. مريم رزق",
        categoryName: "Oral Health",
        address: "Cairo, Mohandessin",
        address_ar: "القاهرة، المهندسين",
        year_of_experience: 10,
        appointment_fee: 260,
        phone: "01010000013",
        about: "Cosmetic dental specialist for veneers, smile design, and minimally invasive restorations.",
        about_ar: "أخصائية أسنان تجميلية للفينير وتصميم الابتسامة والترميمات قليلة التدخل.",
        ratingsAverage: 4.8,
        ratingsQuantity: 129,
    },
    {
        name: "Dr Ali Nasser",
        name_ar: "د. علي ناصر",
        categoryName: "Oral Health",
        address: "Giza, 6th of October",
        address_ar: "الجيزة، السادس من أكتوبر",
        year_of_experience: 14,
        appointment_fee: 290,
        phone: "01010000014",
        about: "General dentist with advanced practice in endodontics, crowns, and restorative procedures.",
        about_ar: "طبيب أسنان عام بخبرة متقدمة في علاج الجذور والتيجان وإجراءات الترميم.",
        ratingsAverage: 4.6,
        ratingsQuantity: 101,
    },
    {
        name: "Dr Dina Samir",
        name_ar: "د. دينا سمير",
        categoryName: "Gynecology",
        address: "Cairo, Nasr City",
        address_ar: "القاهرة، مدينة نصر",
        year_of_experience: 7,
        appointment_fee: 210,
        phone: "01010000015",
        about: "Pediatric dentistry specialist focused on prevention, behavior guidance, and cavity management.",
        about_ar: "أخصائية أسنان أطفال تركز على الوقاية وتوجيه سلوك الطفل وعلاج التسوس.",
        ratingsAverage: 4.7,
        ratingsQuantity: 88,
    },
    {
        name: "Dr Mostafa Salah",
        name_ar: "د. مصطفى صلاح",
        categoryName: "Urology",
        address: "Cairo, Shubra",
        address_ar: "القاهرة، شبرا",
        year_of_experience: 16,
        appointment_fee: 410,
        phone: "01010000016",
        about: "Urology consultant for kidney stones, prostate conditions, and urinary tract disorders.",
        about_ar: "استشاري مسالك بولية لحصوات الكلى ومشاكل البروستاتا واضطرابات المسالك البولية.",
        ratingsAverage: 4.8,
        ratingsQuantity: 119,
    },
    {
        name: "Dr Reem Fathy",
        name_ar: "د. ريم فتحي",
        categoryName: "Pulmonology",
        address: "Cairo, Dokki",
        address_ar: "القاهرة، الدقي",
        year_of_experience: 12,
        appointment_fee: 360,
        phone: "01010000017",
        about: "Pulmonology specialist for asthma, COPD, and sleep-related breathing disorders.",
        about_ar: "أخصائية صدرية لعلاج الربو والانسداد الرئوي ومشكلات التنفس أثناء النوم.",
        ratingsAverage: 4.7,
        ratingsQuantity: 94,
    },
    {
        name: "Dr Tamer Hossam",
        name_ar: "د. تامر حسام",
        categoryName: "Gastroenterology",
        address: "Alexandria, Sidi Gaber",
        address_ar: "الإسكندرية، سيدي جابر",
        year_of_experience: 15,
        appointment_fee: 420,
        phone: "01010000018",
        about: "Gastroenterology doctor for endoscopy, IBS management, and chronic liver disease follow-up.",
        about_ar: "طبيب جهاز هضمي للمناظير وعلاج القولون العصبي ومتابعة أمراض الكبد المزمنة.",
        ratingsAverage: 4.8,
        ratingsQuantity: 111,
    },
    {
        name: "Dr Salma Nabil",
        name_ar: "د. سلمى نبيل",
        categoryName: "Facial Plastic Surgery",
        address: "Cairo, Sheikh Zayed",
        address_ar: "القاهرة، الشيخ زايد",
        year_of_experience: 9,
        appointment_fee: 300,
        phone: "01010000019",
        about: "Dermatologist for hair loss, scalp disorders, and personalized skin treatment plans.",
        about_ar: "طبيبة جلدية لعلاج تساقط الشعر ومشكلات فروة الرأس وخطط علاج بشرة مخصصة.",
        ratingsAverage: 4.6,
        ratingsQuantity: 86,
    },
    {
        name: "Dr Mahmoud Fares",
        name_ar: "د. محمود فارس",
        categoryName: "Rhinology",
        address: "Cairo, New Nozha",
        address_ar: "القاهرة، النزهة الجديدة",
        year_of_experience: 13,
        appointment_fee: 370,
        phone: "01010000020",
        about: "Orthopedic consultant for shoulder injuries, fracture recovery, and post-op rehabilitation.",
        about_ar: "استشاري عظام لإصابات الكتف والتعافي من الكسور والتأهيل بعد الجراحة.",
        ratingsAverage: 4.7,
        ratingsQuantity: 108,
    },
];

const buildImageUrl = (fileName) => {
    const encodedFileName = encodeURIComponent(fileName).replace(/%2F/g, "/");
    return `${FRONTEND_ASSET_BASE_URL}/assets/img/Doctors/${encodedFileName}`;
};

const getDoctorImageFiles = () => {
    if (!fs.existsSync(doctorsAssetsDir)) {
        throw new Error(`Doctors assets directory not found: ${doctorsAssetsDir}`);
    }

    const files = fs.readdirSync(doctorsAssetsDir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
        .filter((name) => name.toLowerCase() !== "default.png");

    const preferred = [
        "doc1.png", "doc2.png", "doc3.png", "doc4.png", "doc5.png",
        "doc6.png", "doc7.png", "doc8.png", "doc9.png", "doc10.png",
        "doc11.png", "doc12.png", "doc13.png", "doc14.png", "doc15.png",
        "doc16.jpg", "dec17.jpg", "dec18.jpg", "doc19.png", "doc20.jpg",
    ];

    const availablePreferred = preferred.filter((name) => files.includes(name));

    if (availablePreferred.length < 20) {
        const remaining = files
            .filter((name) => !availablePreferred.includes(name))
            .sort((a, b) => a.localeCompare(b));
        availablePreferred.push(...remaining);
    }

    const selected = availablePreferred.slice(0, 20);

    if (selected.length < 20) {
        throw new Error(
            `Need at least 20 doctor images, found ${selected.length}. Directory: ${doctorsAssetsDir}`
        );
    }

    return selected;
};

const buildCategoryLookup = (categories) => {
    const byName = new Map();

    categories.forEach((cat) => {
        const names = [cat.name, cat.name_en, cat.name_ar]
            .filter(Boolean)
            .map((v) => String(v).trim().toLowerCase());

        names.forEach((name) => {
            if (!byName.has(name)) {
                byName.set(name, cat._id);
            }
        });
    });

    return byName;
};

const resolveCategoryId = (categoryLookup, requestedCategory) => {
    const aliases = CATEGORY_NAME_MAP[requestedCategory] || [requestedCategory];

    for (const alias of aliases) {
        const id = categoryLookup.get(String(alias).trim().toLowerCase());
        if (id) return id;
    }

    return null;
};

const seedDoctors = async () => {
    if (!DB_URI) {
        throw new Error("DB_URI is missing in backend/config.env");
    }

    if (doctorBlueprints.length < 20) {
        throw new Error("doctorBlueprints must contain at least 20 entries");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DB_URI);
    console.log("Database connected");

    const categories = await Category.find({}, { _id: 1, name: 1, name_en: 1, name_ar: 1 }).lean();
    if (!categories.length) {
        throw new Error("No categories found. Run npm run seed:categories first.");
    }

    const categoryLookup = buildCategoryLookup(categories);
    const selectedImages = getDoctorImageFiles();

    const doctorsPayload = doctorBlueprints.slice(0, 20).map((doctor, index) => {
        const categoryId = resolveCategoryId(categoryLookup, doctor.categoryName);
        if (!categoryId) {
            throw new Error(`Unable to resolve category for doctor: ${doctor.name} (${doctor.categoryName})`);
        }

        return {
            ...doctor,
            categoryId,
            image: buildImageUrl(selectedImages[index]),
            location: {
                address: doctor.address,
                coordinates: [31.2357 + index * 0.001, 30.0444 + index * 0.001],
            },
        };
    });

    console.log("Deleting existing doctors...");
    const deleteResult = await Doctor.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount || 0} doctor documents`);

    // Reset reverse links before inserting the new doctor set.
    await Category.updateMany({}, { $set: { doctors: [] } });

    console.log("Inserting doctors...");
    const inserted = await Doctor.insertMany(doctorsPayload, { ordered: true });

    const doctorsByCategory = inserted.reduce((accumulator, doctor) => {
        const key = String(doctor.categoryId);
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(doctor._id);
        return accumulator;
    }, {});

    await Promise.all(
        Object.entries(doctorsByCategory).map(([categoryId, doctorIds]) =>
            Category.findByIdAndUpdate(categoryId, {
                $set: { doctors: doctorIds },
            })
        )
    );

    console.log(`Seeded ${inserted.length} doctors successfully`);
    inserted.forEach((doctor, index) => {
        console.log(
            `${index + 1}. ${doctor.name} | ${doctor.name_ar} | Rating: ${doctor.ratingsAverage} | Image: ${selectedImages[index]}`
        );
    });
};

seedDoctors()
    .then(async () => {
        await mongoose.disconnect();
        console.log("Done");
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("Doctor seeding failed:", error.message);
        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error("Disconnect failed:", disconnectError.message);
        }
        process.exit(1);
    });
