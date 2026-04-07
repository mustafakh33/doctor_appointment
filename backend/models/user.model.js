const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            minlength: [2, "User name must be at least 2 characters long"],
        },
        name_ar: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        cityArea: {
            type: String,
            trim: true,
        },
        cityArea_ar: {
            type: String,
            trim: true,
        },
        profileImage: {
            type: String,
            default: "https://ui-avatars.com/api/?name=User&background=0f172a&color=ffffff",
        },
        role: {
            type: String,
            enum: ["user", "doctor", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        passwordResetCode: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
        },
        passwordResetVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const setUserImageUrl = (doc) => {
    if (!doc || !doc.profileImage) return;

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl || String(doc.profileImage).startsWith("http")) return;

    doc.profileImage = `${baseUrl}/uploads/users/${doc.profileImage}`;
};

userSchema.post("init", (doc) => {
    setUserImageUrl(doc);
});

userSchema.post("save", (doc) => {
    setUserImageUrl(doc);
});

module.exports = mongoose.model("User", userSchema);