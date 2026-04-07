const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "config.env") });

const Review = require("./models/review.model");
const User = require("./models/user.model");

const run = async () => {
    await mongoose.connect(process.env.DB_URI);

    const reviews = await Review.find({}, "_id user userProfileImage").lean();
    let updated = 0;

    for (const review of reviews) {
        if (review.userProfileImage || !review.user) continue;

        const user = await User.findById(review.user, "profileImage").lean();
        if (!user?.profileImage) continue;

        await Review.updateOne(
            { _id: review._id },
            { $set: { userProfileImage: user.profileImage } },
        );
        updated += 1;
    }

    console.log("Backfilled review userProfileImage count:", updated);
    await mongoose.disconnect();
};

run().catch(async (error) => {
    console.error("Backfill failed:", error.message);
    try {
        await mongoose.disconnect();
    } catch { }
    process.exit(1);
});
